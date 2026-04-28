import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  progress?: number;
  status?: "normal" | "warning" | "danger";
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, unit, progress, status = "normal", icon }: MetricCardProps) {
  const statusColor = 
    status === "danger" ? "#ef4444" : 
    status === "warning" ? "#f59e0b" : "#0ea5e9";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon}
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {progress !== undefined && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: statusColor }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
  unit: {
    fontSize: 14,
    color: '#94a3b8',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
