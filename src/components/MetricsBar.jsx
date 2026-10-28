import React from 'react';
import { Bug, CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';

export default function MetricsBar({ bugs }) {
  const total      = bugs.length;
  const qaCount    = bugs.filter(b => b.status === 'qa').length;
  const doneCount  = bugs.filter(b => b.status === 'done').length;
  const approvedCount = bugs.filter(b => b.status === 'approved').length;
  const approvalPct   = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
  const donePct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const stats = [
    {
      icon: <Bug size={18} />,
      label: 'In QA',
      value: qaCount,
      sub: 'active issues',
      accent: '#3b82f6',
      bg: '#eff6ff',
      border: '#bfdbfe',
    },
    {
      icon: <CheckCircle2 size={18} />,
      label: 'Done',
      value: doneCount,
      sub: 'passed QA',
      accent: '#8b5cf6',
      bg: '#f5f3ff',
      border: '#ddd6fe',
    },
    {
      icon: <ShieldCheck size={18} />,
      label: 'Approved',
      value: approvedCount,
      sub: 'signed off',
      accent: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0',
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Progress',
      value: `${approvalPct}%`,
      sub: `${total} total tracked`,
      accent: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
      isProgress: true,
      donePct,
      approvalPct,
    },
  ];

  return (
    <div className="metrics-row">
      {stats.map((s) => (
        <div
          key={s.label}
          className="metric-chip"
          style={{ '--accent': s.accent, '--bg': s.bg, '--border': s.border }}
        >
          <div className="mc-icon" style={{ color: s.accent, background: s.bg }}>
            {s.icon}
          </div>
          <div className="mc-body">
            <div className="mc-top">
              <span className="mc-value">{s.value}</span>
              <span className="mc-label">{s.label}</span>
            </div>
            <span className="mc-sub">{s.sub}</span>
            {s.isProgress && (
              <div className="mc-bar-track">
                <div
                  className="mc-bar-seg seg-approved"
                  style={{ width: `${s.approvalPct}%` }}
                />
                <div
                  className="mc-bar-seg seg-done"
                  style={{ width: `${s.donePct}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
