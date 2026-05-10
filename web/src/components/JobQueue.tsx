import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PlayCircle, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Job {
  id: string;
  name: string;
  user: string;
  status: "running" | "queued" | "completed" | "failed";
  progress: number;
  timeRemaining: string;
}

export function JobQueue({ jobs, onDelete }: { jobs: Job[], onDelete?: (id: string) => void }) {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Job Queue</h2>
        <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-medium px-2.5 py-1 rounded-full">
          {jobs.length} total
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-white/5">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">ID / Name</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Time Left</th>
              <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-white">
                  <div className="flex flex-col">
                    <span>{job.name}</span>
                    <span className="text-xs text-slate-500">{job.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{job.user}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {job.status === "running" && <PlayCircle className="w-4 h-4 text-[var(--color-primary)]" />}
                    {job.status === "queued" && <Clock className="w-4 h-4 text-[var(--color-warning)]" />}
                    {job.status === "completed" && <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />}
                    {job.status === "failed" && <XCircle className="w-4 h-4 text-[var(--color-danger)]" />}
                    <span className="capitalize">{job.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-1.5">
                      <div 
                        className={cn(
                          "h-1.5 rounded-full",
                          job.status === "running" && "bg-[var(--color-primary)]",
                          job.status === "completed" && "bg-[var(--color-success)]",
                          job.status === "failed" && "bg-[var(--color-danger)]",
                          job.status === "queued" && "bg-[var(--color-warning)]"
                        )} 
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{job.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400">{job.timeRemaining}</td>
                <td className="px-4 py-3 text-right">
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(job.id)}
                      className="p-1.5 text-slate-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded transition-colors"
                      title={job.status === "running" || job.status === "queued" ? "Stop Job" : "Delete Job"}
                    >
                      {job.status === "running" || job.status === "queued" ? <XCircle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
