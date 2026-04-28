import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  progress?: number;
  status?: "normal" | "warning" | "danger";
  className?: string;
}

export function MetricCard({ title, value, unit, icon, progress, status = "normal", className }: MetricCardProps) {
  return (
    <div className={cn("glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden group", className)}>
      {/* Decorative gradient orb */}
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40",
        status === "normal" && "bg-[var(--color-primary)]",
        status === "warning" && "bg-[var(--color-warning)]",
        status === "danger" && "bg-[var(--color-danger)]"
      )} />
      
      <div className="flex justify-between items-start mb-4 z-10">
        <h3 className="text-slate-400 font-medium text-sm tracking-wide">{title}</h3>
        {icon && <div className="text-slate-500">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1 mb-4 z-10">
        <span className="text-3xl font-semibold tracking-tight text-white">{value}</span>
        {unit && <span className="text-slate-400 text-sm">{unit}</span>}
      </div>
      
      {progress !== undefined && (
        <div className="mt-auto w-full bg-slate-800 rounded-full h-1.5 overflow-hidden z-10">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              status === "normal" && "bg-[var(--color-primary)]",
              status === "warning" && "bg-[var(--color-warning)]",
              status === "danger" && "bg-[var(--color-danger)]"
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
