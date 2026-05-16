import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LogOut, Plus, Edit2, Trash2, X, Save,
  Layers, Award, User, Code, BookOpen, Briefcase,
  ExternalLink, Github, Linkedin, Twitter, Mail,
  ChevronUp, ChevronDown, Upload, FileText, Download
} from 'lucide-react';
import { projectsApi, certificatesApi, profileApi, skillsApi, educationApi, experienceApi } from '../services/api.js';
import DarkModeToggle from '../components/DarkModeToggle.jsx';

// ─── Shared style tokens ───────────────────────────────────────────────────────

const INPUT =
  'w-full px-3 py-2.5 rounded-lg text-sm ' +
  'border border-slate-300 dark:border-slate-600 ' +
  'bg-white dark:bg-slate-700/60 text-slate-900 dark:text-white ' +
  'placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
  'transition-colors';

const LABEL = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5';

const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg ' +
  'bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm ' +
  'transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

const BTN_GHOST =
  'px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 ' +
  'text-slate-600 dark:text-slate-400 text-sm ' +
  'hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

// ─── Skeleton rows ─────────────────────────────────────────────────────────────

function SkeletonRows({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-18 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse p-4">
          <div className="h-4 w-1/3 rounded bg-slate-300 dark:bg-slate-600 mb-2" />
          <div className="h-3 w-2/3 rounded bg-slate-300 dark:bg-slate-600" />
        </div>
      ))}
    </div>
  );
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────

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

// ─── Project form (existing) ──────────────────────────────────────────────────

