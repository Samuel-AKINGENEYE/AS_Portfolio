import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, Plus, Edit2, Trash2, X, Save, Layers, Award, User, Code, BookOpen, Briefcase, Upload } from 'lucide-react';
import { projectsApi, certificatesApi, profileApi, skillsApi, educationApi, experienceApi, uploadApi } from '../services/api.js';
import DarkModeToggle from '../components/DarkModeToggle.jsx';

const INPUT = 'w-full px-3 py-2.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
const LABEL = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5';
const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
const BTN_GHOST = 'px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';

function Spinner() { return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />; }
function SkeletonRows({ count = 3 }) { return <div className="space-y-3">{Array.from({ length: count }, (_, i) => <div key={i} className="h-18 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse p-4"><div className="h-4 w-1/3 rounded bg-slate-300 dark:bg-slate-600 mb-2" /><div className="h-3 w-2/3 rounded bg-slate-300 dark:bg-slate-600" /></div>)}</div>; }
function Modal({ title, onClose, children }) { return <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} /><div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col"><div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0"><h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3><button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><X size={18} /></button></div><div className="overflow-y-auto flex-1 px-6 py-5">{children}</div></div></div>; }

function ProjectsTab() {
  const [projects, setProjects] = useState([]); const [loading, setLoading] = useState(true); const [modal, setModal] = useState(null);
  const load = useCallback(async () => { setLoading(true); try { const res = await projectsApi.getAll(); setProjects(res.data.data ?? []); } catch { toast.error('Failed to load projects'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (data) => { try { if (modal === 'add') await projectsApi.create(data); else await projectsApi.update(modal._id, data); toast.success(`Project ${modal === 'add' ? 'created' : 'updated'}!`); setModal(null); load(); } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); } };
  const handleDelete = async (id) => { if (!window.confirm('Delete this project?')) return; try { await projectsApi.remove(id); toast.success('Deleted'); load(); } catch { toast.error('Delete failed'); } };
  return (<div><div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Projects ({projects.length})</h2><button onClick={() => setModal('add')} className={BTN_PRIMARY}><Plus size={14} /> Add Project</button></div>{loading ? <SkeletonRows /> : <div className="space-y-3">{projects.map(p => (<div key={p._id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="font-medium text-slate-900 dark:text-white text-sm truncate">{p.title}</p>{p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Featured</span>}</div><p className="text-xs text-slate-500 mt-0.5 truncate">{p.description}</p></div><div className="flex items-center gap-1"><button onClick={() => setModal(p)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button><button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button></div></div>))}</div>}{modal && <Modal title={modal === 'add' ? 'Add Project' : `Edit: ${modal.title}`} onClose={() => setModal(null)}><ProjectForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} /></Modal>}</div>);
}

function ProjectForm({ initial, onSave, onCancel }) {
  const blank = { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', featured: false };
  const [form, setForm] = useState(initial ? { ...initial, techStack: initial.techStack?.join(', ') || '' } : blank);
  const [saving, setSaving] = useState(false);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await onSave({ ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) }); } finally { setSaving(false); } };
  return (<form onSubmit={handleSubmit} className="space-y-4"><div><label className={LABEL}>Title *</label><input required value={form.title} onChange={e => set('title', e.target.value)} className={INPUT} /></div><div><label className={LABEL}>Short Description *</label><textarea required rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT + ' resize-none'} /></div><div><label className={LABEL}>Tech Stack (comma-separated)</label><input value={form.techStack} onChange={e => set('techStack', e.target.value)} className={INPUT} placeholder="React, Node.js, MongoDB" /></div><div className="grid grid-cols-2 gap-3"><div><label className={LABEL}>Live URL</label><input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} className={INPUT} /></div><div><label className={LABEL}>GitHub URL</label><input type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={INPUT} /></div></div><label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-500" /><span className="text-sm text-slate-700 dark:text-slate-300">Featured — show on homepage grid</span></label><div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save Project'}</button><button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button></div></form>);
}

