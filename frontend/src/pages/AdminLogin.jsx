import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, Eye, EyeOff, ArrowLeft, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api.js';

const BG_CODE = `import { Portfolio } from './portfolio/cms';
import { authenticate } from './admin/auth';
import { Session } from './types';

const dashboard = new Portfolio({
  owner: 'Samuel AKINGENEYE',
  role: 'Full-Stack Developer',
  stack: ['React', 'Node.js', 'MongoDB'],
  access: 'admin',
});

async function main(): Promise<Session> {
  const session = await authenticate();
  await dashboard.init(session);

  dashboard.manage([
    'projects', 'skills',
    'education', 'experience',
    'certificates', 'profile',
  ]);

  return session;
}

main().catch(console.error);
`.repeat(6);

function LineNum({ n }) {
  return (
    <span className="text-slate-600 w-5 text-right shrink-0 select-none font-mono text-xs">
      {n}
    </span>
  );
}

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
      toast.success('Access granted');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#0d1117' }}>
      {/* Decorative code background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.035]">
        <pre className="font-mono text-[11px] text-emerald-400 p-8 leading-6 whitespace-pre-wrap break-all">
          {BG_CODE}
        </pre>
      </div>

      {/* Back link */}
      <div className="relative z-10 px-6 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={13} />
          ~/portfolio
        </Link>
      </div>

      {/* Editor window card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px] rounded-xl overflow-hidden shadow-2xl shadow-black/60" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>

          {/* macOS title bar */}
          <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: '#1c1c1e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            </div>
            <div className="flex-1 text-center">
              <span className="font-mono text-[11px] text-slate-400">admin_access.js — Portfolio CMS</span>
            </div>
            <div className="w-12" />
          </div>

          {/* File tab bar */}
          <div className="flex items-center" style={{ background: '#252526', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              className="flex items-center gap-2 px-4 py-1.5"
              style={{
                background: '#1e1e1e',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                borderTop: '2px solid #3b82f6',
              }}
            >
              <Zap size={11} className="text-yellow-400" />
              <span className="font-mono text-[11px] text-slate-200">admin_access.js</span>
            </div>
          </div>

          {/* Editor body */}
          <div className="p-6" style={{ background: '#1e1e1e' }}>
            <form onSubmit={handleSubmit}>
              {/* Code-styled form */}
              <div className="leading-7 mb-5 space-y-0.5">

                {/* Line 1 — comment */}
                <div className="flex items-center gap-3">
                  <LineNum n={1} />
                  <span className="font-mono text-xs">
                    <span className="text-slate-400">// </span>
                    <span className="text-slate-500">Portfolio Admin — authenticate</span>
                  </span>
                </div>

                {/* Line 2 — blank */}
                <div className="flex items-center gap-3"><LineNum n={2} /></div>

                {/* Line 3 — function call open */}
                <div className="flex items-center gap-3">
                  <LineNum n={3} />
                  <span className="font-mono text-xs">
                    <span className="text-purple-400">const </span>
                    <span className="text-blue-300">session </span>
                    <span className="text-slate-400">= </span>
                    <span className="text-yellow-300">await </span>
                    <span className="text-blue-300">auth</span>
                    <span className="text-slate-400">.</span>
                    <span className="text-yellow-300">login</span>
                    <span className="text-slate-400">(&#123;</span>
                  </span>
                </div>

                {/* Line 4 — email input */}
                <div className="flex items-center gap-3">
                  <LineNum n={4} />
                  <div className="flex items-center gap-1 flex-1 font-mono text-xs min-w-0">
                    <span className="text-green-300 shrink-0">&nbsp;&nbsp;email:&nbsp;</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder='"admin@portfolio.dev"'
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-transparent text-yellow-300 text-xs font-mono focus:outline-none placeholder:text-slate-600 flex-1 min-w-0 border-b border-slate-700 focus:border-blue-500 transition-colors pb-0.5"
                    />
                    <span className="text-slate-400 shrink-0">,</span>
                  </div>
                </div>

                {/* Line 5 — password input */}
                <div className="flex items-center gap-3">
                  <LineNum n={5} />
                  <div className="flex items-center gap-1 flex-1 font-mono text-xs min-w-0">
                    <span className="text-green-300 shrink-0">&nbsp;&nbsp;password:&nbsp;</span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder='"••••••••"'
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="bg-transparent text-yellow-300 text-xs font-mono focus:outline-none placeholder:text-slate-600 flex-1 min-w-0 border-b border-slate-700 focus:border-blue-500 transition-colors pb-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="shrink-0 text-slate-600 hover:text-slate-300 transition-colors ml-1"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <span className="text-slate-400 shrink-0">,</span>
                  </div>
                </div>

                {/* Line 6 — closing bracket */}
                <div className="flex items-center gap-3">
                  <LineNum n={6} />
                  <span className="font-mono text-xs text-slate-400">&#125;)</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full font-mono text-sm py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-blue-200">authenticating...</span>
                  </>
                ) : (
                  <>
                    <Terminal size={13} />
                    <span>{'> auth.login()'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* VS Code status bar */}
          <div className="flex items-center justify-between px-4 py-1 bg-blue-600">
            <div className="flex items-center gap-2 font-mono text-[10px] text-blue-100">
              <Zap size={9} />
              <span>Portfolio CMS</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-blue-200">
              <span>JavaScript</span>
              <span>UTF-8</span>
              <span>Spaces: 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