function ProjectForm({ initial, onSave, onCancel }) {
  const blank = { title: '', description: '', longDescription: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false };
  const [form, setForm] = useState(initial ?? blank);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Title *</label><input required value={form.title} onChange={(e) => set('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Short Description *</label><textarea required rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={INPUT + ' resize-none'} /></div>
      <div><label className={LABEL}>Tech Stack (comma-separated)</label><input value={form.techStack} onChange={(e) => set('techStack', e.target.value)} className={INPUT} placeholder="React, Node.js, MongoDB" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Live URL</label><input type="url" value={form.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>GitHub URL</label><input type="url" value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-500" />
        <span className="text-sm text-slate-700 dark:text-slate-300">Featured — show on homepage grid</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save Project'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Skills Tab ────────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];

function SkillsTab() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await skillsApi.getAll();
      setSkills(res.data.data ?? []);
    } catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await skillsApi.create(data);
      else await skillsApi.update(modal._id, data);
      toast.success(`Skill ${modal === 'add' ? 'created' : 'updated'}!`);
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await skillsApi.remove(id);
      toast.success('Skill deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skills ({skills.length})</h2>
        <button onClick={() => setModal('add')} className={BTN_PRIMARY}><Plus size={14} /> Add Skill</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-4">
          {SKILL_CATEGORIES.map(category => {
            const categorySkills = skills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;
            return (
              <div key={category} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">{category}</h3>
                <div className="space-y-2">
                  {categorySkills.map(skill => (
                    <div key={skill._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{skill.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 max-w-xs h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${skill.proficiency || 85}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{skill.proficiency || 85}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <button onClick={() => setModal(skill)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(skill._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Skill' : `Edit: ${modal.name}`} onClose={() => setModal(null)}>
          <SkillForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function SkillForm({ initial, onSave, onCancel }) {
  const blank = { name: '', category: 'Frontend', proficiency: 85, order: 0 };
  const [form, setForm] = useState(initial ?? blank);
  const [saving, setSaving] = useState(false);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Skill Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>{SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div><label className={LABEL}>Proficiency (%)</label><input type="number" min="0" max="100" value={form.proficiency} onChange={e => set('proficiency', parseInt(e.target.value))} className={INPUT} /></div>
      <div><label className={LABEL}>Order (lower = higher)</label><input type="number" value={form.order} onChange={e => set('order', parseInt(e.target.value))} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save Skill'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Education Tab ─────────────────────────────────────────────────────────────

function EducationTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await educationApi.getAll();
      setItems(res.data.data ?? []);
    } catch { toast.error('Failed to load education'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Education ({items.length})</h2>
        <button onClick={() => setModal('add')} className={BTN_PRIMARY}><Plus size={14} /> Add Education</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {items.map(item => (
            <EducationItem key={item._id} item={item} onEdit={() => setModal(item)} onDelete={async () => {
              if (confirm('Delete this education entry?')) {
                await educationApi.remove(item._id);
                toast.success('Deleted');
                load();
              }
            }} />
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Education' : `Edit: ${modal.institution}`} onClose={() => setModal(null)}>
          <EducationForm initial={modal !== 'add' ? modal : null} onSave={async (data) => {
            if (modal === 'add') await educationApi.create(data);
            else await educationApi.update(modal._id, data);
            toast.success('Saved!');
            setModal(null);
            load();
          }} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function EducationItem({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="flex-1">
        <p className="font-semibold text-slate-900 dark:text-white">{item.degree}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{item.institution}</p>
        <p className="text-xs text-slate-500 mt-1">{item.startDate ? new Date(item.startDate).getFullYear() : ''} - {item.current ? 'Present' : (item.endDate ? new Date(item.endDate).getFullYear() : '')}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onEdit} className="p-2 rounded-lg text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
        <button onClick={onDelete} className="p-2 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

function EducationForm({ initial, onSave, onCancel }) {
  const blank = { institution: '', degree: '', startDate: '', endDate: '', current: false, description: '', order: 0 };
  const [form, setForm] = useState(initial ? { ...initial, startDate: initial.startDate?.split('T')[0] || '', endDate: initial.endDate?.split('T')[0] || '' } : blank);
  const [saving, setSaving] = useState(false);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Institution *</label><input required value={form.institution} onChange={e => set('institution', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Degree *</label><input required value={form.degree} onChange={e => set('degree', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate} disabled={form.current} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2.5"><input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-4 h-4" /><span className="text-sm">Currently studying here</span></label>
      <div><label className={LABEL}>Description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Experience Tab ────────────────────────────────────────────────────────────

function ExperienceTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await experienceApi.getAll();
      setItems(res.data.data ?? []);
    } catch { toast.error('Failed to load experience'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Experience ({items.length})</h2>
        <button onClick={() => setModal('add')} className={BTN_PRIMARY}><Plus size={14} /> Add Experience</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {items.map(item => (
            <ExperienceItem key={item._id} item={item} onEdit={() => setModal(item)} onDelete={async () => {
              if (confirm('Delete this experience?')) {
                await experienceApi.remove(item._id);
                toast.success('Deleted');
                load();
              }
            }} />
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Experience' : `Edit: ${modal.position} at ${modal.company}`} onClose={() => setModal(null)}>
          <ExperienceForm initial={modal !== 'add' ? modal : null} onSave={async (data) => {
            if (modal === 'add') await experienceApi.create(data);
            else await experienceApi.update(modal._id, data);
            toast.success('Saved!');
            setModal(null);
            load();
          }} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function ExperienceItem({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="flex-1">
        <p className="font-semibold text-slate-900 dark:text-white">{item.position}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{item.company} • {item.location}</p>
        <p className="text-xs text-slate-500 mt-1">{item.startDate ? new Date(item.startDate).getFullYear() : ''} - {item.current ? 'Present' : (item.endDate ? new Date(item.endDate).getFullYear() : '')}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onEdit} className="p-2 rounded-lg text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
        <button onClick={onDelete} className="p-2 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

function ExperienceForm({ initial, onSave, onCancel }) {
  const blank = { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: [], order: 0 };
  const [form, setForm] = useState(initial ? { ...initial, startDate: initial.startDate?.split('T')[0] || '', endDate: initial.endDate?.split('T')[0] || '', achievements: initial.achievements?.join(', ') || '' } : blank);
  const [saving, setSaving] = useState(false);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = { ...form, achievements: form.achievements.split(',').map(a => a.trim()).filter(Boolean) };
      await onSave(submitData);
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Company *</label><input required value={form.company} onChange={e => set('company', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Position *</label><input required value={form.position} onChange={e => set('position', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Location</label><input value={form.location} onChange={e => set('location', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate} disabled={form.current} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2.5"><input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-4 h-4" /><span className="text-sm">Currently working here</span></label>
      <div><label className={LABEL}>Description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Achievements (comma-separated)</label><textarea rows={2} value={form.achievements} onChange={e => set('achievements', e.target.value)} className={INPUT} placeholder="Built X feature, Improved performance by Y%, etc." /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Projects Tab (existing simplified) ────────────────────────────────────────

function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectsApi.getAll();
      setProjects(res.data.data ?? []);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await projectsApi.create(data);
      else await projectsApi.update(modal._id, data);
      toast.success(`Project ${modal === 'add' ? 'created' : 'updated'}!`);
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsApi.remove(id);
      toast.success('Project deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Projects ({projects.length})</h2>
        <button onClick={() => setModal('add')} className={BTN_PRIMARY}><Plus size={14} /> Add Project</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p._id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-medium text-slate-900 dark:text-white text-sm truncate">{p.title}</p>{p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Featured</span>}</div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{p.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setModal(p)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <Modal title={modal === 'add' ? 'Add Project' : `Edit: ${modal.title}`} onClose={() => setModal(null)}><ProjectForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}

// ─── Certificates Tab (simplified) ─────────────────────────────────────────────

function CertificatesTab() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await certificatesApi.getAll();
      setCertificates(res.data.data ?? []);
    } catch { toast.error('Failed to load certificates'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await certificatesApi.create(data);
      else await certificatesApi.update(modal._id, data);
      toast.success(`Certificate ${modal === 'add' ? 'created' : 'updated'}!`);
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await certificatesApi.remove(id);
      toast.success('Certificate deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Certificates ({certificates.length})</h2>
        <button onClick={() => setModal('add')} className={BTN_PRIMARY}><Plus size={14} /> Add Certificate</button>
      </div>
      {loading ? <SkeletonRows /> : (
        <div className="space-y-3">
          {certificates.map(c => (
            <div key={c._id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div><p className="font-medium text-slate-900 dark:text-white text-sm">{c.name}</p><p className="text-xs text-slate-500">{c.issuer} • {c.category}</p></div>
              <div className="flex items-center gap-1">
                <button onClick={() => setModal(c)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <Modal title={modal === 'add' ? 'Add Certificate' : `Edit: ${modal.name}`} onClose={() => setModal(null)}><CertificateForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}

function CertificateForm({ initial, onSave, onCancel }) {
  const blank = { name: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', category: 'Web Dev', pdfUrl: '' };
  const [form, setForm] = useState(initial ? { ...initial, issueDate: initial.issueDate?.split('T')[0] || '' } : blank);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    setUploadingPdf(true);
    try {
      const res = await certificatesApi.uploadPdf(initial._id, file);
      set('pdfUrl', res.data.data.pdfUrl);
      toast.success('PDF uploaded!');
    } catch { toast.error('Failed to upload PDF.'); }
    finally { setUploadingPdf(false); e.target.value = ''; }
  };

  const handlePdfRemove = async () => {
    try {
      await certificatesApi.deletePdf(initial._id);
      set('pdfUrl', '');
      toast.success('PDF removed.');
    } catch { toast.error('Failed to remove PDF.'); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Issuer *</label><input required value={form.issuer} onChange={e => set('issuer', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3"><div><label className={LABEL}>Issue Date</label><input type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} className={INPUT} /></div><div><label className={LABEL}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}><option>AI/ML</option><option>Web Dev</option><option>Cybersecurity</option><option>Other</option></select></div></div>
      <div><label className={LABEL}>Credential URL</label><input type="url" value={form.credentialUrl} onChange={e => set('credentialUrl', e.target.value)} className={INPUT} /></div>

      {/* PDF Certificate Upload — only available when editing an existing cert */}
      <div>
        <label className={LABEL}>PDF Certificate</label>
        {initial?._id ? (
          form.pdfUrl ? (
            <div className="flex items-center gap-2 mt-1">
              <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"><FileText size={13} />View current PDF</a>
              <label className={`inline-flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg text-xs border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${uploadingPdf ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploadingPdf ? <Spinner /> : <Upload size={12} />}{uploadingPdf ? 'Uploading…' : 'Replace PDF'}
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploadingPdf} />
              </label>
              <button type="button" onClick={handlePdfRemove} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Remove PDF"><Trash2 size={12} /></button>
            </div>
          ) : (
            <label className={`mt-1 inline-flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg text-xs border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${uploadingPdf ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploadingPdf ? <Spinner /> : <Upload size={12} />}{uploadingPdf ? 'Uploading…' : 'Upload PDF'}
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploadingPdf} />
            </label>
          )
        ) : (
          <p className="text-xs text-slate-400 mt-1">Save the certificate first, then edit it to upload a PDF.</p>
        )}
      </div>

      <div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}</button><button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button></div>
    </form>
  );
}

// ─── Profile Tab (simplified) ──────────────────────────────────────────────────

function ProfileTab() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);

  const loadProfile = () =>
    profileApi.get().then(res => setForm(res.data.data)).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false));

  useEffect(() => { loadProfile(); }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSocial = (key, val) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await profileApi.update(form); toast.success('Profile saved!'); } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    setUploadingResume(true);
    try {
      const res = await profileApi.uploadResume(file);
      setForm(f => ({ ...f, resumeUrl: res.data.data.resumeUrl }));
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Failed to upload resume.');
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleResumeDelete = async () => {
    setDeletingResume(true);
    try {
      await profileApi.deleteResume();
      setForm(f => ({ ...f, resumeUrl: '' }));
      toast.success('Resume removed.');
    } catch {
      toast.error('Failed to remove resume.');
    } finally {
      setDeletingResume(false);
    }
  };

  if (loading) return <div className="space-y-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-12 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />)}</div>;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">Profile Settings</h2>
      <div className="grid grid-cols-2 gap-4"><div><label className={LABEL}>Name</label><input value={form.name ?? ''} onChange={e => set('name', e.target.value)} className={INPUT} /></div><div><label className={LABEL}>Title</label><input value={form.title ?? ''} onChange={e => set('title', e.target.value)} className={INPUT} /></div></div>
      <div><label className={LABEL}>Bio</label><textarea rows={5} value={form.bio ?? ''} onChange={e => set('bio', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-4"><div><label className={LABEL}>Location</label><input value={form.location ?? ''} onChange={e => set('location', e.target.value)} className={INPUT} /></div><div><label className={LABEL}>Email</label><input type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} className={INPUT} /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><label className={LABEL}>Availability</label><input value={form.availability ?? ''} onChange={e => set('availability', e.target.value)} className={INPUT} /></div><div><label className={LABEL}>Years of Experience</label><input type="number" value={form.yearsOfExperience ?? 0} onChange={e => set('yearsOfExperience', Number(e.target.value))} className={INPUT} /></div></div>
      <div><h3 className="text-sm font-medium mb-3">Social Links</h3><div className="space-y-3">{['github', 'linkedin', 'twitter'].map(key => (<div key={key} className="flex items-center gap-3"><input type="url" value={form.socialLinks?.[key] ?? ''} onChange={e => setSocial(key, e.target.value)} className={INPUT} placeholder={`https://${key}.com/...`} /></div>))}</div></div>

      {/* Resume upload */}
      <div>
        <h3 className="text-sm font-medium mb-3">Resume (PDF)</h3>
        {form.resumeUrl ? (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40">
            <FileText size={18} className="text-blue-500 shrink-0" />
            <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate flex-1">View current resume</a>
            <button type="button" onClick={handleResumeDelete} disabled={deletingResume} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50">
              {deletingResume ? <Spinner /> : <Trash2 size={12} />} Remove
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-400 mb-2">No resume uploaded yet.</p>
        )}
        <label className={`mt-2 inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg text-sm border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${uploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploadingResume ? <Spinner /> : <Upload size={14} />}
          {uploadingResume ? 'Uploading…' : form.resumeUrl ? 'Replace resume' : 'Upload resume PDF'}
          <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
        </label>
      </div>

      <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? <Spinner /> : <Save size={14} />}{saving ? 'Saving…' : 'Save Profile'}</button>
    </form>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="font-bold text-slate-900 dark:text-white">SA<span className="text-blue-500">.</span> Dashboard</span></div>
          <div className="flex items-center gap-3"><Link to="/" target="_blank" className="text-xs text-slate-500 hover:text-blue-500 hidden sm:block">View site →</Link><DarkModeToggle /><button onClick={handleLogout} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600"><LogOut size={14} /><span className="hidden sm:inline">Logout</span></button></div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 mb-8">
          {TABS.map(({ id, label, Icon }) => (<button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}><Icon size={14} />{label}</button>))}
        </div>
        <div className="pb-16">
          {tab === 'projects' && <ProjectsTab />}
          {tab === 'certificates' && <CertificatesTab />}
          {tab === 'skills' && <SkillsTab />}
          {tab === 'education' && <EducationTab />}
          {tab === 'experience' && <ExperienceTab />}
          {tab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}
