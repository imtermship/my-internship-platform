const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const submitApplication = async (req, res) => {
  try {
    const { internshipId, coverLetter } = req.body;
    const { userId } = req.user;

    // Get student profile
    const studentResult = await pool.query('SELECT id FROM student_profiles WHERE user_id = $1', [userId]);
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const studentId = studentResult.rows[0].id;
    const applicationId = uuidv4();

    // Check if already applied
    const existingApp = await pool.query(
      'SELECT * FROM applications WHERE internship_id = $1 AND student_id = $2',
      [internshipId, studentId]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied for this internship' });
    }

    // Create application
    await pool.query(
      `INSERT INTO applications (id, internship_id, student_id, status, cover_letter, applied_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [applicationId, internshipId, studentId, 'applied', coverLetter]
    );

    res.status(201).json({ message: 'Application submitted successfully', applicationId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const { userId } = req.user;
    const { role } = req.query;

    let query, params;

    if (role === 'employer') {
      // Get applications for company's internships
      query = `
        SELECT a.*, s.user_id as student_user_id, i.title as internship_title
        FROM applications a
        JOIN student_profiles s ON a.student_id = s.id
        JOIN internship_listings i ON a.internship_id = i.id
        JOIN companies c ON i.company_id = c.id
        WHERE c.user_id = $1
        ORDER BY a.applied_at DESC
      `;
      params = [userId];
    } else {
      // Get student's applications
      query = `
        SELECT a.*, i.title as internship_title, c.company_name
        FROM applications a
        JOIN internship_listings i ON a.internship_id = i.id
        JOIN companies c ON i.company_id = c.id
        JOIN student_profiles s ON a.student_id = s.id
        WHERE s.user_id = $1
        ORDER BY a.applied_at DESC
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);
    res.json({ applications: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const { userId } = req.user;

    // Get application details
    const appResult = await pool.query(
      `SELECT a.*, i.id as internship_id, i.title, i.start_date, i.end_date, 
              c.id as company_id, c.company_name, s.id as student_id, u.email as student_email,
              sp.user_id as student_user_id, inst.id as institution_id
       FROM applications a
       JOIN internship_listings i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       JOIN student_profiles s ON a.student_id = s.id
       JOIN users u ON s.user_id = u.id
       LEFT JOIN student_profiles sp ON s.id = sp.id
       LEFT JOIN institutions inst ON sp.institution_id = inst.id
       WHERE a.id = $1`,
      [applicationId]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const app = appResult.rows[0];

    // Verify employer owns this company
    const companyCheck = await pool.query('SELECT * FROM companies WHERE id = $1 AND user_id = $2', [
      app.company_id,
      userId,
    ]);

    if (companyCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to accept this application' });
    }

    // Update application status
    await pool.query('UPDATE applications SET status = $1, decided_at = NOW() WHERE id = $2', ['accepted', applicationId]);

    // Create placement
    const placementId = uuidv4();
    await pool.query(
      `INSERT INTO placements (id, application_id, company_id, student_id, institution_id, internship_id, status, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [placementId, applicationId, app.company_id, app.student_id, app.institution_id, app.internship_id, 'active', app.start_date, app.end_date]
    );

    // Generate acceptance record with verification code
    const verificationCode = crypto.randomBytes(16).toString('hex').toUpperCase();
    const acceptanceId = uuidv4();

    const qrData = JSON.stringify({
      acceptanceId,
      verificationCode,
      studentId: app.student_id,
      companyId: app.company_id,
      internshipId: app.internship_id,
    });

    const qrImage = await QRCode.toDataURL(qrData);

    await pool.query(
      `INSERT INTO acceptance_records (id, placement_id, verification_code, qr_code_data)
       VALUES ($1, $2, $3, $4)`,
      [acceptanceId, placementId, verificationCode, qrImage]
    );

    // Generate PDF
    const pdfPath = await generateAcceptancePDF(app, verificationCode, qrImage);

    // Create notification for student
    await createNotification(app.student_user_id, 'acceptance', `Your application has been accepted by ${app.company_name}!`, {
      applicationId,
      internshipTitle: app.title,
      company: app.company_name,
    });

    // Create notification for institution
    if (app.institution_id) {
      await createNotification(
        null,
        'placement',
        `Student accepted for ${app.title} at ${app.company_name}`,
        { placementId, internshipTitle: app.title },
        app.institution_id
      );
    }

    res.json({
      message: 'Application accepted successfully',
      acceptance: {
        acceptanceId,
        verificationCode,
        pdfUrl: pdfPath,
        qrCode: qrImage,
        placementId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { applicationId, reason } = req.body;
    const { userId } = req.user;

    // Verify company ownership
    const appResult = await pool.query(
      `SELECT a.*, c.id as company_id, s.user_id as student_user_id, c.user_id as company_user_id
       FROM applications a
       JOIN internship_listings i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       JOIN student_profiles s ON a.student_id = s.id
       WHERE a.id = $1`,
      [applicationId]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const app = appResult.rows[0];

    if (app.company_user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update application status
    await pool.query('UPDATE applications SET status = $1, decided_at = NOW() WHERE id = $2', ['rejected', applicationId]);

    // Notify student
    await createNotification(app.student_user_id, 'rejection', 'Your application has been rejected', {
      applicationId,
      reason: reason || 'No reason provided',
    });

    res.json({ message: 'Application rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyAcceptance = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    const result = await pool.query(
      `SELECT ar.*, p.*, i.title as internship_title, c.company_name, u.first_name, u.last_name
       FROM acceptance_records ar
       JOIN placements p ON ar.placement_id = p.id
       JOIN internship_listings i ON p.internship_id = i.id
       JOIN companies c ON p.company_id = c.id
       JOIN student_profiles s ON p.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE ar.verification_code = $1`,
      [verificationCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid verification code' });
    }

    const record = result.rows[0];

    res.json({
      verified: true,
      acceptance: {
        studentName: `${record.first_name} ${record.last_name}`,
        company: record.company_name,
        internship: record.internship_title,
        duration: `${record.start_date} - ${record.end_date}`,
        status: 'Accepted',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmAcceptance = async (req, res) => {
  try {
    const { acceptanceId } = req.body;
    const { userId } = req.user;

    // Verify company
    const result = await pool.query(
      `SELECT ar.*, p.company_id, c.user_id
       FROM acceptance_records ar
       JOIN placements p ON ar.placement_id = p.id
       JOIN companies c ON p.company_id = c.id
       WHERE ar.id = $1`,
      [acceptanceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Acceptance record not found' });
    }

    const record = result.rows[0];
    if (record.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update acceptance record
    await pool.query(
      'UPDATE acceptance_records SET verified_at = NOW(), verified_by_company = $1 WHERE id = $2',
      [record.company_id, acceptanceId]
    );

    // Create audit event
    await pool.query(
      `INSERT INTO audit_events (id, entity_type, entity_id, event_type, actor_id, changes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), 'acceptance_record', acceptanceId, 'verified', userId, JSON.stringify({ verified_at: new Date() })]
    );

    res.json({ message: 'Acceptance confirmed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateAcceptancePDF = async (app, verificationCode, qrImage) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filename = `acceptance-${app.student_id}-${Date.now()}.pdf`;
      const filepath = path.join(uploadsDir, filename);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('INTERNSHIP ACCEPTANCE CERTIFICATE', 100, 50);
      doc.fontSize(10).font('Helvetica').text('MY Internship Platform', 100, 80);

      // Divider
      doc.moveTo(50, 100).lineTo(550, 100).stroke();

      // Content
      doc.fontSize(12).font('Helvetica-Bold').text('STUDENT INFORMATION', 50, 120);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${app.first_name} ${app.last_name}`, 50, 145);
      doc.text(`Email: ${app.email}`, 50, 165);

      doc.fontSize(12).font('Helvetica-Bold').text('COMPANY INFORMATION', 50, 200);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Company: ${app.company_name}`, 50, 225);

      doc.fontSize(12).font('Helvetica-Bold').text('INTERNSHIP DETAILS', 50, 260);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Position: ${app.title}`, 50, 285);
      doc.text(`Start Date: ${app.start_date}`, 50, 305);
      doc.text(`End Date: ${app.end_date}`, 50, 325);

      doc.fontSize(12).font('Helvetica-Bold').text('VERIFICATION CODE', 50, 360);
      doc.fontSize(14).font('Helvetica-Bold').text(verificationCode, 50, 385);

      // QR Code
      doc.fontSize(10).font('Helvetica').text('Scan QR Code to Verify', 380, 360);
      if (qrImage) {
        doc.image(qrImage, 370, 380, { width: 100, height: 100 });
      }

      // Footer
      doc.fontSize(9).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, 50, 530);

      doc.end();
      stream.on('finish', () => resolve(`/uploads/${filename}`));
    } catch (error) {
      reject(error);
    }
  });
};

const createNotification = async (userId, type, message, data, institutionId = null) => {
  try {
    const notificationId = uuidv4();
    await pool.query(
      'INSERT INTO notifications (id, user_id, type, message, data, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [notificationId, userId, type, message, JSON.stringify(data)]
    );
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
};

module.exports = { submitApplication, getApplications, acceptApplication, rejectApplication, verifyAcceptance, confirmAcceptance };
