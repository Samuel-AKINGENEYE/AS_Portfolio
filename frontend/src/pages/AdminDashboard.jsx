import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LogOut, Plus, Edit2, Trash2, X, Save, Layers, Award, User, Code,
  BookOpen, Briefcase, Upload, BarChart2, Eye, Play,
  MessageSquare, RefreshCw, Image, FileText, Inbox, Mail, MailOpen, ZoomIn,
  Menu, Zap, Terminal,
} from 'lucide-react';
import {
  projectsApi, certificatesApi, profileApi, skillsApi,
  educationApi, experienceApi, analyticsApi, uploadApi, contactApi,
} from '../services/api.js';
import SkillIcon from '../components/SkillIcon.jsx';

// ─── Always-dark style tokens ─────────────────────────────────────────────────

const C = {
  page:    '#0d1117',
  bar:     '#1c1c1e',
  sidebar: '#161b22',
  editor:  '#1e1e1e',
  card:    '#0d1117',
  border:  'rgba(255,255,255,0.07)',
};

const INPUT =
  'w-full px-3 py-2 rounded-lg text-sm font-mono ' +
  'bg-[#0d1117] border border-[rgba(255,255,255,0.1)] text-slate-200 ' +
  'placeholder:text-slate-600 ' +
  'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 ' +
  'transition-colors';

const LABEL = 'block font-mono text-[11px] text-slate-500 mb-1.5 tracking-wide';

const BTN =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ' +
  'bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs ' +
  'transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

const BTN_G =
  'px-4 py-2 rounded-lg font-mono text-xs ' +
  'border border-[rgba(255,255,255,0.1)] text-slate-400 ' +
  'hover:bg-[rgba(255,255,255,0.05)] transition-colors';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Spinner() {
  return <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />;
}

function LineNum({ n }) {
  return <span className="text-slate-700 text-xs font-mono w-5 text-right shrink-0 select-none">{n}</span>;
}

function SkeletonRows({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: C.card, border: `1px solid ${C.border}` }} />
      ))}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ comment, count, onAdd, addLabel }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="font-mono text-[11px] text-slate-600">// {comment}</p>
        <p className="font-mono text-xs text-slate-500 mt-0.5">
          <span className="text-purple-400">const </span>
          <span className="text-blue-300">items </span>
          <span className="text-slate-600">= </span>
          <span className="text-emerald-400">[ </span>
          <span className="text-yellow-400">{count} entries</span>
          <span className="text-emerald-400"> ]</span>
        </p>
      </div>
      <button onClick={onAdd} className={BTN}>
        <Plus size={12} />
        {addLabel}
      </button>
    </div>
  );
}

// ─── Item card ────────────────────────────────────────────────────────────────

