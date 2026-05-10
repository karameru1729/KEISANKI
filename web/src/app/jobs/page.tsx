"use client";

import { useEffect, useState, FormEvent } from "react";
import { Database, Plus, RefreshCw } from "lucide-react";
import { JobQueue } from "@/components/JobQueue";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommand, setNewCommand] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
      fetchJobs(); // refresh immediately
    } catch (e) {
      console.error("Failed to delete job:", e);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCommand.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: newCommand }),
      });
      setNewCommand("");
      setIsModalOpen(false);
      fetchJobs();
    } catch (e) {
      console.error("Failed to submit job:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full">
      <header className="flex justify-between items-end pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Job Management</h1>
          </div>
          <p className="text-slate-400 mt-2">Monitor and control execution of computing tasks.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchJobs}
            className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-white/5"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus className="w-4 h-4" />
            Submit Job
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-[var(--color-primary)] font-medium">Loading jobs...</div>
        </div>
      ) : (
        <div className="max-w-6xl">
          <JobQueue jobs={jobs} onDelete={handleDelete} />
        </div>
      )}

      {/* New Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl animate-in zoom-in-95 duration-200 border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Submit New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Command / Script Path</label>
                <input 
                  type="text" 
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="e.g. python train.py --epochs 100"
                  autoFocus
                />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end border-t border-white/5 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !newCommand.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
