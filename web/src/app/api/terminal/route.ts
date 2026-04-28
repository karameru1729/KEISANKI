import { NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    
    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    // Connect to server and run command
    const result = await executeCommand(command);
    
    return NextResponse.json({
      output: result.stdout || result.stderr || '',
      code: result.code,
      isError: !!result.stderr && result.code !== 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
