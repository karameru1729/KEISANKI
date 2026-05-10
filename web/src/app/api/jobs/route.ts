import { NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';

// In-memory mock store for demo interactivity
let mockJobs = [
  { id: 'PID-10234', name: 'train_resnet50.py', user: 'admin', status: 'running', progress: 45, timeRemaining: '02:30' },
  { id: 'PID-10235', name: 'data_prep.sh', user: 'admin', status: 'completed', progress: 100, timeRemaining: '00:00' },
  { id: 'PID-10236', name: 'evaluate_model.py', user: 'admin', status: 'queued', progress: 0, timeRemaining: '--:--' },
];

export async function GET() {
  try {
    // Attempt to run `ps` to find some Python/AI jobs
    const psResult = await executeCommand(`ps -eo pid,comm,user,pcpu,etime --sort=-pcpu | grep -v PID | head -n 5`);
    
    if (psResult && psResult.stdout) {
      const lines = psResult.stdout.trim().split('\n');
      const sshJobs = lines.map((line: string, index: number) => {
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
          progress: Math.min(100, Math.round(pcpu)),
          timeRemaining: etime,
        };
      });
      // Combine SSH jobs with mock jobs (avoiding duplicate IDs)
      return NextResponse.json([...sshJobs, ...mockJobs]);
    }
  } catch (error: any) {
    console.error("Jobs API Error:", error);
  }
  
  // Fallback to mock data if SSH fails
  return NextResponse.json(mockJobs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newJob = {
      id: `PID-${Math.floor(Math.random() * 10000) + 20000}`,
      name: body.command || 'unknown_task',
      user: 'admin',
      status: 'queued',
      progress: 0,
      timeRemaining: '--:--',
    };
    mockJobs.unshift(newJob);
    return NextResponse.json(newJob);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    mockJobs = mockJobs.filter(j => j.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
