import { lazy, Suspense, Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Home from './pages/Home.jsx';

const AdminLogin     = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
}

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 px-6">
          <div className="text-center max-w-md">
            <p className="font-mono text-xs text-accent mb-3 tracking-widest">{'// runtime error'}</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-sm font-medium transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Suspense fallback={<AdminFallback />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
