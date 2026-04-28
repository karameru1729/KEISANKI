import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { TerminalSquare } from 'lucide-react-native';
import { TerminalEmulator } from '@/components/TerminalEmulator';

export default function TerminalScreen() {
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TerminalSquare color="#0ea5e9" size={28} />
          <Text style={styles.title}>Terminal</Text>
        </View>
        <Text style={styles.subtitle}>Direct shell access. Connected to node-01.</Text>
      </View>

      <View style={styles.terminalContainer}>
        <TerminalEmulator />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
  terminalContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
