import { TerminalEmulator } from "@/components/TerminalEmulator";
import { TerminalSquare } from "lucide-react";

export default function TerminalPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <TerminalSquare className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Terminal Access</h1>
          </div>
          <p className="text-slate-400 mt-2">Direct shell access to cluster nodes. Currently connected to <span className="text-[var(--color-primary)] font-mono">node-01</span>.</p>
        </div>
      </header>

      <div className="max-w-5xl">
        <TerminalEmulator />
      </div>
    </div>
  );
}
