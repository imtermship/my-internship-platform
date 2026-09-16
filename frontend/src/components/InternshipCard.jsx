import Image from 'next/image';

export default function InternshipCard({ title, company, location, salary, duration, image, onClick }) {
  return (
    <div className="card hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer overflow-hidden" onClick={onClick}>
      {/* Image Header */}
      <div className="h-40 bg-gradient-blue relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">💼</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-primary-600 font-semibold mb-3">{company}</p>
        
        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⏱️</span>
            <span>{duration}</span>
          </div>
          {salary && (
            <div className="flex items-center space-x-2">
              <span>💰</span>
              <span className="font-semibold text-success-600">{salary}</span>
            </div>
          )}
        </div>

        <button className="w-full bg-gradient-blue text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">
          View Details
        </button>
      </div>
    </div>
  );
}
