import React, { useState } from 'react';
import {
  X, Bug, AlertCircle, Clock, ShieldCheck, CheckCircle2,
  Trash2, Send, Server, FileText
} from 'lucide-react';
import { PRIORITIES, STAGES } from '../data/initialBugs';

const PRIORITY_CONFIG = {
  Critical: { color: '#ef4444', bg: '#fef2f2' },
  High:     { color: '#f97316', bg: '#fff7ed' },
  Medium:   { color: '#d97706', bg: '#fffbeb' },
  Low:      { color: '#16a34a', bg: '#f0fdf4' },
};

const STATUS_CONFIG = {
  qa:       { label: 'QA',       icon: <Bug size={12} />,          bg: '#eff6ff', color: '#3b82f6' },
  done:     { label: 'Done',     icon: <CheckCircle2 size={12} />, bg: '#f5f3ff', color: '#8b5cf6' },
  approved: { label: 'Approved', icon: <ShieldCheck size={12} />,  bg: '#ecfdf5', color: '#10b981' },
};

export default function BugDetailModal({ bug, isOpen, onClose, onStatusChange, onAddQaNote, onDeleteBug }) {
  const [note, setNote] = useState('');
  if (!isOpen || !bug) return null;

  const pc = PRIORITY_CONFIG[bug.priority] || PRIORITY_CONFIG.Medium;
  const sc = STATUS_CONFIG[bug.status]     || STATUS_CONFIG.qa;

  const handleNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    onAddQaNote(bug.id, { author: 'QA Tester', note: note.trim(), timestamp: 'Just now' });
    setNote('');
  };

  const statusButtons = [
    { id: 'qa',       label: 'QA',       icon: <Bug size={13} /> },
    { id: 'done',     label: 'Done',     icon: <CheckCircle2 size={13} /> },
    { id: 'approved', label: 'Approved', icon: <ShieldCheck size={13} /> },
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-detail" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-hd">
          <div className="modal-hd-left">
            <span className="detail-id">{bug.id}</span>
            <span
              className="detail-status-badge"
              style={{ background: sc.bg, color: sc.color }}
            >
              {sc.icon} {sc.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="detail-del-btn"
              title="Delete"
              onClick={() => {
                if (window.confirm(`Delete ${bug.id}?`)) { onDeleteBug(bug.id); onClose(); }
              }}
            >
              <Trash2 size={15} />
            </button>
            <button className="modal-close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* Two-column body */}
        <div className="detail-body">
          {/* Left */}
          <div className="detail-left">
            <h2 className="detail-title">{bug.title}</h2>

            <div className="detail-sec">
              <div className="detail-sec-hd"><FileText size={14} /> Description</div>
              <p className="detail-text">{bug.description}</p>
            </div>

            {/* Notes */}
            <div className="detail-sec">
              <div className="detail-sec-hd">
                <ShieldCheck size={14} />
                QA Notes
                <span className="notes-count">{bug.qaNotes?.length || 0}</span>
              </div>

              <div className="notes-list">
                {!bug.qaNotes?.length ? (
                  <p className="notes-empty">No notes yet — add your first verification note.</p>
                ) : bug.qaNotes.map((n, i) => (
                  <div key={i} className="note-item">
                    <div className="note-hd">
                      <span className="note-author">{n.author}</span>
                      <span className="note-ts">{n.timestamp}</span>
                    </div>
                    <p className="note-text">{n.note}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleNote} className="note-form">
                <input
                  className="note-input"
                  placeholder="Add test result or observation…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
                  <Send size={13} /> Log
                </button>
              </form>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="detail-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-label">Status</div>
              <div className="status-selector">
                {statusButtons.map((s) => (
                  <button
                    key={s.id}
                    className={`status-btn${bug.status === s.id ? ' status-active' : ''} status-${s.id}`}
                    onClick={() => onStatusChange(bug.id, s.id)}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">Priority</div>
              <span className="sidebar-pill" style={{ background: pc.bg, color: pc.color }}>
                <AlertCircle size={12} /> {bug.priority}
              </span>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-label">Environment</div>
              <span className="sidebar-tag">
                <Server size={12} /> {bug.environment || 'Staging'}
              </span>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">Assignee</div>
              <div className="sidebar-user">
                <div className="sidebar-avatar" style={{ background: bug.assignee?.avatarBg || '#64748b' }}>
                  {bug.assignee?.initials || '?'}
                </div>
                <div>
                  <div className="sidebar-uname">{bug.assignee?.name || 'Unassigned'}</div>
                  <div className="sidebar-urole">{bug.assignee?.role || 'QA Engineer'}</div>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-label">Reporter</div>
              <div className="sidebar-user">
                <div className="sidebar-avatar" style={{ background: bug.reporter?.avatarBg || '#64748b' }}>
                  {bug.reporter?.initials || '?'}
                </div>
                <div className="sidebar-uname">{bug.reporter?.name || 'Reporter'}</div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-label">Created</div>
              <div className="sidebar-meta-row">
                <Clock size={12} /> {bug.createdDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
