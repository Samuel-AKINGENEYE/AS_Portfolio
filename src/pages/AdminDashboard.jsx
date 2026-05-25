import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LogOut, Plus, Edit2, Trash2, X, Save,
  Layers, Award, User, Code, BookOpen, Briefcase,
  ExternalLink, Zap, Terminal,
  ChevronUp, ChevronDown,
} from 'lucide-react';
import { projectsApi, certificatesApi, profileApi, skillsApi, educationApi, experienceApi } from '../services/api.js';

// ─── Style tokens (always-dark admin aesthetic) ────────────────────────────────

const C = {
  page:     '#0d1117',
  titlebar: '#1c1c1e',
  tabbar:   '#252526',
  editor:   '#1e1e1e',
  card:     '#161b22',
  border:   'rgba(255,255,255,0.07)',
  borderFocus: '#3b82f6',
};

const INPUT =
  'w-full px-3 py-2 rounded-lg text-sm font-mono ' +
  'bg-[#0d1117] border border-[rgba(255,255,255,0.1)] text-slate-200 ' +
  'placeholder:text-slate-600 ' +
  'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 ' +
  'transition-colors';

const LABEL = 'block font-mono text-[11px] text-slate-500 mb-1.5 tracking-wide';

const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ' +
  'bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs ' +
  'transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

const BTN_GHOST =
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
        <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: C.card }} />
      ))}
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
        {/* Modal title bar */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2">
            <Terminal size={13} className="text-blue-400" />
            <span className="font-mono text-sm text-slate-200">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ─── Item card ────────────────────────────────────────────────────────────────

function ItemCard({ lineNum, primary, secondary, tertiary, badge, onEdit, onDelete }) {
  return (
    <div
      className="flex items-start gap-3 p-3.5 rounded-lg group transition-colors"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <LineNum n={lineNum} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-mono text-sm text-slate-200 truncate">{primary}</p>
          {badge && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
              {badge}
            </span>
          )}
        </div>
        {secondary && <p className="font-mono text-xs text-slate-500 mt-0.5 truncate">{secondary}</p>}
        {tertiary && <p className="font-mono text-[10px] text-slate-600 mt-0.5">{tertiary}</p>}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 rounded text-slate-600 hover:text-blue-400 hover:bg-white/5 transition-colors"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ comment, count, onAdd, addLabel }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="font-mono text-[11px] text-slate-600">// {comment}</p>
        <p className="font-mono text-xs text-slate-400 mt-0.5">
          <span className="text-purple-400">const </span>
          <span className="text-blue-300">items </span>
          <span className="text-slate-500">= </span>
          <span className="text-emerald-400">[ </span>
          <span className="text-yellow-400">{count} entries</span>
          <span className="text-emerald-400"> ]</span>
        </span>
      </div>
      <button onClick={onAdd} className={BTN_PRIMARY}>
        <Plus size={12} />
        {addLabel}
      </button>
    </div>
  );
}

// ─── Project form ─────────────────────────────────────────────────────────────