function ProfileTab() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { profileApi.get().then(res => setForm(res.data.data)).catch(() => toast.error("Failed to load profile")).finally(() => setLoading(false)); }, []);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSocial = (key, val) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: val } }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }
    setUploading(true);
    try {
      const res = await uploadApi.uploadAvatar(file);
      setField("avatar", res.data.data.url);
      toast.success("Avatar uploaded! Click Save to update profile.");
    } catch (err) { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await profileApi.update(form); toast.success("Profile saved!"); } catch { toast.error("Failed to save"); } finally { setSaving(false); } };

  if (loading) return <div className="space-y-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-12 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />)}</div>;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">Profile Settings</h2>
      <div>
        <label className={LABEL}>Profile Avatar</label>
        <div className="flex items-start gap-4">
          {form?.avatar && <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-md"><img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" /></div>}
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-flex items-center gap-2">
                <Upload size={14} /> {uploading ? "Uploading..." : "Choose Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            <input type="url" placeholder="Or paste image URL directly" value={form?.avatar || ""} onChange={(e) => setField("avatar", e.target.value)} className={INPUT} />
            <p className="text-xs text-slate-400">Upload JPEG/PNG (max 5MB) or paste URL</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>Name</label><input value={form.name ?? ""} onChange={e => setField("name", e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>Title</label><input value={form.title ?? ""} onChange={e => setField("title", e.target.value)} className={INPUT} /></div>
      </div>
      <div><label className={LABEL}>Bio</label><textarea rows={5} value={form.bio ?? ""} onChange={e => setField("bio", e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>Location</label><input value={form.location ?? ""} onChange={e => setField("location", e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>Email</label><input type="email" value={form.email ?? ""} onChange={e => setField("email", e.target.value)} className={INPUT} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>Availability</label><input value={form.availability ?? ""} onChange={e => setField("availability", e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>Years of Experience</label><input type="number" value={form.yearsOfExperience ?? 0} onChange={e => setField("yearsOfExperience", Number(e.target.value))} className={INPUT} /></div>
      </div>
      <div><h3 className="text-sm font-medium mb-3">Social Links</h3><div className="space-y-3">{["github", "linkedin", "twitter"].map(key => (<div key={key}><label className={LABEL}>{key.charAt(0).toUpperCase() + key.slice(1)}</label><input type="url" value={form.socialLinks?.[key] ?? ""} onChange={e => setSocial(key, e.target.value)} className={INPUT} placeholder={`https://${key}.com/...`} /></div>))}</div></div>
      <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? <Spinner /> : <Save size={14} />}{saving ? "Saving…" : "Save Profile"}</button>
    </form>
  );
}

function CertificatesTab() { return <div>Certificates Tab</div>; }
function SkillsTab() { return <div>Skills Tab</div>; }
function EducationTab() { return <div>Education Tab</div>; }
function ExperienceTab() { return <div>Experience Tab</div>; }

const TABS = [
  { id: 'projects', label: 'Projects', Icon: Layers },
  { id: 'certificates', label: 'Certificates', Icon: Award },
  { id: 'skills', label: 'Skills', Icon: Code },
  { id: 'education', label: 'Education', Icon: BookOpen },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('projects');
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem('adminToken'); toast.success('Logged out'); navigate('/admin/login'); };
  return (<div className="min-h-screen bg-slate-50 dark:bg-slate-900"><header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"><div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4"><span className="font-bold text-slate-900 dark:text-white">SA<span className="text-blue-500">.</span> Dashboard</span><div className="flex items-center gap-3"><Link to="/" target="_blank" className="text-xs text-slate-500 hover:text-blue-500 hidden sm:block">View site →</Link><DarkModeToggle /><button onClick={handleLogout} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"><LogOut size={14} /><span className="hidden sm:inline">Logout</span></button></div></div></header><div className="max-w-5xl mx-auto px-6 py-8"><div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 mb-8">{TABS.map(({ id, label, Icon }) => (<button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}><Icon size={14} />{label}</button>))}</div><div className="pb-16">{tab === 'projects' && <ProjectsTab />}{tab === 'profile' && <ProfileTab />}{tab === 'certificates' && <CertificatesTab />}{tab === 'skills' && <SkillsTab />}{tab === 'education' && <EducationTab />}{tab === 'experience' && <ExperienceTab />}</div></div></div>);
}
