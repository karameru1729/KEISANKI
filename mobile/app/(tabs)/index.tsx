import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { Cpu, HardDrive, MemoryStick, ActivitySquare, Server, AlertTriangle } from 'lucide-react-native';
import { MetricCard } from '@/components/MetricCard';
import { JobQueue } from '@/components/JobQueue';
import { API_BASE_URL } from '@/constants/api';

export default function DashboardScreen() {
  const [status, setStatus] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [resStatus, resJobs] = await Promise.all([
        fetch(`${API_BASE_URL}/api/status`),
        fetch(`${API_BASE_URL}/api/jobs`)
      ]);

      if (!resStatus.ok || !resJobs.ok) {
        throw new Error("Failed to fetch data");
      }

      const statusData = await resStatus.json();
      const jobsData = await resJobs.json();

      setStatus(statusData);
      setJobs(jobsData);
    } catch (error) {
      console.error("API fetch error:", error);
      // Fallback state if server is unreachable
      if (!status) {
        setStatus({
          cpu: { usage: 0, temperature: 0 },
          memory: { total: 0, used: 0 },
          gpu: { usage: 0 },
          uptime: "Offline",
          error: "Connection Failed"
        });
        setJobs([]);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  if (!status) return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.loadingText}>Loading cluster status...</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cluster Dashboard</Text>
        <Text style={styles.subtitle}>Uptime: {status.uptime}</Text>
      </View>

      {status.cpu.temperature > 85 && (
        <View style={styles.alertBox}>
          <AlertTriangle color="#ef4444" size={20} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.alertTitle}>System Alert</Text>
            <Text style={styles.alertText}>CPU Temperature is critically high.</Text>
          </View>
        </View>
      )}

      <MetricCard
        title="CPU Usage"
        value={`${status.cpu.usage}`}
        unit="%"
        progress={status.cpu.usage}
        status={status.cpu.usage > 85 ? "danger" : status.cpu.usage > 60 ? "warning" : "normal"}
        icon={<Cpu size={20} color="#94a3b8" />}
      />

      <MetricCard
        title="Memory Usage"
        value={`${status.memory.used}`}
        unit={`/ ${status.memory.total} GB`}
        progress={(status.memory.used / status.memory.total) * 100}
        status={(status.memory.used / status.memory.total) * 100 > 90 ? "danger" : "normal"}
        icon={<MemoryStick size={20} color="#94a3b8" />}
      />

      <MetricCard
        title="CPU Temp"
        value={`${status.cpu.temperature}`}
        unit="°C"
        progress={(status.cpu.temperature / 100) * 100}
        status={status.cpu.temperature > 85 ? "danger" : status.cpu.temperature > 75 ? "warning" : "normal"}
        icon={<Server size={20} color="#94a3b8" />}
      />

      <View style={{ marginTop: 8 }}>
        <JobQueue jobs={jobs} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingText: {
    color: '#0ea5e9',
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    alignItems: 'flex-start',
  },
  alertTitle: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  alertText: {
    color: '#f8fafc',
    fontSize: 12,
  },
});
