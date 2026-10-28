import React, { useState } from 'react';
import { Bug, CheckCircle2, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import BugCard from './BugCard';
import { STAGES } from '../data/initialBugs';

const COL_META = {
  qa:       { label: 'QA', subtitle: 'Under Testing', iconColor: '#3b82f6', headerBg: '#eff6ff', borderColor: '#bfdbfe', dotBg: '#3b82f6' },
  done:     { label: 'Done', subtitle: 'QA Passed', iconColor: '#8b5cf6', headerBg: '#f5f3ff', borderColor: '#ddd6fe', dotBg: '#8b5cf6' },
  approved: { label: 'Approved', subtitle: 'Signed Off', iconColor: '#10b981', headerBg: '#ecfdf5', borderColor: '#a7f3d0', dotBg: '#10b981' },
};

function ColIcon({ id, size = 16 }) {
  if (id === 'qa')       return <Bug size={size} />;
  if (id === 'done')     return <CheckCircle2 size={size} />;
  if (id === 'approved') return <ShieldCheck size={size} />;
  return null;
}

export default function ThreeColumnsView({ bugs, onStatusChange, onCardClick, onDeleteBug, onOpenCreateModal }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== id) setDragOverCol(id);
  };

  const handleDrop = (e, id) => {
    e.preventDefault();
    setDragOverCol(null);
    try {
      const { bugId } = JSON.parse(e.dataTransfer.getData('application/json'));
      if (bugId) onStatusChange(bugId, id);
    } catch {}
  };

  return (
    <div className="board">
      {STAGES.map((stage) => {
        const meta    = COL_META[stage.id];
        const colBugs = bugs.filter(b => b.status === stage.id);
        const isOver  = dragOverCol === stage.id;

        return (
          <div
            key={stage.id}
            className={`col${isOver ? ' col-over' : ''}`}
            style={{ '--col-accent': meta.iconColor, '--col-border': meta.borderColor }}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCol(null);
            }}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column header */}
            <div className="col-header" style={{ background: meta.headerBg }}>
              <div className="col-header-left">
                <div className="col-icon-wrap" style={{ color: meta.iconColor }}>
                  <ColIcon id={stage.id} />
                </div>
                <div className="col-title-block">
                  <span className="col-title">{meta.label}</span>
                  <span className="col-subtitle">{meta.subtitle}</span>
                </div>
                <span
                  className="col-count"
                  style={{ background: meta.headerBg, color: meta.iconColor, border: `1.5px solid ${meta.borderColor}` }}
                >
                  {colBugs.length}
                </span>
              </div>
              {stage.id === 'qa' && (
                <button className="col-add" onClick={onOpenCreateModal} title="Add bug">
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Cards */}
            <div className="col-body">
              {colBugs.length === 0 ? (
                <div className="col-empty">
                  <span className="col-empty-icon" style={{ color: meta.iconColor }}>
                    <ColIcon id={stage.id} size={24} />
                  </span>
                  <span>Drop cards here</span>
                </div>
              ) : (
                colBugs.map((bug) => (
                  <BugCard
                    key={bug.id}
                    bug={bug}
                    onStatusChange={onStatusChange}
                    onClick={onCardClick}
                    onDelete={onDeleteBug}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
