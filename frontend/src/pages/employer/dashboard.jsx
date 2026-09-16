'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import MetricCard from '@/components/MetricCard';
import QuickActionCard from '@/components/QuickActionCard';
import ApplicationCard from '@/components/ApplicationCard';
import ApplicationReviewModal from '@/components/ApplicationReviewModal';
import { useApplicationStore } from '@/lib/stores';
import { useAuthStore } from '@/lib/authStore';
import { FiPlus, FiUsers, FiCheckCircle, FiBarChart3 } from 'react-icons/fi';

export default function EmployerDashboard() {
  const { applications, loading, fetchApplications } = useApplicationStore();
  const { user } = useAuthStore();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [stats, setStats] = useState({
    activePostings: 0,
    newApplicants: 0,
    completedInternships: 0,
  });

  useEffect(() => {
    fetchApplications('employer');
  }, []);

  useEffect(() => {
    // Calculate stats
    const newApps = applications.filter((app) => app.status === 'applied').length;
    setStats({
      activePostings: 2,
      newApplicants: newApps,
      completedInternships: 12,
    });
  }, [applications]);

  const handleReviewApplication = (app) => {
    setSelectedApplication(app);
    setShowReviewModal(true);
  };

  const metrics = [
    { icon: '📁', title: 'Active Postings', value: stats.activePostings, trend: 'up', trendValue: '+1 from last month', gradient: 'bg-gradient-blue' },
    { icon: '👥', title: 'New Applicants', value: stats.newApplicants, trend: 'up', trendValue: '+23% from last month', gradient: 'bg-gradient-green' },
    { icon: '✅', title: 'Completed Internships', value: stats.completedInternships, trend: 'up', trendValue: '92% completion rate', gradient: 'bg-gradient-purple' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <main className="p-8 bg-slate-50 min-h-screen">
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-600">Good morning,</p>
            <h1 className="text-4xl font-bold text-slate-900">{user?.first_name || 'Company'} 👋</h1>
            <p className="text-slate-600 mt-2">Here's what's happening with your internship programme.</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {metrics.map((metric, idx) => (
              <MetricCard key={idx} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Applications */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Applications</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <ApplicationCard
                        key={app.id}
                        studentName={app.student_name || 'Student'}
                        appliedDate={new Date(app.applied_at).toLocaleDateString()}
                        status={app.status}
                        onReview={() => handleReviewApplication(app)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">No applications yet</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <QuickActionCard icon={<FiPlus />} title="Post new internship" description="Create a new internship position" />
              <QuickActionCard
                icon={<FiUsers />}
                title="Review applicants"
                description="View and shortlist candidates"
                onClick={() => alert('Navigate to applicants page')}
              />
              <QuickActionCard icon={<FiCheckCircle />} title="Confirm completion" description="Mark internships as completed" />
              <QuickActionCard icon={<FiBarChart3 />} title="Generate report" description="Download reports and analytics" />
            </div>
          </div>
        </main>
      </div>

      {/* Application Review Modal */}
      {showReviewModal && selectedApplication && (
        <ApplicationReviewModal application={selectedApplication} onClose={() => setShowReviewModal(false)} />
      )}
    </div>
  );
}
