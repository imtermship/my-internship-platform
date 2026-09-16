export default function QuickActionCard({ icon, title, description, onClick }) {
  return (
    <div className="card p-6 hover:shadow-xl transition cursor-pointer border-l-4 border-primary-500" onClick={onClick}>
      <div className="flex items-start space-x-4">
        <div className="text-3xl text-primary-600">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-slate-600 text-sm mt-1">{description}</p>
        </div>
        <span className="text-2xl text-primary-300">→</span>
      </div>
    </div>
  );
}
