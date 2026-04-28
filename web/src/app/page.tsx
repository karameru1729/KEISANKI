"use client";

import { useEffect, useState } from "react";
import { Cpu, HardDrive, MemoryStick, ActivitySquare, Server, AlertTriangle } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { JobQueue } from "@/components/JobQueue";

export default function Dashboard() {
  const [status, setStatus] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStatus, resJobs] = await Promise.all([
          fetch("/api/status").then(r => r.json()),
          fetch("/api/jobs").then(r => r.json())
        ]);
        setStatus(resStatus);
        setJobs(resJobs);
      } catch (e) {
        console.error("Failed to fetch data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-[var(--color-primary)] font-medium">Initializing Connection...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cluster Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time status of physical calculation nodes.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-success)]"></span>
          </span>
          Uptime: {status.uptime}
        </div>
      </header>

      {/* Main Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU Usage"
          value={`${status.cpu.usage}`}
          unit="%"
          icon={<Cpu />}
          progress={status.cpu.usage}
          status={status.cpu.usage > 85 ? "danger" : status.cpu.usage > 60 ? "warning" : "normal"}
        />
        
        <MetricCard
          title="Memory Usage"
          value={`${status.memory.used}`}
          unit={`/ ${status.memory.total} GB`}
          icon={<MemoryStick />}
          progress={(status.memory.used / status.memory.total) * 100}
          status={(status.memory.used / status.memory.total) * 100 > 90 ? "danger" : "normal"}
        />
        
        <MetricCard
          title="GPU Usage"
          value={`${status.gpu.usage}`}
          unit="%"
          icon={<ActivitySquare />}
          progress={status.gpu.usage}
          status={status.gpu.usage > 90 ? "warning" : "normal"}
        />
        
        <MetricCard
          title="CPU Temp"
          value={`${status.cpu.temperature}`}
          unit="°C"
          icon={<Server />}
          progress={(status.cpu.temperature / 100) * 100}
          status={status.cpu.temperature > 85 ? "danger" : status.cpu.temperature > 75 ? "warning" : "normal"}
        />
      </section>

      {/* Alerts & Warnings Area */}
      {(status.cpu.temperature > 85 || status.memory.used / status.memory.total > 0.95) && (
        <div className="bg-[var(--color-danger)]/20 border border-[var(--color-danger)]/50 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-[var(--color-danger)] w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[var(--color-danger)] font-semibold">System Alert</h4>
            <p className="text-slate-300 text-sm mt-1">Resource utilization is critically high. Some queued jobs might be delayed to prevent system failure.</p>
          </div>
        </div>
      )}

      {/* Job Queue */}
      <section>
        <JobQueue jobs={jobs} />
      </section>
    </div>
  );
}
