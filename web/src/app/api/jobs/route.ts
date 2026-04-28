import { NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';

export async function GET() {
  try {
    // Attempt to run `ps` to find some Python/AI jobs, or use `squeue` if SLURM is used.
    // For now, we will simulate fetching real process list with `ps aux` and filtering.
    // In a real environment, you might parse `squeue -o "%i %j %u %t %M"`
    
    // As a fallback demo, we'll run `ps -eo pid,comm,user,pcpu,etime --sort=-pcpu | head -n 6`
    const psResult = await executeCommand(`ps -eo pid,comm,user,pcpu,etime --sort=-pcpu | grep -v PID | head -n 5`);
    
    if (!psResult.stdout) {
       return NextResponse.json([]);
    }

    const lines = psResult.stdout.trim().split('\n');
    const jobs = lines.map((line, index) => {
      // Split by whitespace
      const parts = line.trim().split(/\s+/);
      const pid = parts[0] || `job-${index}`;
      const name = parts[1] || "Unknown";
      const user = parts[2] || "admin";
      const pcpu = parseFloat(parts[3]) || 0;
      const etime = parts[4] || "00:00";

      return {
        id: `PID-${pid}`,
        name: name,
        user: user,
        status: pcpu > 0 ? "running" : "queued",
        progress: Math.min(100, Math.round(pcpu)), // Using CPU usage as a mock progress
        timeRemaining: etime, // Using elapsed time as a mock
      };
    });

    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error("Jobs API Error:", error);
    // Fallback if SSH fails
    return NextResponse.json([]);
  }
}
