import Navbar from '@/components/Navbar';
import InternshipCard from '@/components/InternshipCard';
import { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');

  const internships = [
    {
      title: 'Frontend Developer',
      company: 'Tech Startup Co.',
      location: 'Remote',
      salary: '$500/month',
      duration: '3 months',
      description: 'Build beautiful web applications with React and Tailwind CSS.',
    },
    {
      title: 'UI/UX Designer',
      company: 'Digital Agency',
      location: 'Lagos, Nigeria',
      salary: '$400/month',
      duration: '2-3 months',
      description: 'Design user interfaces and experiences for mobile apps.',
    },
    {
      title: 'Product Manager',
      company: 'SaaS Company',
      location: 'Hybrid',
      salary: '$600/month',
      duration: '3-4 months',
      description: 'Help launch and manage a new product feature.',
    },
    {
      title: 'Data Analyst',
      company: 'Financial Services',
      location: 'Onsite',
      salary: '$450/month',
      duration: '3 months',
      description: 'Analyze financial data and create insights.',
    },
    {
      title: 'Marketing Specialist',
      company: 'E-commerce Platform',
      location: 'Remote',
      salary: '$350/month',
      duration: '2 months',
      description: 'Develop and execute marketing campaigns.',
    },
    {
      title: 'Backend Developer',
      company: 'Cloud Infrastructure',
      location: 'Hybrid',
      salary: '$550/month',
      duration: '3-4 months',
      description: 'Build scalable APIs and microservices.',
    },
  ];

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
            <button className="px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg transition">
              Search
            </button>
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

        {/* Internship Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Featured Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship, idx) => (
              <InternshipCard
                key={idx}
                {...internship}
                onClick={() => alert('Viewing: ' + internship.title)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
