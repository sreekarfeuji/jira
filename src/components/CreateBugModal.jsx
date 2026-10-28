import React, { useState } from 'react';
import { X, Bug, PlusCircle, AlertCircle } from 'lucide-react';

const TEAM = [
  { name: 'Sarah Jenkins',  role: 'QA Automation Engineer',    initials: 'SJ', avatarBg: '#ef4444' },
  { name: 'Alex Rivera',    role: 'Security & QA Specialist',  initials: 'AR', avatarBg: '#8b5cf6' },
  { name: 'Elena Rostova',  role: 'QA Analyst',                initials: 'ER', avatarBg: '#f59e0b' },
  { name: 'David Kim',      role: 'Principal QA Lead',         initials: 'DK', avatarBg: '#10b981' },
  { name: 'Marcus Vance',   role: 'Frontend Engineer',         initials: 'MV', avatarBg: '#3b82f6' },
];

export default function CreateBugModal({ isOpen, onClose, onCreateBug }) {
  const [title, setTitle]       = useState('');
  const [description, setDesc]  = useState('');
  const [priority, setPriority] = useState('High');
  const [env, setEnv]           = useState('Staging');
  const [assigneeIdx, setIdx]   = useState(0);
  const [status, setStatus]     = useState('qa');

  if (!isOpen) return null;

  const reset = () => {
    setTitle(''); setDesc(''); setPriority('High'); setStatus('qa');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateBug({
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      priority,
      environment: env,
      status,
      assignee: TEAM[assigneeIdx],
      reporter: { name: 'QA Lead', avatarBg: '#6366f1', initials: 'QL' },
      createdDate: 'Just now',
      qaNotes: [],
    });
    reset();
    onClose();
  };

  const priorities = [
    { value: 'Critical', dot: '#ef4444' },
    { value: 'High',     dot: '#f97316' },
    { value: 'Medium',   dot: '#eab308' },
    { value: 'Low',      dot: '#22c55e' },
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-hd">
          <div className="modal-hd-left">
            <div className="modal-icon"><Bug size={16} /></div>
            <div>
              <div className="modal-title">Create Bug Ticket</div>
              <div className="modal-sub">New QA issue · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="field">
            <label className="field-label">Summary <span className="req">*</span></label>
            <input
              autoFocus
              className="field-input"
              placeholder="e.g. Payment button unresponsive on iOS Safari"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Row: priority + status + env */}
          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Priority</label>
              <div className="seg-group">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`seg-btn${priority === p.value ? ' seg-active' : ''}`}
                    onClick={() => setPriority(p.value)}
                  >
                    <span className="seg-dot" style={{ background: p.dot }} />
                    {p.value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Status Column</label>
              <select className="field-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="qa">QA — Under Testing</option>
                <option value="done">Done — QA Passed</option>
                <option value="approved">Approved — Production Ready</option>
              </select>
            </div>

            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Environment</label>
              <select className="field-select" value={env} onChange={(e) => setEnv(e.target.value)}>
                <option value="Staging">Staging</option>
                <option value="QA-Testbed">QA-Testbed</option>
                <option value="Production">Production</option>
                <option value="Development">Development</option>
              </select>
            </div>

            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Assignee</label>
              <select className="field-select" value={assigneeIdx} onChange={(e) => setIdx(Number(e.target.value))}>
                {TEAM.map((m, i) => (
                  <option key={m.name} value={i}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="field">
            <label className="field-label">Description</label>
            <textarea
              rows={4}
              className="field-textarea"
              placeholder="Describe the bug, expected vs actual behaviour, error codes, etc."
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <PlusCircle size={15} /> Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
