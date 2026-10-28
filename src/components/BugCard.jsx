import React, { useState } from 'react';
import { AlertTriangle, MoreHorizontal, Trash2, ArrowRight, ArrowLeft, ShieldCheck, MessageSquare } from 'lucide-react';
import { PRIORITIES } from '../data/initialBugs';

const PRIORITY_CONFIG = {
  Critical: { color: '#ef4444', bg: '#fef2f2', dot: '#ef4444' },
  High:     { color: '#f97316', bg: '#fff7ed', dot: '#f97316' },
  Medium:   { color: '#d97706', bg: '#fffbeb', dot: '#eab308' },
  Low:      { color: '#16a34a', bg: '#f0fdf4', dot: '#22c55e' },
};

const ENV_COLORS = {
  Production:  { bg: '#fef2f2', color: '#b91c1c' },
  Staging:     { bg: '#f0f9ff', color: '#0369a1' },
  'QA-Testbed':{ bg: '#faf5ff', color: '#7c3aed' },
  Development: { bg: '#f0fdf4', color: '#15803d' },
};

export default function BugCard({ bug, onStatusChange, onClick, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const p = PRIORITY_CONFIG[bug.priority] || PRIORITY_CONFIG.Medium;
  const env = ENV_COLORS[bug.environment] || { bg: '#f8fafc', color: '#475569' };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify({ bugId: bug.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const stopProp = (e) => e.stopPropagation();

  return (
    <div
      className={`bug-card${isDragging ? ' dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => onClick(bug)}
    >
      {/* Top row */}
      <div className="bc-top">
        <div className="bc-badges">
          <span className="bc-id">{bug.id}</span>
          <span className="bc-priority" style={{ background: p.bg, color: p.color }}>
            <span className="bc-pdot" style={{ background: p.dot }} />
            {bug.priority}
          </span>
          {bug.environment && (
            <span className="bc-env" style={{ background: env.bg, color: env.color }}>
              {bug.environment}
            </span>
          )}
        </div>

        {/* Kebab menu */}
        <div className="bc-menu-wrap" onClick={stopProp}>
          <button
            className="bc-menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div className="bc-dropdown">
              {[
                { id: 'qa',       label: 'Move to QA' },
                { id: 'done',     label: 'Move to Done' },
                { id: 'approved', label: 'Approve ✓' },
              ]
                .filter((s) => s.id !== bug.status)
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { onStatusChange(bug.id, s.id); setMenuOpen(false); }}
                  >
                    {s.label}
                  </button>
                ))}
              <div className="bc-sep" />
              <button
                className="bc-del"
                onClick={() => { onDelete(bug.id); setMenuOpen(false); }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="bc-title">{bug.title}</p>

      {/* Footer */}
      <div className="bc-footer" onClick={stopProp}>
        <div className="bc-footer-left">
          <div
            className="bc-avatar"
            title={bug.assignee?.name}
            style={{ background: bug.assignee?.avatarBg || '#64748b' }}
          >
            {bug.assignee?.initials || '?'}
          </div>
          {bug.qaNotes?.length > 0 && (
            <span className="bc-notes">
              <MessageSquare size={11} />
              {bug.qaNotes.length}
            </span>
          )}
        </div>

        {/* Transition pill */}
        <div className="bc-actions">
          {bug.status === 'qa' && (
            <button
              className="bc-action-btn action-done"
              onClick={() => onStatusChange(bug.id, 'done')}
            >
              Pass QA <ArrowRight size={12} />
            </button>
          )}
          {bug.status === 'done' && (
            <>
              <button
                className="bc-action-btn action-back"
                onClick={() => onStatusChange(bug.id, 'qa')}
              >
                <ArrowLeft size={12} /> QA
              </button>
              <button
                className="bc-action-btn action-approve"
                onClick={() => onStatusChange(bug.id, 'approved')}
              >
                <ShieldCheck size={12} /> Approve
              </button>
            </>
          )}
          {bug.status === 'approved' && (
            <button
              className="bc-action-btn action-back"
              onClick={() => onStatusChange(bug.id, 'qa')}
            >
              <ArrowLeft size={12} /> Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
