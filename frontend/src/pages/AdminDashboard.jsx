import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LogOut, Plus, Edit2, Trash2, X, Save, Layers, Award, User, Code,
  BookOpen, Briefcase, Upload, BarChart2, TrendingUp, Eye, Download,
  MessageSquare, Calendar, RefreshCw,
} from 'lucide-react';
import {
  projectsApi, certificatesApi, profileApi, skillsApi,
  educationApi, experienceApi, analyticsApi,
} from '../services/api.js';
import DarkModeToggle from '../components/DarkModeToggle.jsx';

const INPUT = 'w-full px-3 py-2.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
const LABEL = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5';
const BTN = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
const BTN_G = 'px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';

function Spinner() { return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />; }

function SkeletonRows({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse px-4 py-3">
          <div className="h-3.5 w-1/3 rounded bg-slate-300 dark:bg-slate-600 mb-2" />
          <div className="h-3 w-2/3 rounded bg-slate-300 dark:bg-slate-600" />
        </div>
      ))}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ItemRow({ children, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1 shrink-0">
        {onEdit && <button onClick={onEdit} className="p-2 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={14} /></button>}
        {onDelete && <button onClick={onDelete} className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// PROJECTS TAB
// ──────────────────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await projectsApi.getAll(); setProjects(r.data.data ?? []); }
    catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await projectsApi.create(data);
      else await projectsApi.update(modal._id, data);
      toast.success('Saved!');
      setModal(null); load();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await projectsApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
        <button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Project</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {projects.map(p => (
            <ItemRow key={p._id} onEdit={() => setModal(p)} onDelete={() => handleDelete(p._id)}>
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-slate-500">{p.description}</p>
            </ItemRow>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <ProjectForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial ? { ...initial, techStack: initial.techStack?.join(', ') || '' }
            : { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false }
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) }); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Title *</label><input required value={form.title} onChange={e => set('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Description *</label><textarea required rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Tech Stack</label><input value={form.techStack} onChange={e => set('techStack', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Image URL</label><input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Live URL</label><input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>GitHub URL</label><input type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /><span>Featured</span></label>
      <div className="flex gap-3"><button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}Save</button><button type="button" onClick={onCancel} className={BTN_G}>Cancel</button></div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// CERTIFICATES TAB
// ──────────────────────────────────────────────────────────────────────────
function CertificatesTab() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await certificatesApi.getAll(); setCerts(r.data.data ?? []); }
    catch { toast.error('Failed to load certificates'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await certificatesApi.create(data);
      else await certificatesApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try { await certificatesApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Certificates ({certs.length})</h2>
        <button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Certificate</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {certs.map(c => (
            <ItemRow key={c._id} onEdit={() => setModal(c)} onDelete={() => handleDelete(c._id)}>
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs text-slate-500">{c.issuer}</p>
            </ItemRow>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Certificate' : 'Edit Certificate'} onClose={() => setModal(null)}>
          <CertificateForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function CertificateForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', category: 'Other' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Issuer *</label><input required value={form.issuer} onChange={e => set('issuer', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Image URL</label><input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Credential URL</label><input type="url" value={form.credentialUrl} onChange={e => set('credentialUrl', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3"><button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}Save</button><button type="button" onClick={onCancel} className={BTN_G}>Cancel</button></div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SKILLS TAB
// ──────────────────────────────────────────────────────────────────────────
const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];

function SkillsTab() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await skillsApi.getAll(); setSkills(r.data.data ?? []); }
    catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await skillsApi.create(data);
      else await skillsApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await skillsApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const grouped = skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  return (
    <div>
      <div className="flex justify-between mb-6"><h2 className="text-lg font-semibold">Skills ({skills.length})</h2><button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Skill</button></div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-6">
          {SKILL_CATEGORIES.filter(c => grouped[c]?.length).map(cat => (
            <div key={cat}><p className="text-xs font-semibold text-slate-500 mb-2">{cat}</p><div className="space-y-2">{grouped[cat].map(s => (<ItemRow key={s._id} onEdit={() => setModal(s)} onDelete={() => handleDelete(s._id)}><span className="font-medium text-sm">{s.name}</span></ItemRow>))}</div></div>
          ))}
        </div>
      )}
      {modal && <Modal title={modal === 'add' ? 'Add Skill' : 'Edit Skill'} onClose={() => setModal(null)}><SkillForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}

function SkillForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', category: 'Frontend' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>{SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div className="flex gap-3"><button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}Save</button><button type="button" onClick={onCancel} className={BTN_G}>Cancel</button></div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// EDUCATION TAB
// ──────────────────────────────────────────────────────────────────────────
function EducationTab() {
  const [edu, setEdu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await educationApi.getAll(); setEdu(r.data.data ?? []); }
    catch { toast.error('Failed to load education'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await educationApi.create(data);
      else await educationApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try { await educationApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex justify-between mb-6"><h2 className="text-lg font-semibold">Education ({edu.length})</h2><button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Education</button></div>
      {loading ? <SkeletonRows /> : edu.map(e => (<ItemRow key={e._id} onEdit={() => setModal(e)} onDelete={() => handleDelete(e._id)}><p className="font-medium text-sm">{e.degree} - {e.institution}</p></ItemRow>))}
      {modal && <Modal title={modal === 'add' ? 'Add Education' : 'Edit Education'} onClose={() => setModal(null)}><EducationForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}

function EducationForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { institution: '', degree: '', startDate: '', endDate: '', current: false });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Institution *</label><input required value={form.institution} onChange={e => set('institution', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Degree *</label><input required value={form.degree} onChange={e => set('degree', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} /><span>Current</span></label>
      <div className="flex gap-3"><button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}Save</button><button type="button" onClick={onCancel} className={BTN_G}>Cancel</button></div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// EXPERIENCE TAB
// ──────────────────────────────────────────────────────────────────────────
function ExperienceTab() {
  const [exp, setExp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await experienceApi.getAll(); setExp(r.data.data ?? []); }
    catch { toast.error('Failed to load experience'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await experienceApi.create(data);
      else await experienceApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try { await experienceApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex justify-between mb-6"><h2 className="text-lg font-semibold">Experience ({exp.length})</h2><button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Experience</button></div>
      {loading ? <SkeletonRows /> : exp.map(e => (<ItemRow key={e._id} onEdit={() => setModal(e)} onDelete={() => handleDelete(e._id)}><p className="font-medium text-sm">{e.position} - {e.company}</p></ItemRow>))}
      {modal && <Modal title={modal === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={() => setModal(null)}><ExperienceForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}

function ExperienceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { company: '', position: '', startDate: '', endDate: '', current: false, description: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Company *</label><input required value={form.company} onChange={e => set('company', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Position *</label><input required value={form.position} onChange={e => set('position', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} /><span>Current</span></label>
      <div><label className={LABEL}>Description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3"><button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}Save</button><button type="button" onClick={onCancel} className={BTN_G}>Cancel</button></div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// PROFILE TAB
// ──────────────────────────────────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    profileApi.get().then(r => setForm(r.data.data)).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false));
  }, []);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setField('avatar', data.data.url);
        toast.success('Avatar uploaded!');
      }
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Please select a PDF'); return; }
    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setField('resumeUrl', data.data.url);
        toast.success('Resume uploaded!');
      }
    } catch { toast.error('Upload failed'); }
    finally { setUploadingResume(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await profileApi.update(form); toast.success('Profile saved!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="space-y-4">Loading...</div>;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">Profile Settings</h2>
      
      <div>
        <label className={LABEL}>Avatar</label>
        <div className="flex gap-4">
          {form.avatar && <img src={form.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />}
          <div className="flex-1">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm inline-block">
              {uploading ? 'Uploading...' : 'Upload Avatar'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <input type="url" placeholder="Image URL" value={form.avatar || ''} onChange={e => setField('avatar', e.target.value)} className={INPUT + ' mt-2'} />
          </div>
        </div>
      </div>

      <div>
        <label className={LABEL}>Resume</label>
        <div className="flex gap-4">
          {form.resumeUrl && <a href={form.resumeUrl} target="_blank" className="text-green-500 text-sm">View Resume</a>}
          <div className="flex-1">
            <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg text-sm inline-block">
              {uploadingResume ? 'Uploading...' : 'Upload Resume (PDF)'}
              <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            </label>
            <input type="url" placeholder="Resume URL" value={form.resumeUrl || ''} onChange={e => setField('resumeUrl', e.target.value)} className={INPUT + ' mt-2'} />
          </div>
        </div>
      </div>

      <div><label className={LABEL}>Name</label><input value={form.name || ''} onChange={e => setField('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Title</label><input value={form.title || ''} onChange={e => setField('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Bio</label><textarea rows={4} value={form.bio || ''} onChange={e => setField('bio', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Location</label><input value={form.location || ''} onChange={e => setField('location', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Email</label><input type="email" value={form.email || ''} onChange={e => setField('email', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Availability</label><input value={form.availability || ''} onChange={e => setField('availability', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Years Experience</label><input type="number" value={form.yearsOfExperience || 0} onChange={e => setField('yearsOfExperience', Number(e.target.value))} className={INPUT} /></div>
      
      <div>
        <h3 className="font-medium mb-2">Social Links</h3>
        {['github', 'linkedin', 'twitter'].map(key => (
          <div key={key} className="mb-2">
            <label className={LABEL}>{key}</label>
            <input type="url" value={form.socialLinks?.[key] || ''} onChange={e => setSocial(key, e.target.value)} className={INPUT} />
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving} className={BTN}>{saving ? <Spinner /> : <Save size={14} />} Save Profile</button>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ANALYTICS TAB
// ──────────────────────────────────────────────────────────────────────────
function AnalyticsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await analyticsApi.getStats(days); setStats(r.data.data); }
    catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  }, [days]);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <select value={days} onChange={e => setDays(Number(e.target.value))} className={INPUT + ' w-32'}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl"><p className="text-2xl font-bold">{stats?.totalViews || 0}</p><p className="text-xs text-slate-500">Page Views</p></div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl"><p className="text-2xl font-bold">{stats?.uniqueVisitors || 0}</p><p className="text-xs text-slate-500">Unique Visitors</p></div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl"><p className="text-2xl font-bold">{stats?.resumeDownloads || 0}</p><p className="text-xs text-slate-500">Resume Downloads</p></div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl"><p className="text-2xl font-bold">{stats?.contactForms || 0}</p><p className="text-xs text-slate-500">Contact Forms</p></div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ──────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'projects', label: 'Projects', Icon: Layers },
  { id: 'certificates', label: 'Certificates', Icon: Award },
  { id: 'skills', label: 'Skills', Icon: Code },
  { id: 'education', label: 'Education', Icon: BookOpen },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'analytics', label: 'Analytics', Icon: BarChart2 },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('projects');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 bg-white dark:bg-slate-800 border-b p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="font-bold text-xl">SA Dashboard</span>
          <div className="flex gap-3">
            <Link to="/" className="text-sm text-blue-500">View Site</Link>
            <DarkModeToggle />
            <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>
              {label}
            </button>
          ))}
        </div>
        <div>
          {tab === 'projects' && <ProjectsTab />}
          {tab === 'certificates' && <CertificatesTab />}
          {tab === 'skills' && <SkillsTab />}
          {tab === 'education' && <EducationTab />}
          {tab === 'experience' && <ExperienceTab />}
          {tab === 'analytics' && <AnalyticsTab />}
          {tab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}
