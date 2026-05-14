import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LogOut, Plus, Edit2, Trash2, X, Save, Layers, Award, User, Code,
  BookOpen, Briefcase, Upload, BarChart2, Eye, Download,
  MessageSquare, RefreshCw, Image, FileText,
} from 'lucide-react';
import {
  projectsApi, certificatesApi, profileApi, skillsApi,
  educationApi, experienceApi, analyticsApi, uploadApi,
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
// Reusable image upload field (file picker; URL input hidden by default)
// ──────────────────────────────────────────────────────────────────────────
function ImageUploadField({ label, value, onChange, folder, accept = 'image/*' }) {
  const [uploading, setUploading] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file, folder);
      onChange(res.data.data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
            >
              <X size={10} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${uploading ? 'opacity-60 cursor-not-allowed' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
            <Image size={13} />
            {uploading ? 'Uploading…' : value ? 'Replace Image' : 'Upload Image'}
            <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />
          </label>
          <button
            type="button"
            onClick={() => setShowUrl(v => !v)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:underline underline-offset-2"
          >
            {showUrl ? 'hide URL field' : 'or paste URL'}
          </button>
        </div>
        {showUrl && (
          <input
            type="url"
            placeholder="Paste image URL here"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={INPUT}
          />
        )}
      </div>
    </div>
  );
}

// Reusable file upload field (PDF / any file; URL input hidden by default)
function FileUploadField({ label, value, onChange, folder, accept, fieldName = 'file', icon: Icon = FileText }) {
  const [uploading, setUploading] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = fieldName === 'resume'
        ? await uploadApi.uploadResume(file)
        : await uploadApi.uploadFile(file, folder);
      onChange(res.data.data.url);
      toast.success('File uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="space-y-2">
        {value && (
          <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-green-500 hover:text-green-600">
            <Icon size={13} /> View current file
          </a>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${uploading ? 'opacity-60 cursor-not-allowed' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
            <Upload size={13} />
            {uploading ? 'Uploading…' : value ? `Replace ${label}` : `Upload ${label}`}
            <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />
          </label>
          <button
            type="button"
            onClick={() => setShowUrl(v => !v)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:underline underline-offset-2"
          >
            {showUrl ? 'hide URL field' : 'or paste URL'}
          </button>
        </div>
        {showUrl && (
          <input
            type="url"
            placeholder="Paste file URL here"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={INPUT}
          />
        )}
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
    } catch { toast.error('Save failed'); }
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
              <div className="flex items-center gap-3">
                {p.imageUrl && <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-slate-500 truncate">{p.description}</p>
                </div>
              </div>
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
      <div><label className={LABEL}>Tech Stack (comma-separated)</label><input value={form.techStack} onChange={e => set('techStack', e.target.value)} className={INPUT} /></div>
      <ImageUploadField label="Project Image" value={form.imageUrl} onChange={v => set('imageUrl', v)} folder="portfolio/projects" />
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>Live URL</label><input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>GitHub URL</label><input type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /><span>Featured</span></label>
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
    } catch { toast.error('Save failed'); }
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
              <div className="flex items-center gap-3">
                {c.imageUrl && <img src={c.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.issuer} · {c.category}</p>
                </div>
              </div>
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

const CERT_CATEGORIES = ['AI/ML', 'Web Dev', 'Cybersecurity', 'Other'];

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
      <div>
        <label className={LABEL}>Category</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
          {CERT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div><label className={LABEL}>Issue Date</label><input type="date" value={form.issueDate ? form.issueDate.split('T')[0] : ''} onChange={e => set('issueDate', e.target.value)} className={INPUT} /></div>
      <ImageUploadField label="Certificate Image" value={form.imageUrl} onChange={v => set('imageUrl', v)} folder="portfolio/certificates" />
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
    } catch { toast.error('Save failed'); }
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
    } catch { toast.error('Save failed'); }
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
      <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate ? form.startDate.split('T')[0] : ''} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate ? form.endDate.split('T')[0] : ''} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} /><span>Current</span></label>
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
    } catch { toast.error('Save failed'); }
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
      <div><label className={LABEL}>Start Date</label><input type="date" value={form.startDate ? form.startDate.split('T')[0] : ''} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>End Date</label><input type="date" value={form.endDate ? form.endDate.split('T')[0] : ''} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} /><span>Current</span></label>
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
  const avatarRef = useRef(null);
  const resumeRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showAvatarUrl, setShowAvatarUrl] = useState(false);
  const [showResumeUrl, setShowResumeUrl] = useState(false);

  useEffect(() => {
    profileApi.get()
      .then(r => setForm(r.data.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadApi.uploadAvatar(file);
      setField('avatar', res.data.data.url);
      toast.success('Avatar uploaded!');
    } catch { toast.error('Avatar upload failed'); }
    finally { setUploadingAvatar(false); if (avatarRef.current) avatarRef.current.value = ''; }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      const res = await uploadApi.uploadResume(file);
      setField('resumeUrl', res.data.data.url);
      toast.success('Resume uploaded!');
    } catch { toast.error('Resume upload failed'); }
    finally { setUploadingResume(false); if (resumeRef.current) resumeRef.current.value = ''; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await profileApi.update(form); toast.success('Profile saved!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-sm text-slate-500 py-8 text-center">Loading profile…</div>;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">Profile Settings</h2>

      {/* Avatar */}
      <div>
        <label className={LABEL}>Avatar</label>
        <div className="flex items-start gap-4">
          {form.avatar
            ? <img src={form.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-600" />
            : <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0"><User size={24} className="text-slate-400" /></div>
          }
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${uploadingAvatar ? 'opacity-60 cursor-not-allowed' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
                <Image size={13} />
                {uploadingAvatar ? 'Uploading…' : form.avatar ? 'Replace Avatar' : 'Upload Avatar'}
                <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
              </label>
              <button type="button" onClick={() => setShowAvatarUrl(v => !v)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:underline underline-offset-2">
                {showAvatarUrl ? 'hide URL field' : 'or paste URL'}
              </button>
            </div>
            {showAvatarUrl && (
              <input type="url" placeholder="Paste image URL here" value={form.avatar || ''} onChange={e => setField('avatar', e.target.value)} className={INPUT} />
            )}
          </div>
        </div>
      </div>

      {/* Resume */}
      <div>
        <label className={LABEL}>Resume (PDF)</label>
        <div className="space-y-2">
          {form.resumeUrl && (
            <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-green-500 hover:text-green-600">
              <Download size={13} /> View current resume
            </a>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${uploadingResume ? 'opacity-60 cursor-not-allowed' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
              <Upload size={13} />
              {uploadingResume ? 'Uploading…' : form.resumeUrl ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
              <input ref={resumeRef} type="file" accept=".pdf,application/pdf" onChange={handleResumeUpload} className="hidden" disabled={uploadingResume} />
            </label>
            <button type="button" onClick={() => setShowResumeUrl(v => !v)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:underline underline-offset-2">
              {showResumeUrl ? 'hide URL field' : 'or paste URL'}
            </button>
          </div>
          {showResumeUrl && (
            <input type="url" placeholder="Paste resume URL here" value={form.resumeUrl || ''} onChange={e => setField('resumeUrl', e.target.value)} className={INPUT} />
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">Uploaded resume will appear in the "Download Resume" button on the contact section.</p>
      </div>

      <div><label className={LABEL}>Name</label><input value={form.name || ''} onChange={e => setField('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Title</label><input value={form.title || ''} onChange={e => setField('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Bio</label><textarea rows={4} value={form.bio || ''} onChange={e => setField('bio', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Location</label><input value={form.location || ''} onChange={e => setField('location', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Email</label><input type="email" value={form.email || ''} onChange={e => setField('email', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Availability</label><input value={form.availability || ''} onChange={e => setField('availability', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>Years of Experience</label><input type="number" min="0" value={form.yearsOfExperience || 0} onChange={e => setField('yearsOfExperience', Number(e.target.value))} className={INPUT} /></div>

      <div>
        <h3 className="font-medium text-sm mb-3">Social Links</h3>
        {['github', 'linkedin', 'twitter'].map(key => (
          <div key={key} className="mb-3">
            <label className={LABEL}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
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
function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <div className="flex items-center gap-2">
          <select value={days} onChange={e => setDays(Number(e.target.value))} className={INPUT + ' w-36'}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button onClick={load} className={BTN_G} title="Refresh"><RefreshCw size={14} /></button>
        </div>
      </div>
      {loading ? <SkeletonRows count={1} /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Eye} label="Page Views" value={stats?.totalViews?.toLocaleString()} color="blue" />
          <StatCard icon={BarChart2} label="Unique Visitors" value={stats?.uniqueVisitors?.toLocaleString()} color="purple" />
          <StatCard icon={Download} label="Resume Downloads" value={stats?.resumeDownloads?.toLocaleString()} color="green" />
          <StatCard icon={MessageSquare} label="Contact Forms" value={stats?.contactForms?.toLocaleString()} color="orange" />
        </div>
      )}
      <p className="text-xs text-slate-400 mt-4">Stats are counted from MongoDB — tracking fires on each page load and tracked user actions.</p>
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
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="font-bold text-xl">SA Dashboard</span>
          <div className="flex gap-3 items-center">
            <Link to="/" className="text-sm text-blue-500 hover:text-blue-600">View Site</Link>
            <DarkModeToggle />
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"><LogOut size={13} /> Logout</button>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500'}`}>
              <Icon size={13} />{label}
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
