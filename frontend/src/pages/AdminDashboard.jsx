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
  educationApi, experienceApi, uploadApi, analyticsApi,
} from '../services/api.js';
import DarkModeToggle from '../components/DarkModeToggle.jsx';

// ─── Shared style tokens ───────────────────────────────────────────────────
const INPUT  = 'w-full px-3 py-2.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
const LABEL  = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5';
const BTN    = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
const BTN_G  = 'px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';

// ─── Micro-components ─────────────────────────────────────────────────────
function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

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
        {onEdit   && <button onClick={onEdit}   className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"><Edit2   size={14} /></button>}
        {onDelete && <button onClick={onDelete} className="p-2 rounded-lg text-slate-400 hover:text-red-500  hover:bg-red-50  dark:hover:bg-red-500/10  transition-colors"><Trash2  size={14} /></button>}
      </div>
    </div>
  );
}

// ─── PROJECTS TAB ─────────────────────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await projectsApi.getAll(); setProjects(r.data.data ?? []); }
    catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      modal === 'add' ? await projectsApi.create(data) : await projectsApi.update(modal._id, data);
      toast.success(`Project ${modal === 'add' ? 'created' : 'updated'}!`);
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
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
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{p.title}</p>
                {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Featured</span>}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{p.description}</p>
            </ItemRow>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : `Edit: ${modal.title}`} onClose={() => setModal(null)}>
          <ProjectForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial ? { ...initial, techStack: initial.techStack?.join(', ') || '' }
            : { title: '', description: '', longDescription: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false }
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await onSave({ ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Title *</label><input required value={form.title} onChange={e => set('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Short Description *</label><textarea required rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT + ' resize-none'} /></div>
      <div><label className={LABEL}>Long Description</label><textarea rows={3} value={form.longDescription} onChange={e => set('longDescription', e.target.value)} className={INPUT + ' resize-none'} /></div>
      <div><label className={LABEL}>Tech Stack (comma-separated)</label><input value={form.techStack} onChange={e => set('techStack', e.target.value)} className={INPUT} placeholder="React, Node.js, MongoDB" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Live URL</label><input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>GitHub URL</label><input type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={INPUT} /></div>
      </div>
      <div><label className={LABEL}>Image URL</label><input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className={INPUT} /></div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-500" />
        <span className="text-sm">Featured — show on homepage</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>Cancel</button>
      </div>
    </form>
  );
}

// ─── CERTIFICATES TAB ─────────────────────────────────────────────────────
function CertificatesTab() {
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await certificatesApi.getAll(); setCerts(r.data.data ?? []); }
    catch { toast.error('Failed to load certificates'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      modal === 'add' ? await certificatesApi.create(data) : await certificatesApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
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
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{c.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">{c.category}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{c.issuer} · {c.issueDate ? new Date(c.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—'}</p>
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
  const blank = { name: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', category: 'Other' };
  const toInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
  const [form, setForm] = useState(initial ? { ...initial, issueDate: toInput(initial.issueDate) } : blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Certificate Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Issuer *</label><input required value={form.issuer} onChange={e => set('issuer', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Issue Date</label><input type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} className={INPUT} /></div>
        <div>
          <label className={LABEL}>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
            {['AI/ML', 'Web Dev', 'Cybersecurity', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div><label className={LABEL}>Credential URL</label><input type="url" value={form.credentialUrl} onChange={e => set('credentialUrl', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Image URL</label><input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>Cancel</button>
      </div>
    </form>
  );
}

// ─── SKILLS TAB ───────────────────────────────────────────────────────────
const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];
const CAT_COLORS = {
  Frontend: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
  Backend:  'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-300',
  Database: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300',
  Tools:    'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300',
  Other:    'bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300',
};

function SkillsTab() {
  const [skills,  setSkills]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await skillsApi.getAll(); setSkills(r.data.data ?? []); }
    catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      modal === 'add' ? await skillsApi.create(data) : await skillsApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await skillsApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const grouped = skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Skills ({skills.length})</h2>
        <button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Skill</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-6">
          {SKILL_CATEGORIES.filter(c => grouped[c]?.length).map(cat => (
            <div key={cat}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{cat}</p>
              <div className="space-y-2">
                {grouped[cat].map(s => (
                  <ItemRow key={s._id} onEdit={() => setModal(s)} onDelete={() => handleDelete(s._id)}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{s.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[s.category] || ''}`}>{s.category}</span>
                    </div>
                  </ItemRow>
                ))}
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No skills added yet.</p>}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Skill' : 'Edit Skill'} onClose={() => setModal(null)}>
          <SkillForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function SkillForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', category: 'Frontend', order: 0 });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Skill Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} placeholder="e.g. React" /></div>
      <div>
        <label className={LABEL}>Category</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
          {SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div><label className={LABEL}>Order (for sorting)</label><input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>Cancel</button>
      </div>
    </form>
  );
}

// ─── EDUCATION TAB ────────────────────────────────────────────────────────
function EducationTab() {
  const [edu,     setEdu]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await educationApi.getAll(); setEdu(r.data.data ?? []); }
    catch { toast.error('Failed to load education'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      modal === 'add' ? await educationApi.create(data) : await educationApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try { await educationApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Education ({edu.length})</h2>
        <button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Education</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {edu.map(e => (
            <ItemRow key={e._id} onEdit={() => setModal(e)} onDelete={() => handleDelete(e._id)}>
              <p className="font-medium text-sm">{e.degree} — <span className="text-blue-500">{e.institution}</span></p>
              <p className="text-xs text-slate-500 mt-0.5">
                {e.field && `${e.field} · `}
                {fmtDate(e.startDate)} — {e.current ? 'Present' : fmtDate(e.endDate)}
              </p>
            </ItemRow>
          ))}
          {edu.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No education entries yet.</p>}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Education' : 'Edit Education'} onClose={() => setModal(null)}>
          <EducationForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function EducationForm({ initial, onSave, onCancel }) {
  const toInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
  const [form, setForm] = useState(
    initial ? { ...initial, startDate: toInput(initial.startDate), endDate: toInput(initial.endDate) }
            : { institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, description: '', order: 0 }
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Institution *</label><input required value={form.institution} onChange={e => set('institution', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Degree *</label><input required value={form.degree} onChange={e => set('degree', e.target.value)} className={INPUT} placeholder="Bachelor's, Master's, etc." /></div>
      <div><label className={LABEL}>Field of Study</label><input value={form.field} onChange={e => set('field', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={INPUT} disabled={form.current} /></div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-500" />
        <span className="text-sm">Currently studying here</span>
      </label>
      <div><label className={LABEL}>Description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT + ' resize-none'} /></div>
      <div><label className={LABEL}>Order</label><input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>Cancel</button>
      </div>
    </form>
  );
}

// ─── EXPERIENCE TAB ───────────────────────────────────────────────────────
function ExperienceTab() {
  const [exp,     setExp]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await experienceApi.getAll(); setExp(r.data.data ?? []); }
    catch { toast.error('Failed to load experience'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      modal === 'add' ? await experienceApi.create(data) : await experienceApi.update(modal._id, data);
      toast.success('Saved!'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try { await experienceApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Experience ({exp.length})</h2>
        <button onClick={() => setModal('add')} className={BTN}><Plus size={14} /> Add Experience</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {exp.map(e => (
            <ItemRow key={e._id} onEdit={() => setModal(e)} onDelete={() => handleDelete(e._id)}>
              <p className="font-medium text-sm">{e.position} — <span className="text-blue-500">{e.company}</span></p>
              <p className="text-xs text-slate-500 mt-0.5">
                {e.location && `${e.location} · `}
                {fmtDate(e.startDate)} — {e.current ? 'Present' : fmtDate(e.endDate)}
              </p>
            </ItemRow>
          ))}
          {exp.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No experience entries yet.</p>}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={() => setModal(null)}>
          <ExperienceForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function ExperienceForm({ initial, onSave, onCancel }) {
  const toInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
  const [form, setForm] = useState(
    initial ? { ...initial, startDate: toInput(initial.startDate), endDate: toInput(initial.endDate), achievements: initial.achievements || [] }
            : { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: [], order: 0 }
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addAchievement    = () => set('achievements', [...form.achievements, '']);
  const removeAchievement = (i) => set('achievements', form.achievements.filter((_, j) => j !== i));
  const updateAchievement = (i, v) => set('achievements', form.achievements.map((a, j) => j === i ? v : a));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...form, achievements: form.achievements.filter(Boolean) }); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Company *</label><input required value={form.company} onChange={e => set('company', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Position *</label><input required value={form.position} onChange={e => set('position', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Location</label><input value={form.location} onChange={e => set('location', e.target.value)} className={INPUT} placeholder="City, Country or Remote" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={INPUT} disabled={form.current} /></div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-500" />
        <span className="text-sm">Currently working here</span>
      </label>
      <div><label className={LABEL}>Description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT + ' resize-none'} /></div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LABEL + ' mb-0'}>Key Achievements</label>
          <button type="button" onClick={addAchievement} className="text-xs text-blue-500 hover:text-blue-600 font-medium">+ Add</button>
        </div>
        <div className="space-y-2">
          {form.achievements.map((ach, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={ach} onChange={e => updateAchievement(i, e.target.value)} className={INPUT} placeholder={`Achievement ${i + 1}`} />
              <button type="button" onClick={() => removeAchievement(i)} className="p-2 text-slate-400 hover:text-red-500"><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      <div><label className={LABEL}>Order</label><input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>Cancel</button>
      </div>
    </form>
  );
}

// ─── PROFILE TAB ──────────────────────────────────────────────────────────
function ProfileTab() {
  const [form,      setForm]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    profileApi.get().then(r => setForm(r.data.data)).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false));
  }, []);

  const setField  = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }
    setUploading(true);
    try {
      const res = await uploadApi.uploadAvatar(file);
      setField('avatar', res.data.data.url);
      toast.success('Avatar uploaded! Click Save to apply.');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await profileApi.update(form); toast.success('Profile saved!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="space-y-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-12 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />)}</div>;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">Profile Settings</h2>

      {/* Avatar */}
      <div>
        <label className={LABEL}>Profile Avatar</label>
        <div className="flex items-start gap-4">
          {form.avatar && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-md shrink-0">
              <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-flex items-center gap-2">
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
            <input type="url" placeholder="Or paste image URL" value={form.avatar || ''} onChange={e => setField('avatar', e.target.value)} className={INPUT} />
            <p className="text-xs text-slate-400">JPEG/PNG up to 5 MB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>Name</label><input value={form.name ?? ''} onChange={e => setField('name', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>Title</label><input value={form.title ?? ''} onChange={e => setField('title', e.target.value)} className={INPUT} /></div>
      </div>
      <div><label className={LABEL}>Bio</label><textarea rows={4} value={form.bio ?? ''} onChange={e => setField('bio', e.target.value)} className={INPUT + ' resize-none'} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>Location</label><input value={form.location ?? ''} onChange={e => setField('location', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>Email</label><input type="email" value={form.email ?? ''} onChange={e => setField('email', e.target.value)} className={INPUT} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>Availability</label><input value={form.availability ?? ''} onChange={e => setField('availability', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>Years of Experience</label><input type="number" value={form.yearsOfExperience ?? 0} onChange={e => setField('yearsOfExperience', Number(e.target.value))} className={INPUT} /></div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Social Links</h3>
        <div className="space-y-3">
          {['github', 'linkedin', 'twitter'].map(key => (
            <div key={key}>
              <label className={LABEL}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input type="url" value={form.socialLinks?.[key] ?? ''} onChange={e => setSocial(key, e.target.value)} className={INPUT} placeholder={`https://${key}.com/…`} />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={saving} className={BTN}>
        {saving ? <Spinner /> : <Save size={14} />}
        {saving ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  );
}

// ─── ANALYTICS TAB ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = 'text-blue-500' }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <div className={`w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function MiniBar({ label, value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-500 text-xs w-20 text-right shrink-0 font-mono">{label}</span>
      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 shrink-0">{value}</span>
    </div>
  );
}

function AnalyticsTab() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [days,    setDays]    = useState(30);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await analyticsApi.getStats(days); setStats(r.data.data); }
    catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  }, [days]);
  useEffect(() => { load(); }, [load]);

  const maxDailyViews = stats?.dailyViews?.length
    ? Math.max(...stats.dailyViews.map(d => d.count))
    : 1;

  // Show last 14 days of daily data
  const chartData = stats?.dailyViews?.slice(-14) ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className={INPUT + ' w-36'}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button onClick={load} disabled={loading} className={BTN_G + ' p-2.5'} title="Refresh">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Eye}           label="Page Views"         value={stats?.totalViews}       color="text-blue-500" />
            <StatCard icon={TrendingUp}    label="Unique Visitors"    value={stats?.uniqueVisitors}    color="text-green-500" />
            <StatCard icon={Download}      label="Resume Downloads"   value={stats?.resumeDownloads}   color="text-purple-500" />
            <StatCard icon={MessageSquare} label="Contact Submissions" value={stats?.contactForms}     color="text-orange-500" />
          </div>

          {/* Daily views chart */}
          {chartData.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-5 flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-500" /> Daily Page Views
              </h3>
              <div className="space-y-2.5">
                {chartData.map(d => (
                  <MiniBar
                    key={d._id}
                    label={d._id.slice(5)} // Show MM-DD
                    value={d.count}
                    max={maxDailyViews}
                  />
                ))}
              </div>
            </div>
          )}

          {chartData.length === 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center">
              <BarChart2 size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No analytics data yet for this period.</p>
              <p className="text-xs text-slate-400 mt-1">Data will appear as visitors browse the site.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── TAB CONFIG & SHELL ───────────────────────────────────────────────────
const TABS = [
  { id: 'projects',     label: 'Projects',     Icon: Layers    },
  { id: 'certificates', label: 'Certificates', Icon: Award     },
  { id: 'skills',       label: 'Skills',       Icon: Code      },
  { id: 'education',    label: 'Education',    Icon: BookOpen  },
  { id: 'experience',   label: 'Experience',   Icon: Briefcase },
  { id: 'analytics',    label: 'Analytics',    Icon: BarChart2 },
  { id: 'profile',      label: 'Profile',      Icon: User      },
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
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <span className="font-bold text-slate-900 dark:text-white">
            SA<span className="text-blue-500">.</span> Dashboard
          </span>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-slate-500 hover:text-blue-500 hidden sm:block transition-colors">
              View site →
            </Link>
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 mb-8 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pb-16">
          {tab === 'projects'     && <ProjectsTab />}
          {tab === 'certificates' && <CertificatesTab />}
          {tab === 'skills'       && <SkillsTab />}
          {tab === 'education'    && <EducationTab />}
          {tab === 'experience'   && <ExperienceTab />}
          {tab === 'analytics'    && <AnalyticsTab />}
          {tab === 'profile'      && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}
