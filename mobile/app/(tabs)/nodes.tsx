import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Server, CheckCircle2, XCircle, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const nodes = [
  { id: "node-01", ip: "192.168.1.10", status: "online", cpu: 89, mem: 64, gpu: "A100", uptime: "14d 3h" },
  { id: "node-02", ip: "192.168.1.11", status: "online", cpu: 45, mem: 32, gpu: "V100", uptime: "14d 3h" },
  { id: "node-03", ip: "192.168.1.12", status: "offline", cpu: 0, mem: 0, gpu: "A100", uptime: "0d 0h" },
];

export default function NodesScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Server color="#0ea5e9" size={28} />
          <Text style={styles.title}>Cluster Nodes</Text>
        </View>
        <Text style={styles.subtitle}>Manage and monitor physical compute nodes.</Text>
      </View>

      <View style={styles.list}>
        {nodes.map(node => (
          <View key={node.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.nodeIdentity}>
                <View style={[styles.iconBox, node.status === 'online' ? styles.iconBoxOnline : styles.iconBoxOffline]}>
                  <Server color={node.status === 'online' ? '#10b981' : '#64748b'} size={20} />
                </View>
                <View>
                  <Text style={styles.nodeId}>{node.id}</Text>
                  <Text style={styles.nodeIp}>{node.ip}</Text>
                </View>
              </View>
              <View style={styles.statusBox}>
                {node.status === 'online' ? (
                  <CheckCircle2 color="#10b981" size={16} />
                ) : (
                  <XCircle color="#ef4444" size={16} />
                )}
                <Text style={[styles.statusText, { color: node.status === 'online' ? '#10b981' : '#ef4444' }]}>
                  {node.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>CPU Load</Text>
                <View style={styles.metricValueRow}>
                  <Activity color={node.cpu > 80 ? '#ef4444' : '#0ea5e9'} size={14} />
                  <Text style={styles.metricValue}>{node.cpu}%</Text>
                </View>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Memory</Text>
                <Text style={styles.metricValue}>{node.mem}%</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>GPU Type</Text>
                <Text style={styles.metricValue}>{node.gpu}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Uptime</Text>
                <Text style={styles.metricValue}>{node.uptime}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, node.status !== 'online' && styles.buttonDisabled]} 
              disabled={node.status !== 'online'}
              onPress={() => router.push('/terminal')}
            >
              <Text style={styles.buttonText}>Connect SSH</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  nodeIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  iconBoxOffline: {
    backgroundColor: 'rgba(30, 41, 59, 1)',
  },
  nodeId: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nodeIp: {
    color: '#94a3b8',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricBox: {
    width: '47%',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 12,
    borderRadius: 8,
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  buttonText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
});
