import { useState } from 'react';
import { useInternshipStore } from '@/lib/stores';
import { useAuthStore } from '@/lib/authStore';

export default function ApplicationModal({ internship, onClose }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { submitApplication } = useInternshipStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitApplication(internship.id, coverLetter);
      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      alert('Error submitting application: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Application Submitted!</h2>
          <p className="text-slate-600">We'll notify you when the employer reviews your application.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-blue text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Apply for {internship.title}</h2>
          <button onClick={onClose} className="text-2xl hover:opacity-80">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
            <input type="text" value={internship.company} disabled className="w-full px-4 py-2 bg-slate-100 rounded-lg" />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Position</label>
            <input type="text" value={internship.title} disabled className="w-full px-4 py-2 bg-slate-100 rounded-lg" />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're interested in this position..."
              rows="6"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
