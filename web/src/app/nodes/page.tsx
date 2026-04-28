import { Server, Activity, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nodes = [
  { id: "node-01", ip: "192.168.1.10", status: "online", cpu: 89, mem: 64, gpu: "A100", uptime: "14d 3h" },
  { id: "node-02", ip: "192.168.1.11", status: "online", cpu: 45, mem: 32, gpu: "V100", uptime: "14d 3h" },
  { id: "node-03", ip: "192.168.1.12", status: "offline", cpu: 0, mem: 0, gpu: "A100", uptime: "0d 0h" },
  { id: "node-04", ip: "192.168.1.13", status: "online", cpu: 95, mem: 90, gpu: "A100", uptime: "12d 1h" },
];

export default function NodesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Cluster Nodes</h1>
          </div>
          <p className="text-slate-400 mt-2">Manage and monitor physical compute nodes.</p>
        </div>
        <div className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-4 py-2 rounded-lg font-medium text-sm">
          {nodes.filter(n => n.status === "online").length} / {nodes.length} Nodes Online
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {nodes.map(node => (
          <div key={node.id} className="glass-panel rounded-xl p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  node.status === "online" ? "bg-[var(--color-success)]/20 text-[var(--color-success)]" : "bg-slate-800 text-slate-500"
                )}>
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{node.id}</h3>
                  <p className="text-xs text-slate-400 font-mono">{node.ip}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {node.status === "online" ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <XCircle className="w-4 h-4 text-[var(--color-danger)]" />
                )}
                <span className={cn(
                  "text-sm font-medium capitalize",
                  node.status === "online" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                )}>{node.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">CPU Load</p>
                <div className="flex items-center gap-2">
                  <Activity className={cn("w-4 h-4", node.cpu > 80 ? "text-[var(--color-danger)]" : "text-[var(--color-primary)]")} />
                  <span className="text-lg font-medium text-white">{node.cpu}%</span>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Memory</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-white">{node.mem}%</span>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">GPU Type</p>
                <span className="text-sm font-medium text-slate-300">{node.gpu}</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Uptime</p>
                <span className="text-sm font-medium text-slate-300">{node.uptime}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
              <Link 
                href="/terminal" 
                className={cn(
                  "flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors border",
                  node.status === "online" 
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/20" 
                    : "bg-slate-800 text-slate-500 border-slate-700 pointer-events-none"
                )}
              >
                Connect SSH
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
