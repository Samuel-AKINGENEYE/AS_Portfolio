import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api.js';
import DarkModeToggle from '../components/DarkModeToggle.jsx';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form.email, form.password);
      localStorage.setItem('adminToken', res.data.data.token);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
          <ArrowLeft size={15} />
          Back to portfolio
        </Link>
        <DarkModeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary text-white mb-4" style={{ width: 56, height: 56 }}>
                  <LogIn size={26} />
                </div>
                <h1 className="h4 mb-2">Admin Access</h1>
                <p className="text-muted mb-0">Sign in to manage your portfolio content</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email" required autoComplete="email"
                    placeholder="freshtalent491@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="form-control"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="btn btn-outline-secondary"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true" />
                      Signing in…
                    </>
                  ) : (
                    <><LogIn size={15} /> Sign In</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
