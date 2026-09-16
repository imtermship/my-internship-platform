import Link from 'next/link';
import { FiHome, FiBriefcase, FiUsers, FiCheckCircle, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-blue text-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">MY Company</h2>
        <p className="text-blue-100 text-sm">Employer Portal</p>
      </div>

      <nav className="space-y-2">
        <NavItem href="/employer/dashboard" icon={<FiHome />} label="Overview" />
        <NavItem href="/employer/internships" icon={<FiBriefcase />} label="Internship Posts" />
        <NavItem href="/employer/applications" icon={<FiUsers />} label="Applicants" badge={7} />
        <NavItem href="/employer/completion" icon={<FiCheckCircle />} label="Confirm Completion" />
        <NavItem href="/employer/settings" icon={<FiSettings />} label="Settings" />
      </nav>
    </aside>
  );
}

function NavItem({ href, icon, label, badge }) {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
        {badge && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">{badge}</span>}
      </div>
    </Link>
  );
}