function ItemRow({ lineNum, children, onEdit, onDelete }) {
  return (
    <div
      className="flex items-start gap-3 p-3.5 rounded-lg group transition-colors"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      {lineNum !== undefined && <LineNum n={lineNum} />}
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {onEdit && (
          <button onClick={onEdit} className="p-1.5 rounded text-slate-600 hover:text-blue-400 hover:bg-white/5 transition-colors">
            <Edit2 size={13} />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-white/5 transition-colors">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-xl shadow-2xl max-h-[85vh] flex flex-col"
        style={{ background: C.editor, border: `1px solid ${C.border}` }}
      >
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2">
            <Terminal size={13} className="text-blue-400" />
            <span className="font-mono text-sm text-slate-200">{title}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ─── Image upload field ───────────────────────────────────────────────────────

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
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
            >
              <X size={9} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${uploading ? 'opacity-60 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-blue-400'}`} style={{ border: `1px solid ${C.border}` }}>
            <Image size={11} />
            {uploading ? 'uploading...' : value ? 'replace' : 'upload image'}
            <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />
          </label>
          <button type="button" onClick={() => setShowUrl(v => !v)} className="font-mono text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
            {showUrl ? 'hide url' : 'or paste url'}
          </button>
        </div>
        {showUrl && <input type="url" placeholder="https://..." value={value || ''} onChange={e => onChange(e.target.value)} className={INPUT} />}
      </div>
    </div>
  );
}

// ─── Certificate upload (image or PDF) ───────────────────────────────────────

function CertificateUploadField({ label, value, onChange, folder }) {
  const [uploading, setUploading] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const inputRef = useRef(null);
  const isPdf = (url) => url && /\.(pdf)(\?|$)/i.test(url);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = file.type === 'application/pdf'
        ? await uploadApi.uploadFile(file, folder)
        : await uploadApi.uploadImage(file, folder);
      onChange(res.data.data.url);
      toast.success('File uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="space-y-2">
        {value && (
          isPdf(value) ? (
            <div className="flex items-center gap-2">
              <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-400 hover:text-blue-300">
                <FileText size={11} /> view pdf
              </a>
              <button type="button" onClick={() => onChange('')} className="font-mono text-xs text-red-500 hover:text-red-400">remove</button>
            </div>
          ) : (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
              <img src={value} alt={label} className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors">
                <X size={9} />
              </button>
            </div>
          )
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${uploading ? 'opacity-60 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-blue-400'}`} style={{ border: `1px solid ${C.border}` }}>
            <Upload size={11} />
            {uploading ? 'uploading...' : value ? 'replace file' : 'upload image or pdf'}
            <input ref={inputRef} type="file" accept="image/*,.pdf,application/pdf" onChange={handleFile} className="hidden" disabled={uploading} />
          </label>
          <button type="button" onClick={() => setShowUrl(v => !v)} className="font-mono text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
            {showUrl ? 'hide url' : 'or paste url'}
          </button>
        </div>
        {showUrl && <input type="url" placeholder="https://..." value={value || ''} onChange={e => onChange(e.target.value)} className={INPUT} />}
      </div>
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

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
      <div><label className={LABEL}>// title</label><input required value={form.title} onChange={e => set('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// description</label><textarea required rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// techStack (comma-separated)</label><input value={form.techStack} onChange={e => set('techStack', e.target.value)} className={INPUT} placeholder="React, Node.js, MongoDB" /></div>
      <ImageUploadField label="// imageUrl" value={form.imageUrl} onChange={v => set('imageUrl', v)} folder="portfolio/projects" />
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>// liveUrl</label><input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>// githubUrl</label><input type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-3.5 h-3.5 rounded" />
        <span className="font-mono text-xs text-slate-400">featured: <span className="text-yellow-400">true</span></span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>cancel</button>
      </div>
    </form>
  );
}

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
      toast.success('Saved!'); setModal(null); load();
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await projectsApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <SectionHeader comment="manage projects" count={projects.length} onAdd={() => setModal('add')} addLabel="new_project()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-2">
          {projects.map((p, i) => (
            <ItemRow key={p._id} lineNum={i + 1} onEdit={() => setModal(p)} onDelete={() => handleDelete(p._id)}>
              <div className="flex items-center gap-2.5">
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-8 h-8 rounded object-cover shrink-0" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-slate-200 truncate">{p.title}</p>
                    {p.featured && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>featured</span>}
                  </div>
                  <p className="font-mono text-xs text-slate-600 truncate">{p.description}</p>
                </div>
              </div>
            </ItemRow>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_project()' : `edit("${modal.title}")`} onClose={() => setModal(null)}>
          <ProjectForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Certificates Tab ─────────────────────────────────────────────────────────

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
      <div><label className={LABEL}>// name</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// issuer</label><input required value={form.issuer} onChange={e => set('issuer', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// category</label><select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>{CERT_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div><label className={LABEL}>// issueDate</label><input type="date" value={form.issueDate ? form.issueDate.split('T')[0] : ''} onChange={e => set('issueDate', e.target.value)} className={INPUT} /></div>
      <CertificateUploadField label="// imageUrl (image or pdf)" value={form.imageUrl} onChange={v => set('imageUrl', v)} folder="portfolio/certificates" />
      <div><label className={LABEL}>// credentialUrl</label><input type="url" value={form.credentialUrl} onChange={e => set('credentialUrl', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>cancel</button>
      </div>
    </form>
  );
}

function CertificatesTab() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [preview, setPreview] = useState(null);

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
      <SectionHeader comment="manage certificates" count={certs.length} onAdd={() => setModal('add')} addLabel="new_cert()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-2">
          {certs.map((c, i) => (
            <ItemRow key={c._id} lineNum={i + 1} onEdit={() => setModal(c)} onDelete={() => handleDelete(c._id)}>
              <div className="flex items-center gap-2.5">
                {c.imageUrl
                  ? /\.(pdf)(\?|$)/i.test(c.imageUrl)
                    ? (
                      <a href={c.imageUrl} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid ${C.border}` }}>
                        <FileText size={14} className="text-red-400" />
                      </a>
                    )
                    : (
                      <button onClick={() => setPreview(c)} className="relative w-8 h-8 rounded overflow-hidden shrink-0 group" style={{ border: `1px solid ${C.border}` }}>
                        <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                          <ZoomIn size={10} className="text-white opacity-0 group-hover:opacity-100" />
                        </div>
                      </button>
                    )
                  : <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: C.editor, border: `1px solid ${C.border}` }}><Award size={12} className="text-slate-600" /></div>
                }
                <div className="min-w-0">
                  <p className="font-mono text-sm text-slate-200 truncate">{c.name}</p>
                  <p className="font-mono text-xs text-slate-600">{c.issuer} · {c.category}</p>
                </div>
              </div>
            </ItemRow>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_cert()' : `edit("${modal.name}")`} onClose={() => setModal(null)}>
          <CertificateForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl" style={{ background: C.editor, border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p className="font-mono text-sm text-slate-200">{preview.name}</p>
                <p className="font-mono text-[11px] text-slate-500">{preview.issuer} · {preview.category}</p>
              </div>
              <div className="flex items-center gap-3">
                {preview.credentialUrl && (
                  <a href={preview.credentialUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Eye size={11} /> credential</a>
                )}
                <button onClick={() => setPreview(null)} className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"><X size={14} /></button>
              </div>
            </div>
            {/\.(pdf)(\?|$)/i.test(preview.imageUrl)
              ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4" style={{ background: C.page }}>
                  <FileText size={40} className="text-red-400" />
                  <p className="font-mono text-sm text-slate-500">{preview.name}</p>
                  <a href={preview.imageUrl} target="_blank" rel="noopener noreferrer" className={BTN}><Eye size={12} /> open pdf</a>
                </div>
              )
              : <img src={preview.imageUrl} alt={preview.name} className="w-full max-h-[70vh] object-contain p-4" style={{ background: C.page }} />
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];

function SkillForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', category: 'Frontend', icon: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const iconLookup = form.icon || form.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={LABEL}>// name</label>
        <div className="flex items-center gap-2">
          {iconLookup && (
            <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <SkillIcon name={iconLookup} size={18} />
            </span>
          )}
          <input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} placeholder="e.g. React, Python, Docker…" />
        </div>
        <p className="font-mono text-[10px] text-slate-600 mt-1">icon auto-generated from name — override below if needed</p>
      </div>
      <div><label className={LABEL}>// category</label><select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>{SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div>
        <label className={LABEL}>// icon override <span className="text-slate-600 font-normal">(optional)</span></label>
        <input value={form.icon || ''} onChange={e => set('icon', e.target.value)} className={INPUT} placeholder="e.g. Vue.js, Node.js" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>cancel</button>
      </div>
    </form>
  );
}

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
      <SectionHeader comment="manage skills" count={skills.length} onAdd={() => setModal('add')} addLabel="new_skill()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-5">
          {SKILL_CATEGORIES.filter(c => grouped[c]?.length).map(cat => (
            <div key={cat}>
              <p className="font-mono text-[10px] text-slate-600 mb-2">// {cat.toLowerCase()}</p>
              <div className="space-y-1.5">
                {grouped[cat].map((s, i) => (
                  <ItemRow key={s._id} lineNum={i + 1} onEdit={() => setModal(s)} onDelete={() => handleDelete(s._id)}>
                    <div className="flex items-center gap-2.5">
                      <SkillIcon name={s.icon || s.name} size={18} />
                      <span className="font-mono text-sm text-slate-200">{s.name}</span>
                    </div>
                  </ItemRow>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_skill()' : `edit("${modal.name}")`} onClose={() => setModal(null)}>
          <SkillForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Education Tab ────────────────────────────────────────────────────────────

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
      <div><label className={LABEL}>// institution</label><input required value={form.institution} onChange={e => set('institution', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// degree</label><input required value={form.degree} onChange={e => set('degree', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// startDate</label><input type="date" value={form.startDate ? form.startDate.split('T')[0] : ''} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// endDate</label><input type="date" value={form.endDate ? form.endDate.split('T')[0] : ''} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-3.5 h-3.5 rounded" />
        <span className="font-mono text-xs text-slate-400">current: <span className="text-yellow-400">true</span></span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>cancel</button>
      </div>
    </form>
  );
}

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
      <SectionHeader comment="manage education" count={edu.length} onAdd={() => setModal('add')} addLabel="new_edu()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-2">
          {edu.map((e, i) => (
            <ItemRow key={e._id} lineNum={i + 1} onEdit={() => setModal(e)} onDelete={() => handleDelete(e._id)}>
              <p className="font-mono text-sm text-slate-200">{e.degree}</p>
              <p className="font-mono text-xs text-slate-600">{e.institution}</p>
            </ItemRow>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_edu()' : `edit("${modal.institution}")`} onClose={() => setModal(null)}>
          <EducationForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Experience Tab ───────────────────────────────────────────────────────────

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
      <div><label className={LABEL}>// company</label><input required value={form.company} onChange={e => set('company', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// position</label><input required value={form.position} onChange={e => set('position', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// startDate</label><input type="date" value={form.startDate ? form.startDate.split('T')[0] : ''} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// endDate</label><input type="date" value={form.endDate ? form.endDate.split('T')[0] : ''} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-3.5 h-3.5 rounded" />
        <span className="font-mono text-xs text-slate-400">current: <span className="text-yellow-400">true</span></span>
      </label>
      <div><label className={LABEL}>// description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_G}>cancel</button>
      </div>
    </form>
  );
}

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
      <SectionHeader comment="manage experience" count={exp.length} onAdd={() => setModal('add')} addLabel="new_exp()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-2">
          {exp.map((e, i) => (
            <ItemRow key={e._id} lineNum={i + 1} onEdit={() => setModal(e)} onDelete={() => handleDelete(e._id)}>
              <p className="font-mono text-sm text-slate-200">{e.position}</p>
              <p className="font-mono text-xs text-slate-600">{e.company}</p>
            </ItemRow>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_exp()' : `edit("${modal.position}")`} onClose={() => setModal(null)}>
          <ExperienceForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const avatarRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarUrl, setShowAvatarUrl] = useState(false);

  useEffect(() => {
    profileApi.get().then(r => setForm(r.data.data)).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false));
  }, []);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingAvatar(true);
    try { const res = await uploadApi.uploadAvatar(file); setField('avatar', res.data.data.url); toast.success('Avatar uploaded!'); }
    catch { toast.error('Avatar upload failed'); }
    finally { setUploadingAvatar(false); if (avatarRef.current) avatarRef.current.value = ''; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await profileApi.update(form); toast.success('Profile saved!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: C.card }} />)}</div>;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <p className="font-mono text-[11px] text-slate-600">// profile settings</p>

      {/* Avatar */}
      <div>
        <label className={LABEL}>// avatar</label>
        <div className="flex items-start gap-4">
          {form.avatar
            ? <img src={form.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover shrink-0" style={{ border: `2px solid ${C.border}` }} />
            : <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: C.card, border: `1px solid ${C.border}` }}><User size={20} className="text-slate-600" /></div>
          }
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${uploadingAvatar ? 'opacity-60 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-blue-400'}`} style={{ border: `1px solid ${C.border}` }}>
                <Image size={11} />{uploadingAvatar ? 'uploading...' : form.avatar ? 'replace avatar' : 'upload avatar'}
                <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
              </label>
              <button type="button" onClick={() => setShowAvatarUrl(v => !v)} className="font-mono text-[10px] text-slate-600 hover:text-slate-400">
                {showAvatarUrl ? 'hide url' : 'or paste url'}
              </button>
            </div>
            {showAvatarUrl && <input type="url" placeholder="https://..." value={form.avatar || ''} onChange={e => setField('avatar', e.target.value)} className={INPUT} />}
          </div>
        </div>
      </div>

      <div><label className={LABEL}>// name</label><input value={form.name || ''} onChange={e => setField('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// title</label><input value={form.title || ''} onChange={e => setField('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// bio</label><textarea rows={4} value={form.bio || ''} onChange={e => setField('bio', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// location</label><input value={form.location || ''} onChange={e => setField('location', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// email</label><input type="email" value={form.email || ''} onChange={e => setField('email', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// availability</label><input value={form.availability || ''} onChange={e => setField('availability', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// yearsOfExperience</label><input type="number" min="0" value={form.yearsOfExperience || 0} onChange={e => setField('yearsOfExperience', Number(e.target.value))} className={INPUT} /></div>

      <div>
        <p className="font-mono text-[11px] text-slate-600 mb-3">// socialLinks</p>
        {['github', 'linkedin', 'twitter'].map(key => (
          <div key={key} className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-green-400 w-16 shrink-0">{key}:</span>
            <input type="url" value={form.socialLinks?.[key] || ''} onChange={e => setSocial(key, e.target.value)} className={INPUT} placeholder={`https://${key}.com/...`} />
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving} className={BTN}>
        {saving ? <Spinner /> : <Save size={12} />}
        {saving ? 'saving...' : '> profile.save()'}
      </button>
    </form>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent = '#3b82f6' }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} style={{ color: accent }} />
        <span className="font-mono text-[11px] text-slate-500">{label}</span>
      </div>
      <p className="font-mono text-2xl font-bold text-slate-200">{value ?? '—'}</p>
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-[11px] text-slate-600">// analytics.getStats()</p>
          <p className="font-mono text-xs text-slate-500 mt-0.5">
            <span className="text-purple-400">const </span>
            <span className="text-blue-300">period </span>
            <span className="text-slate-600">= </span>
            <span className="text-yellow-400">{days} days</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={days} onChange={e => setDays(Number(e.target.value))} className={INPUT + ' w-36'}>
            <option value={7}>last 7 days</option>
            <option value={30}>last 30 days</option>
            <option value={90}>last 90 days</option>
          </select>
          <button onClick={load} className={BTN_G} title="Refresh"><RefreshCw size={12} /></button>
        </div>
      </div>
      {loading ? <SkeletonRows count={1} /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Eye} label="page_views" value={stats?.totalViews?.toLocaleString()} accent="#3b82f6" />
          <StatCard icon={BarChart2} label="unique_visitors" value={stats?.uniqueVisitors?.toLocaleString()} accent="#a855f7" />
          <StatCard icon={Play} label="profile_views" value={stats?.profileViews?.toLocaleString()} accent="#10b981" />
          <StatCard icon={MessageSquare} label="contact_forms" value={stats?.contactForms?.toLocaleString()} accent="#f59e0b" />
        </div>
      )}
      <p className="font-mono text-[10px] text-slate-700 mt-4">// stats counted from mongodb — tracking fires on each page load and user action</p>
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab({ onUnreadChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setLoadError(false);
    try {
      const r = await contactApi.getMessages();
      const data = r.data.data ?? [];
      setMessages(data);
      onUnreadChange?.(data.filter(m => !m.read).length);
    } catch { setLoadError(true); }
    finally { setLoading(false); }
  }, [onUnreadChange]);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (msg) => {
    if (msg.read) return;
    try {
      await contactApi.markRead(msg._id);
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
      onUnreadChange?.(messages.filter(m => !m.read && m._id !== msg._id).length);
    } catch { toast.error('Failed to mark read'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await contactApi.deleteMessage(id);
      const next = messages.filter(m => m._id !== id);
      setMessages(next);
      onUnreadChange?.(next.filter(m => !m.read).length);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-[11px] text-slate-600">// inbox messages</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-mono text-xs text-slate-500">
              <span className="text-purple-400">const </span>
              <span className="text-blue-300">unread </span>
              <span className="text-slate-600">= </span>
              <span className="text-yellow-400">{unread}</span>
            </p>
          </div>
        </div>
        <button onClick={load} className={BTN_G} title="Refresh"><RefreshCw size={12} /></button>
      </div>

      {loading ? <SkeletonRows count={3} /> : loadError ? (
        <div className="text-center py-16">
          <Inbox size={32} className="mx-auto mb-3 text-slate-700" />
          <p className="font-mono text-sm text-slate-600 mb-4">could not load messages</p>
          <button onClick={load} className={BTN_G}>try again</button>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16">
          <Inbox size={32} className="mx-auto mb-3 text-slate-700" />
          <p className="font-mono text-sm text-slate-600">no messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <div
              key={msg._id}
              className="rounded-lg overflow-hidden transition-all"
              style={{
                background: msg.read ? C.card : 'rgba(59,130,246,0.05)',
                border: msg.read ? `1px solid ${C.border}` : '1px solid rgba(59,130,246,0.2)',
              }}
            >
              <div
                className="flex items-start gap-3 p-3.5 cursor-pointer"
                onClick={() => { setExpanded(expanded === msg._id ? null : msg._id); handleMarkRead(msg); }}
              >
                <div className={`mt-0.5 shrink-0 ${msg.read ? 'text-slate-600' : 'text-blue-400'}`}>
                  {msg.read ? <MailOpen size={14} /> : <Mail size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`font-mono text-sm truncate ${msg.read ? 'text-slate-400' : 'text-slate-200'}`}>{msg.name}</p>
                    <p className="font-mono text-[10px] text-slate-600 shrink-0">{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <p className="font-mono text-xs text-slate-600 truncate">{msg.email}</p>
                  {expanded !== msg._id && <p className="font-mono text-xs text-slate-700 mt-0.5 truncate">{msg.message}</p>}
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(msg._id); }} className="p-1.5 shrink-0 rounded text-slate-700 hover:text-red-400 hover:bg-white/5 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
              {expanded === msg._id && (
                <div className="px-4 pb-4 pt-1 ml-8" style={{ borderTop: `1px solid ${C.border}` }}>
                  <p className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <a href={`mailto:${msg.email}?subject=Re: Your message&body=Hi ${msg.name},%0A%0A`} className="font-mono text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Mail size={11} /> reply via email</a>
                    {!msg.read && <button onClick={() => handleMarkRead(msg)} className="font-mono text-xs text-slate-600 hover:text-slate-400">mark as read</button>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'projects',     label: 'projects.js',     file: 'projects.js',     Icon: Layers    },
  { id: 'certificates', label: 'certificates.js',  file: 'certificates.js', Icon: Award     },
  { id: 'messages',     label: 'messages.js',      file: 'messages.js',     Icon: Inbox     },
  { id: 'skills',       label: 'skills.js',        file: 'skills.js',       Icon: Code      },
  { id: 'education',    label: 'education.js',     file: 'education.js',    Icon: BookOpen  },
  { id: 'experience',   label: 'experience.js',    file: 'experience.js',   Icon: Briefcase },
  { id: 'analytics',    label: 'analytics.js',     file: 'analytics.js',    Icon: BarChart2 },
  { id: 'profile',      label: 'profile.js',       file: 'profile.js',      Icon: User      },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('projects');
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    contactApi.getMessages()
      .then(r => { const data = r.data.data ?? []; setUnreadCount(data.filter(m => !m.read).length); })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Session ended');
    navigate('/admin/login');
  };

  const activeTab = TABS.find(t => t.id === tab);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.page }}>

      {/* VS Code title bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 shrink-0 z-40"
        style={{ background: C.bar, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Zap size={12} className="text-blue-400" />
          <span className="font-mono text-xs text-slate-400">
            SA<span className="text-blue-400">.</span>admin —{' '}
            <span className="text-slate-300">{activeTab?.file ?? 'dashboard.jsx'}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" target="_blank" className="font-mono text-[11px] text-slate-500 hover:text-blue-400 transition-colors hidden sm:block">
            ↗ view site
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={11} />
            <span className="hidden sm:inline">logout</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">

        {/* VS Code sidebar (desktop) */}
        <aside
          className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0"
          style={{ background: C.sidebar, borderRight: `1px solid ${C.border}` }}
        >
          {/* Explorer header */}
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Explorer</p>
            <p className="font-mono text-xs text-slate-400 mt-0.5">Portfolio CMS</p>
          </div>

          {/* File tree */}
          <div className="flex-1 overflow-y-auto py-2">
            <p className="font-mono text-[10px] text-slate-600 px-4 py-1 uppercase tracking-widest">src / admin</p>
            {TABS.map(({ id, file, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="w-full flex items-center gap-2 px-4 py-1.5 font-mono text-xs transition-colors relative"
                  style={{
                    background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
                    color: active ? '#e2e8f0' : '#6b7280',
                    borderLeft: active ? '2px solid #3b82f6' : '2px solid transparent',
                  }}
                >
                  <Icon size={12} className={active ? 'text-blue-400' : 'text-slate-700'} />
                  <span className="truncate">{file}</span>
                  {id === 'messages' && (
                    <span
                      className="ml-auto shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full font-mono text-[10px] font-bold"
                      style={{
                        background: unreadCount > 0 ? '#22c55e' : 'rgba(255,255,255,0.06)',
                        color: unreadCount > 0 ? '#fff' : '#4b5563',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div className="p-3 space-y-1" style={{ borderTop: `1px solid ${C.border}` }}>
            <Link to="/" className="block font-mono text-xs text-blue-400 hover:text-blue-300 transition-colors px-1">↗ view site</Link>
            <button onClick={handleLogout} className="w-full text-left font-mono text-xs text-slate-600 hover:text-red-400 flex items-center gap-1.5 transition-colors px-1">
              <LogOut size={11} /> logout
            </button>
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative h-full w-64 flex flex-col" style={{ background: C.sidebar, borderRight: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                <p className="font-mono text-xs text-slate-400">Portfolio CMS</p>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"><X size={14} /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {TABS.map(({ id, file, Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setTab(id); setSidebarOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 font-mono text-xs transition-colors"
                      style={{
                        background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
                        color: active ? '#e2e8f0' : '#6b7280',
                        borderLeft: active ? '2px solid #3b82f6' : '2px solid transparent',
                      }}
                    >
                      <Icon size={12} className={active ? 'text-blue-400' : 'text-slate-700'} />
                      <span className="truncate">{file}</span>
                      {id === 'messages' && (
                        <span className="ml-auto shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full font-mono text-[10px] font-bold"
                          style={{ background: unreadCount > 0 ? '#22c55e' : 'rgba(255,255,255,0.06)', color: unreadCount > 0 ? '#fff' : '#4b5563' }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Editor content area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-auto" style={{ background: C.editor }}>

          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2.5" style={{ background: C.bar, borderBottom: `1px solid ${C.border}` }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Menu size={14} /> explorer
            </button>
            <span className="font-mono text-xs text-slate-500">{activeTab?.file}</span>
          </div>

          {/* File doc comment */}
          <div className="px-6 pt-6 pb-2">
            <p className="font-mono text-[11px] text-slate-700">{'/**'}</p>
            <p className="font-mono text-[11px] text-slate-700">{` * @file ${activeTab?.file}`}</p>
            <p className="font-mono text-[11px] text-slate-700">{' * @author Samuel AKINGENEYE'}</p>
            <p className="font-mono text-[11px] text-slate-700">{' */'}</p>
          </div>

          {/* Tab content */}
          <div className="flex-1 px-6 py-4 pb-16">
            {tab === 'projects'     && <ProjectsTab />}
            {tab === 'certificates' && <CertificatesTab />}
            {tab === 'messages'     && <MessagesTab onUnreadChange={setUnreadCount} />}
            {tab === 'skills'       && <SkillsTab />}
            {tab === 'education'    && <EducationTab />}
            {tab === 'experience'   && <ExperienceTab />}
            {tab === 'analytics'    && <AnalyticsTab />}
            {tab === 'profile'      && <ProfileTab />}
          </div>
        </main>
      </div>

      {/* VS Code status bar */}
      <div
        className="flex items-center justify-between px-4 py-1 shrink-0"
        style={{ background: '#007acc' }}
      >
        <div className="flex items-center gap-3 font-mono text-[10px] text-white/80">
          <span>⚡ Portfolio CMS</span>
          <span>main</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-white/70">
          <span>{activeTab?.file}</span>
          <span>JavaScript</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
