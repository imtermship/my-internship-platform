export default function MetricCard({ icon, title, value, trend, trendValue, gradient }) {
  return (
    <div className={`card p-6 ${gradient}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-4xl">{icon}</div>
            <div>
              <p className="text-white/80 text-sm">{title}</p>
              <p className="text-white text-3xl font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <div className={`text-sm ${ trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue} from last month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
