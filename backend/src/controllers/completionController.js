const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const markInternshipComplete = async (req, res) => {
  try {
    const { placementId } = req.body;
    const { userId } = req.user;

    // Get placement details
    const placementResult = await pool.query(
      `SELECT p.*, c.user_id as company_user_id, s.user_id as student_user_id, 
              i.id as institution_id, int.title as internship_title, u.first_name, u.last_name
       FROM placements p
       JOIN companies c ON p.company_id = c.id
       JOIN student_profiles s ON p.student_id = s.id
       LEFT JOIN institutions inst ON p.institution_id = inst.id
       JOIN internship_listings int ON p.internship_id = int.id
       JOIN users u ON s.user_id = u.id
       WHERE p.id = $1`,
      [placementId]
    );

    if (placementResult.rows.length === 0) {
      return res.status(404).json({ error: 'Placement not found' });
    }

    const placement = placementResult.rows[0];

    // Verify company ownership
    if (placement.company_user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update placement status
    await pool.query('UPDATE placements SET status = $1, updated_at = NOW() WHERE id = $2', ['completed', placementId]);

    // Generate completion record
    const completionRecordId = uuidv4();
    const pdfUrl = await generateCompletionPDF(placement);

    await pool.query(
      'INSERT INTO completion_records (id, placement_id, document_url, completed_at) VALUES ($1, $2, $3, NOW())',
      [completionRecordId, placementId, pdfUrl]
    );

    // Create audit event
    await pool.query(
      `INSERT INTO audit_events (id, entity_type, entity_id, event_type, actor_id, changes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), 'placement', placementId, 'completed', userId, JSON.stringify({ status: 'completed', completedAt: new Date() })]
    );

    // Notify student
    await createNotification(placement.student_user_id, 'completion', `Your internship at ${placement.company_id} has been marked complete!`, {
      placementId,
      completionRecordId,
      pdfUrl,
    });

    // Notify institution
    if (placement.institution_id) {
      await createNotification(
        null,
        'completion',
        `Internship completed for ${placement.first_name} ${placement.last_name}`,
        { placementId, completionRecordId }
      );
    }

    res.json({
      message: 'Internship marked as complete',
      completionRecord: {
        completionRecordId,
        pdfUrl,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateCompletionPDF = async (placement) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filename = `completion-${placement.student_id}-${Date.now()}.pdf`;
      const filepath = path.join(uploadsDir, filename);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('INTERNSHIP COMPLETION RECORD', 50, 50);
      doc.fontSize(10).font('Helvetica').text('MY Internship Platform', 50, 85);

      // Divider
      doc.moveTo(50, 105).lineTo(550, 105).stroke();

      // Student Info
      doc.fontSize(12).font('Helvetica-Bold').text('STUDENT INFORMATION', 50, 125);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${placement.first_name} ${placement.last_name}`, 50, 150);

      // Internship Details
      doc.fontSize(12).font('Helvetica-Bold').text('INTERNSHIP DETAILS', 50, 200);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Position: ${placement.internship_title}`, 50, 225);
      doc.text(`Start Date: ${placement.start_date}`, 50, 245);
      doc.text(`End Date: ${placement.end_date}`, 50, 265);
      doc.text(`Status: COMPLETED ✓`, 50, 285);

      // Footer
      doc.fontSize(9).font('Helvetica').text(`Completed: ${new Date().toLocaleDateString()}`, 50, 530);

      doc.end();
      stream.on('finish', () => resolve(`/uploads/${filename}`));
    } catch (error) {
      reject(error);
    }
  });
};

const createNotification = async (userId, type, message, data) => {
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

module.exports = { markInternshipComplete };
