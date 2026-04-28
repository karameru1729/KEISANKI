import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayCircle, Clock, CheckCircle2, XCircle } from 'lucide-react-native';

interface Job {
  id: string;
  name: string;
  user: string;
  status: "running" | "queued" | "completed" | "failed";
  progress: number;
  timeRemaining: string;
}

export function JobQueue({ jobs }: { jobs: Job[] }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Queue</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{jobs.length} total</Text>
        </View>
      </View>

      <View style={styles.list}>
        {jobs.map((job) => (
          <View key={job.id} style={styles.jobItem}>
            <View style={styles.jobInfo}>
              <Text style={styles.jobName}>{job.name}</Text>
              <Text style={styles.jobId}>{job.id} • {job.user}</Text>
            </View>
            
            <View style={styles.jobStatus}>
              {job.status === "running" && <PlayCircle size={16} color="#0ea5e9" />}
              {job.status === "queued" && <Clock size={16} color="#f59e0b" />}
              {job.status === "completed" && <CheckCircle2 size={16} color="#10b981" />}
              {job.status === "failed" && <XCircle size={16} color="#ef4444" />}
              <Text style={styles.statusText}>{job.progress}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  badge: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    gap: 12,
  },
  jobItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  jobId: {
    color: '#64748b',
    fontSize: 12,
  },
  jobStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 4,
  },
});
