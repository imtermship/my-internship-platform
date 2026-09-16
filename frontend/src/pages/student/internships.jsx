'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import InternshipCard from '@/components/InternshipCard';
import ApplicationModal from '@/components/ApplicationModal';
import { useInternshipStore } from '@/lib/stores';
import { useAuthStore } from '@/lib/authStore';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function StudentDashboard() {
  const { internships, loading, fetchInternships } = useInternshipStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    fetchInternships(searchTerm);
  }, [searchTerm]);

  const handleApply = (internship) => {
    setSelectedInternship(internship);
    setShowApplicationModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Find Your Perfect Internship 🚀</h1>
          <p className="text-xl text-slate-600 mb-8">Discover opportunities and launch your career with top companies.</p>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-4 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search internships by role, company, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg transition">Search</button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg font-semibold hover:border-primary-500 transition">
              <FiFilter className="inline mr-2" /> All Locations
            </button>
            <button className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg font-semibold hover:border-primary-500 transition">Remote</button>
            <button className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg font-semibold hover:border-primary-500 transition">Hybrid</button>
            <button className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg font-semibold hover:border-primary-500 transition">Onsite</button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-slate-600">Loading internships...</p>
          </div>
        )}

        {/* Internship Grid */}
        {!loading && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Featured Opportunities ({internships.length})</h2>
            {internships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship) => (
                  <div key={internship.id} className="cursor-pointer" onClick={() => handleApply(internship)}>
                    <InternshipCard
                      title={internship.title}
                      company={internship.company_name || 'Company'}
                      location={internship.location}
                      salary={internship.salary ? `$${internship.salary}/month` : 'Competitive'}
                      duration={`${internship.duration_weeks} weeks`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-slate-600 text-lg">No internships found. Try a different search.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Application Modal */}
      {showApplicationModal && selectedInternship && (
        <ApplicationModal
          internship={selectedInternship}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedInternship(null);
          }}
        />
      )}
    </div>
  );
}
