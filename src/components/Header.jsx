import React from 'react';
import { Plus, Search, Bug, ChevronDown } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  onOpenCreateModal,
}) {
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const priorityDots = {
    Critical: '#ef4444',
    High:     '#f97316',
    Medium:   '#eab308',
    Low:      '#22c55e',
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand">
          <div className="brand-logo">
            <Bug size={16} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-name">BugTrack QA</span>
            <span className="brand-project">Core Banking · Sprint 42</span>
          </div>
        </div>

        {/* Search */}
        <div className="header-search">
          <Search size={14} className="search-ico" />
          <input
            type="text"
            placeholder="Search by ID or title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Right side */}
        <div className="header-right">
          {/* Priority filter */}
          <div className="priority-filter">
            {priorities.map((p) => (
              <button
                key={p}
                className={`pf-pill${priorityFilter === p ? ' pf-active' : ''}`}
                onClick={() => setPriorityFilter(p)}
                style={priorityFilter === p && p !== 'All' ? { '--dot': priorityDots[p] } : {}}
              >
                {p !== 'All' && (
                  <span
                    className="pf-dot"
                    style={{ background: priorityDots[p] }}
                  />
                )}
                {p}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button className="btn-create" onClick={onOpenCreateModal}>
            <Plus size={15} strokeWidth={2.5} />
            <span>New Bug</span>
          </button>
        </div>
      </div>
    </header>
  );
}
