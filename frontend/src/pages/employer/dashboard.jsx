import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import MetricCard from '@/components/MetricCard';
import QuickActionCard from '@/components/QuickActionCard';
import ApplicationCard from '@/components/ApplicationCard';
import { FiBriefcase, FiUsers, FiCheckCircle, FiBarChart3, FiPlus, FiFileText, FiTrendingUp } from 'react-icons/fi';

export default function EmployerDashboard() {
  const metrics = [
    { icon: '💼', title: 'Active Postings', value: '02', trend: 'up', trendValue: '+1 from last month', gradient: 'bg-gradient-blue' },
    { icon: '👥', title: 'New Applicants', value: '07', trend: 'up', trendValue: '+23% from last month', gradient: 'bg-gradient-green' },
    { icon: '✅', title: 'Completed Internships', value: '12', trend: 'up', trendValue: '92% completion rate', gradient: 'bg-gradient-purple' },
  ];

  const applications = [
    { studentName: 'John Doe', appliedDate: '2 days ago', status: 'applied' },
    { studentName: 'Jane Smith', appliedDate: '1 week ago', status: 'reviewed' },
    { studentName: 'Mike Johnson', appliedDate: '3 days ago', status: 'shortlisted' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        
        <main className="p-8 bg-slate-50">
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-600">Good morning,</p>
            <h1 className="text-4xl font-bold text-slate-900">Guinness Cameroon <span className="text-3xl">👋</span></h1>
            <p className="text-slate-600 mt-2">Here's what's happening with your internship programme.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {metrics.map((metric, idx) => (
              <MetricCard key={idx} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Applications</h2>
                <div className="space-y-3">
                  {applications.map((app, idx) => (
                    <ApplicationCard key={idx} {...app} onReview={() => alert('Review: ' + app.studentName)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <QuickActionCard icon={<FiPlus />} title="Post new internship" description="Create a new internship position" />
              <QuickActionCard icon={<FiUsers />} title="Review applicants" description="View and shortlist candidates" />
              <QuickActionCard icon={<FiCheckCircle />} title="Confirm completion" description="Mark internships as completed" />
              <QuickActionCard icon={<FiBarChart3 />} title="Generate report" description="Download reports and analytics" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
