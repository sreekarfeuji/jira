import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsBar from './components/MetricsBar';
import ThreeColumnsView from './components/ThreeColumnsView';
import CreateBugModal from './components/CreateBugModal';
import BugDetailModal from './components/BugDetailModal';
import { INITIAL_BUGS } from './data/initialBugs';
import { triggerApprovalConfetti } from './utils/confetti';
import { CheckCircle2 } from 'lucide-react';
import './App.css';

const LS_KEY = 'jira_qa_v3';

export default function App() {
  const [bugs, setBugs] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BUGS;
  });

  const [searchQuery,     setSearchQuery]     = useState('');
  const [priorityFilter,  setPriorityFilter]  = useState('All');
  const [createOpen,      setCreateOpen]      = useState(false);
  const [selectedBug,     setSelectedBug]     = useState(null);
  const [toast,           setToast]           = useState(null);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(bugs)); } catch {}
  }, [bugs]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleStatusChange = (bugId, newStatus) => {
    setBugs((prev) => {
      const bug = prev.find((b) => b.id === bugId);
      if (!bug || bug.status === newStatus) return prev;
      if (newStatus === 'approved') {
        triggerApprovalConfetti();
        setToast(`🎉 ${bugId} approved and signed off!`);
      } else {
        setToast(`${bugId} moved to ${newStatus === 'done' ? 'Done' : 'QA'}`);
      }
      const updated = prev.map((b) => b.id === bugId ? { ...b, status: newStatus } : b);
      if (selectedBug?.id === bugId) setSelectedBug({ ...selectedBug, status: newStatus });
      return updated;
    });
  };

  const handleCreateBug = (data) => {
    const max = bugs.reduce((m, b) => {
      const n = parseInt((b.id.match(/BUG-(\d+)/) || [])[1], 10);
      return n > m ? n : m;
    }, 100);
    const newBug = { ...data, id: `BUG-${max + 1}` };
    setBugs((prev) => [newBug, ...prev]);
    setToast(`Created ${newBug.id}`);
  };

  const handleDeleteBug = (bugId) => {
    setBugs((prev) => prev.filter((b) => b.id !== bugId));
    if (selectedBug?.id === bugId) setSelectedBug(null);
    setToast(`Deleted ${bugId}`);
  };

  const handleAddQaNote = (bugId, noteObj) => {
    setBugs((prev) => {
      const updated = prev.map((b) =>
        b.id === bugId
          ? { ...b, qaNotes: [noteObj, ...(b.qaNotes || [])] }
          : b
      );
      if (selectedBug?.id === bugId) {
        setSelectedBug({ ...selectedBug, qaNotes: [noteObj, ...(selectedBug.qaNotes || [])] });
      }
      return updated;
    });
  };

  const filteredBugs = bugs.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch  = !q || b.id.toLowerCase().includes(q) || b.title.toLowerCase().includes(q);
    const matchPriority = priorityFilter === 'All' || b.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchSearch && matchPriority;
  });

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onOpenCreateModal={() => setCreateOpen(true)}
      />

      <main className="app-main">
        <MetricsBar bugs={bugs} />
        <ThreeColumnsView
          bugs={filteredBugs}
          onStatusChange={handleStatusChange}
          onCardClick={setSelectedBug}
          onDeleteBug={handleDeleteBug}
          onOpenCreateModal={() => setCreateOpen(true)}
        />
      </main>

      <CreateBugModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreateBug={handleCreateBug}
      />

      <BugDetailModal
        bug={selectedBug}
        isOpen={!!selectedBug}
        onClose={() => setSelectedBug(null)}
        onStatusChange={handleStatusChange}
        onAddQaNote={handleAddQaNote}
        onDeleteBug={handleDeleteBug}
      />

      {toast && (
        <div className="toast">
          <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
