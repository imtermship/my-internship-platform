import Link from 'next/link';
import { FiMenu, FiBell } from 'react-icons/fi';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-xl text-slate-900">MY</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <button className="relative">
            <FiBell size={24} className="text-slate-600" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </nav>
  );
}
