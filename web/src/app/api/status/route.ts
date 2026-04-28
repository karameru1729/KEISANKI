import { NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';

export async function GET() {
  try {
    // 1. Get Uptime
    const uptimeResult = await executeCommand('uptime -p');
    const uptime = uptimeResult.stdout.replace('up ', '').trim();

    // 2. Get CPU Usage (using top, getting idle time and subtracting from 100)
    let cpuUsage = 0;
    try {
      const cpuResult = await executeCommand(`top -bn1 | grep "Cpu(s)" | awk '{print $8}'`);
      const cpuIdle = parseFloat(cpuResult.stdout);
      cpuUsage = isNaN(cpuIdle) ? 0 : Math.max(0, Math.round(100 - cpuIdle));
    } catch (e) {}

    // 3. Get Memory Usage (free -m)
    let memoryTotal = 128;
    let memoryUsed = 10;
    try {
      const memResult = await executeCommand(`free -m | grep Mem | awk '{print $2, $3}'`);
      const [memTotalStr, memUsedStr] = memResult.stdout.split(' ');
      memoryTotal = Math.round(parseInt(memTotalStr) / 1024) || memoryTotal;
      memoryUsed = Math.round(parseInt(memUsedStr) / 1024) || memoryUsed;
    } catch (e) {}

    // 4. Get GPU Status (if nvidia-smi exists)
    let gpuUsage = 0;
    let gpuTemp = 0;
    try {
      const gpuResult = await executeCommand(`nvidia-smi --query-gpu=utilization.gpu,temperature.gpu --format=csv,noheader,nounits`);
      const [usageStr, tempStr] = gpuResult.stdout.split(',');
      gpuUsage = parseInt(usageStr) || 0;
      gpuTemp = parseInt(tempStr) || 0;
    } catch (e) {
      console.log("No NVIDIA GPU or nvidia-smi not found.");
    }

    // 5. Get CPU Temp (if sensors exists, fallback to 40)
    let cpuTemp = 40;
    try {
      const tempResult = await executeCommand(`cat /sys/class/thermal/thermal_zone0/temp`);
      const rawTemp = parseInt(tempResult.stdout);
      if (!isNaN(rawTemp)) {
        cpuTemp = Math.round(rawTemp / 1000);
      }
    } catch (e) {}

    const data = {
      cpu: { usage: cpuUsage, temperature: cpuTemp, cores: 32 },
      memory: { total: memoryTotal, used: memoryUsed },
      gpu: { usage: gpuUsage, temperature: gpuTemp },
      uptime: uptime || "Unknown",
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Status API Error:", error);
    // Graceful fallback to avoid crashing UI when SSH is not configured
    return NextResponse.json({
      error: "SSH Connection Failed",
      cpu: { usage: 0, temperature: 0, cores: 0 },
      memory: { total: 0, used: 0 },
      gpu: { usage: 0, temperature: 0 },
      uptime: "Offline",
      message: error.message
    }, { status: 500 });
  }
}
