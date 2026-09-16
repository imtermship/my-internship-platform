export default function ApplicationCard({ studentName, appliedDate, status, onReview }) {
  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="card p-4 flex items-center justify-between hover:shadow-lg transition">
      <div className="flex items-center space-x-4">
        <img src="https://via.placeholder.com/50" alt={studentName} className="w-12 h-12 rounded-full" />
        <div>
          <h4 className="font-semibold text-slate-900">{studentName}</h4>
          <p className="text-sm text-slate-600">{appliedDate}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status}
        </span>
        <button onClick={onReview} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
          Review
        </button>
      </div>
    </div>
  );
}
