import { Activity, Server, Database, Settings, LayoutDashboard, TerminalSquare } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 glass-panel border-r border-white/10 h-screen sticky top-0 flex flex-col p-4 z-10">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <Activity className="text-[var(--color-primary)] w-8 h-8" />
        <h1 className="text-xl font-bold tracking-wider text-white">KEISANKI</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)] transition-colors">
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href="/nodes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-slate-300 transition-colors">
          <Server size={20} />
          <span className="font-medium">Nodes</span>
        </Link>
        <Link href="/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-slate-300 transition-colors">
          <Database size={20} />
          <span className="font-medium">Jobs</span>
        </Link>
        <Link href="/terminal" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-slate-300 transition-colors">
          <TerminalSquare size={20} />
          <span className="font-medium">Terminal</span>
        </Link>
      </nav>
      
      <div className="mt-auto">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-slate-300 transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
