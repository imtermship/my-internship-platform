import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Redirect based on role
      if (role === 'employer') router.push('/employer/dashboard');
      else router.push('/student/internships');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-blue flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">MY</h1>
          <p className="text-slate-600">Internship Platform</p>
        </div>

        {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none">
              <option value="student">Student</option>
              <option value="employer">Employer</option>
              <option value="institution">Institution</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account? <Link href="/register" className="text-primary-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