function ProjectForm({ initial, onSave, onCancel }) {
  const blank = { title: '', description: '', longDescription: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false };
  const [form, setForm] = useState(initial ?? blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>// title</label><input required value={form.title} onChange={e => set('title', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// description</label><textarea required rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT + ' resize-none'} /></div>
      <div><label className={LABEL}>// techStack (comma-separated)</label><input value={form.techStack} onChange={e => set('techStack', e.target.value)} className={INPUT} placeholder="React, Node.js, MongoDB" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>// liveUrl</label><input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>// githubUrl</label><input type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500" />
        <span className="font-mono text-xs text-slate-400">featured: <span className="text-yellow-400">true</span></span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>cancel</button>
      </div>
    </form>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await projectsApi.getAll(); setProjects(res.data.data ?? []); }
    catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await projectsApi.create(data);
      else await projectsApi.update(modal._id, data);
      toast.success(`Project ${modal === 'add' ? 'created' : 'updated'}`);
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
      <SectionHeader comment="manage projects" count={projects.length} onAdd={() => setModal('add')} addLabel="new_project()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-2">
          {projects.map((p, i) => (
            <ItemCard
              key={p._id}
              lineNum={i + 1}
              primary={p.title}
              secondary={Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack}
              tertiary={p.description}
              badge={p.featured ? 'featured' : null}
              onEdit={() => setModal(p)}
              onDelete={() => handleDelete(p._id)}
            />
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

function CertificateForm({ initial, onSave, onCancel }) {
  const blank = { name: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', category: 'Web Dev' };
  const [form, setForm] = useState(initial ? { ...initial, issueDate: initial.issueDate?.split('T')[0] || '' } : blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>// name</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// issuer</label><input required value={form.issuer} onChange={e => set('issuer', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>// issueDate</label><input type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} className={INPUT} /></div>
        <div>
          <label className={LABEL}>// category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
            <option>AI/ML</option><option>Web Dev</option><option>Cybersecurity</option><option>Other</option>
          </select>
        </div>
      </div>
      <div><label className={LABEL}>// credentialUrl</label><input type="url" value={form.credentialUrl} onChange={e => set('credentialUrl', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>cancel</button>
      </div>
    </form>
  );
}

function CertificatesTab() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await certificatesApi.getAll(); setCerts(res.data.data ?? []); }
    catch { toast.error('Failed to load certificates'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await certificatesApi.create(data);
      else await certificatesApi.update(modal._id, data);
      toast.success(`Certificate ${modal === 'add' ? 'created' : 'updated'}`);
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
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
            <ItemCard
              key={c._id}
              lineNum={i + 1}
              primary={c.name}
              secondary={`${c.issuer} · ${c.category}`}
              onEdit={() => setModal(c)}
              onDelete={() => handleDelete(c._id)}
            />
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_cert()' : `edit("${modal.name}")`} onClose={() => setModal(null)}>
          <CertificateForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];

function SkillForm({ initial, onSave, onCancel }) {
  const blank = { name: '', category: 'Frontend', proficiency: 85, order: 0 };
  const [form, setForm] = useState(initial ?? blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>// name</label><input required value={form.name} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// category</label><select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>{SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div><label className={LABEL}>// proficiency (%)</label><input type="number" min="0" max="100" value={form.proficiency} onChange={e => set('proficiency', parseInt(e.target.value))} className={INPUT} /></div>
      <div><label className={LABEL}>// order (lower = first)</label><input type="number" value={form.order} onChange={e => set('order', parseInt(e.target.value))} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>cancel</button>
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
    try { const res = await skillsApi.getAll(); setSkills(res.data.data ?? []); }
    catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') await skillsApi.create(data);
      else await skillsApi.update(modal._id, data);
      toast.success(`Skill ${modal === 'add' ? 'created' : 'updated'}`);
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.error ?? 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await skillsApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <SectionHeader comment="manage skills" count={skills.length} onAdd={() => setModal('add')} addLabel="new_skill()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-4">
          {SKILL_CATEGORIES.map(cat => {
            const catSkills = skills.filter(s => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <div key={cat}>
                <p className="font-mono text-[10px] text-slate-600 mb-2">// {cat.toLowerCase()}</p>
                <div className="space-y-1.5">
                  {catSkills.map((skill, i) => (
                    <div
                      key={skill._id}
                      className="flex items-center gap-3 p-3 rounded-lg group"
                      style={{ background: C.card, border: `1px solid ${C.border}` }}
                    >
                      <LineNum n={i + 1} />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs text-slate-200">{skill.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 max-w-[120px] h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${skill.proficiency || 85}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-slate-600">{skill.proficiency || 85}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModal(skill)} className="p-1.5 rounded text-slate-600 hover:text-blue-400 hover:bg-white/5"><Edit2 size={12} /></button>
                        <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-white/5"><Trash2 size={12} /></button>
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
        <Modal title={modal === 'add' ? 'new_skill()' : `edit("${modal.name}")`} onClose={() => setModal(null)}>
          <SkillForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Education Tab ────────────────────────────────────────────────────────────

function EducationForm({ initial, onSave, onCancel }) {
  const blank = { institution: '', degree: '', startDate: '', endDate: '', current: false, description: '', order: 0 };
  const [form, setForm] = useState(initial ? { ...initial, startDate: initial.startDate?.split('T')[0] || '', endDate: initial.endDate?.split('T')[0] || '' } : blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>// institution</label><input required value={form.institution} onChange={e => set('institution', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// degree</label><input required value={form.degree} onChange={e => set('degree', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>// startDate</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>// endDate</label><input type="date" value={form.endDate} disabled={form.current} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500" />
        <span className="font-mono text-xs text-slate-400">current: <span className="text-yellow-400">true</span></span>
      </label>
      <div><label className={LABEL}>// description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>cancel</button>
      </div>
    </form>
  );
}

function EducationTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await educationApi.getAll(); setItems(res.data.data ?? []); }
    catch { toast.error('Failed to load education'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader comment="manage education" count={items.length} onAdd={() => setModal('add')} addLabel="new_edu()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <ItemCard
              key={item._id}
              lineNum={i + 1}
              primary={item.degree}
              secondary={item.institution}
              tertiary={`${item.startDate ? new Date(item.startDate).getFullYear() : ''} → ${item.current ? 'present' : (item.endDate ? new Date(item.endDate).getFullYear() : '')}`}
              onEdit={() => setModal(item)}
              onDelete={async () => {
                if (!confirm('Delete this education entry?')) return;
                await educationApi.remove(item._id); toast.success('Deleted'); load();
              }}
            />
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_edu()' : `edit("${modal.institution}")`} onClose={() => setModal(null)}>
          <EducationForm initial={modal !== 'add' ? modal : null} onSave={async (data) => {
            if (modal === 'add') await educationApi.create(data);
            else await educationApi.update(modal._id, data);
            toast.success('Saved'); setModal(null); load();
          }} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Experience Tab ───────────────────────────────────────────────────────────

function ExperienceForm({ initial, onSave, onCancel }) {
  const blank = { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: '', order: 0 };
  const [form, setForm] = useState(initial ? { ...initial, startDate: initial.startDate?.split('T')[0] || '', endDate: initial.endDate?.split('T')[0] || '', achievements: initial.achievements?.join(', ') || '' } : blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, achievements: form.achievements.split(',').map(a => a.trim()).filter(Boolean) });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className={LABEL}>// company</label><input required value={form.company} onChange={e => set('company', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// position</label><input required value={form.position} onChange={e => set('position', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// location</label><input value={form.location} onChange={e => set('location', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>// startDate</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>// endDate</label><input type="date" value={form.endDate} disabled={form.current} onChange={e => set('endDate', e.target.value)} className={INPUT} /></div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500" />
        <span className="font-mono text-xs text-slate-400">current: <span className="text-yellow-400">true</span></span>
      </label>
      <div><label className={LABEL}>// description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={INPUT} /></div>
      <div><label className={LABEL}>// achievements (comma-separated)</label><textarea rows={2} value={form.achievements} onChange={e => set('achievements', e.target.value)} className={INPUT} placeholder="Built X, Improved Y by Z%..." /></div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY + ' flex-1'}>{saving ? <Spinner /> : <Save size={12} />}{saving ? 'saving...' : '> save()'}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>cancel</button>
      </div>
    </form>
  );
}

function ExperienceTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await experienceApi.getAll(); setItems(res.data.data ?? []); }
    catch { toast.error('Failed to load experience'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader comment="manage experience" count={items.length} onAdd={() => setModal('add')} addLabel="new_exp()" />
      {loading ? <SkeletonRows /> : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <ItemCard
              key={item._id}
              lineNum={i + 1}
              primary={item.position}
              secondary={`${item.company}${item.location ? ' · ' + item.location : ''}`}
              tertiary={`${item.startDate ? new Date(item.startDate).getFullYear() : ''} → ${item.current ? 'present' : (item.endDate ? new Date(item.endDate).getFullYear() : '')}`}
              onEdit={() => setModal(item)}
              onDelete={async () => {
                if (!confirm('Delete this experience?')) return;
                await experienceApi.remove(item._id); toast.success('Deleted'); load();
              }}
            />
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'new_exp()' : `edit("${modal.position}")`} onClose={() => setModal(null)}>
          <ExperienceForm initial={modal !== 'add' ? modal : null} onSave={async (data) => {
            if (modal === 'add') await experienceApi.create(data);
            else await experienceApi.update(modal._id, data);
            toast.success('Saved'); setModal(null); load();
          }} onCancel={() => setModal(null)} />
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

  useEffect(() => {
    profileApi.get()
      .then(res => setForm(res.data.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await profileApi.update(form); toast.success('Profile saved'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="space-y-3">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: C.card }} />)}</div>;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <p className="font-mono text-[11px] text-slate-600 mb-4">// profile settings</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>// name</label><input value={form.name ?? ''} onChange={e => set('name', e.target.value)} className={INPUT} /></div>
          <div><label className={LABEL}>// title</label><input value={form.title ?? ''} onChange={e => set('title', e.target.value)} className={INPUT} /></div>
        </div>
      </div>
      <div><label className={LABEL}>// bio</label><textarea rows={5} value={form.bio ?? ''} onChange={e => set('bio', e.target.value)} className={INPUT} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>// location</label><input value={form.location ?? ''} onChange={e => set('location', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>// email</label><input type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} className={INPUT} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LABEL}>// availability</label><input value={form.availability ?? ''} onChange={e => set('availability', e.target.value)} className={INPUT} /></div>
        <div><label className={LABEL}>// yearsOfExperience</label><input type="number" value={form.yearsOfExperience ?? 0} onChange={e => set('yearsOfExperience', Number(e.target.value))} className={INPUT} /></div>
      </div>
      <div>
        <p className="font-mono text-[11px] text-slate-600 mb-3">// socialLinks</p>
        <div className="space-y-2">
          {['github', 'linkedin', 'twitter'].map(key => (
            <div key={key} className="flex items-center gap-2">
              <span className="font-mono text-xs text-green-400 w-16 shrink-0">{key}:</span>
              <input type="url" value={form.socialLinks?.[key] ?? ''} onChange={e => setSocial(key, e.target.value)} className={INPUT} placeholder={`https://${key}.com/...`} />
            </div>
          ))}
        </div>
      </div>
      <button type="submit" disabled={saving} className={BTN_PRIMARY}>
        {saving ? <Spinner /> : <Save size={12} />}
        {saving ? 'saving...' : '> profile.save()'}
      </button>
    </form>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'projects',     label: 'projects.js',     Icon: Layers   },
  { id: 'certificates', label: 'certificates.js',  Icon: Award    },
  { id: 'skills',       label: 'skills.js',        Icon: Code     },
  { id: 'education',    label: 'education.js',     Icon: BookOpen },
  { id: 'experience',   label: 'experience.js',    Icon: Briefcase },
  { id: 'profile',      label: 'profile.js',       Icon: User     },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('projects');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Session ended');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.page }}>

      {/* VS Code title bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 shrink-0"
        style={{ background: C.titlebar, borderBottom: `1px solid ${C.border}` }}
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
            <span className="text-slate-300">AdminDashboard.jsx</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="font-mono text-[11px] text-slate-500 hover:text-blue-400 transition-colors hidden sm:block"
          >
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

      {/* VS Code file tab bar */}
      <div
        className="flex items-end overflow-x-auto shrink-0 scrollbar-none"
        style={{ background: C.tabbar, borderBottom: `1px solid ${C.border}` }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 px-4 py-2 font-mono text-[11px] transition-colors shrink-0 relative"
              style={{
                background: active ? C.editor : 'transparent',
                color: active ? '#e2e8f0' : '#6b7280',
                borderRight: `1px solid ${C.border}`,
                borderTop: active ? '2px solid #3b82f6' : '2px solid transparent',
              }}
            >
              <Icon size={11} className={active ? 'text-blue-400' : 'text-slate-600'} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Editor content area */}
      <div className="flex-1 overflow-auto" style={{ background: C.editor }}>
        <div className="max-w-4xl mx-auto px-6 py-8 pb-16">

          {/* File header comment */}
          <div className="mb-8">
            <p className="font-mono text-[11px] text-slate-600">
              {'/**'}
            </p>
            <p className="font-mono text-[11px] text-slate-600">
              {' * @file '}{TABS.find(t => t.id === tab)?.label}
            </p>
            <p className="font-mono text-[11px] text-slate-600">
              {' * @author Samuel AKINGENEYE'}
            </p>
            <p className="font-mono text-[11px] text-slate-600">
              {' */'}
            </p>
          </div>

          {tab === 'projects'     && <ProjectsTab />}
          {tab === 'certificates' && <CertificatesTab />}
          {tab === 'skills'       && <SkillsTab />}
          {tab === 'education'    && <EducationTab />}
          {tab === 'experience'   && <ExperienceTab />}
          {tab === 'profile'      && <ProfileTab />}
        </div>
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
          <span>{TABS.find(t => t.id === tab)?.label}</span>
          <span>JavaScript</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
