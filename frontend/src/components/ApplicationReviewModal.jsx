import { useState } from 'react';
import { useApplicationStore } from '@/lib/stores';
import QRCode from 'qrcode.react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

export default function ApplicationReviewModal({ application, onClose }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(null);
  const { acceptApplication, rejectApplication } = useApplicationStore();

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const result = await acceptApplication(application.id);
      setShowConfirmation({ type: 'accepted', data: result });
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      alert('Error accepting application: ' + error.message);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await rejectApplication(application.id, rejectionReason);
      setShowConfirmation({ type: 'rejected' });
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      alert('Error rejecting application: ' + error.message);
    } finally {
      setIsRejecting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          {showConfirmation.type === 'accepted' ? (
            <>
              <div className="text-6xl mb-4 text-center text-green-500">
                <FiCheckCircle size={60} className="inline" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Application Accepted!</h2>
              <p className="text-slate-600 mb-6">Acceptance PDF and verification code have been generated.</p>
              {showConfirmation.data?.acceptance?.verificationCode && (
                <div className="bg-slate-100 p-4 rounded-lg mb-4">
                  <p className="text-sm text-slate-600 mb-2">Verification Code:</p>
                  <p className="font-mono font-bold text-lg text-primary-600">{showConfirmation.data.acceptance.verificationCode}</p>
                </div>
              )}
              {showConfirmation.data?.acceptance?.qrCode && (
                <div className="flex justify-center mb-4">
                  <QRCode value={showConfirmation.data.acceptance.qrCode} size={150} />
                </div>
              )}
              <p className="text-sm text-slate-500">Student will be notified automatically.</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4 text-center text-red-500">
                <FiX size={60} className="inline" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Application Rejected</h2>
              <p className="text-slate-600">Student has been notified of the rejection.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-blue text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Review Application</h2>
          <button onClick={onClose} className="text-2xl hover:opacity-80">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Student Information</h3>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p><span className="font-semibold text-slate-600">Name:</span> {application.student_name || 'John Doe'}</p>
              <p><span className="font-semibold text-slate-600">Email:</span> {application.email || 'john@example.com'}</p>
              <p><span className="font-semibold text-slate-600">Applied:</span> {new Date(application.applied_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Internship Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Internship Details</h3>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p><span className="font-semibold text-slate-600">Position:</span> {application.internship_title || 'Frontend Developer'}</p>
              <p><span className="font-semibold text-slate-600">Status:</span> <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{application.status}</span></p>
            </div>
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Cover Letter</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">{application.cover_letter}</p>
              </div>
            </div>
          )}

          {/* Decision Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Make a Decision</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Accept Button */}
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="px-6 py-3 bg-gradient-green text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {isAccepting ? 'Processing...' : '✓ Accept'}
              </button>

              {/* Reject Button */}
              <button
                onClick={() => setShowConfirmation({ type: 'reject-prompt' })}
                disabled={isRejecting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {isRejecting ? 'Processing...' : '✕ Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
