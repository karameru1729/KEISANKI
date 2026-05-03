import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { API_BASE_URL } from '@/constants/api';

interface TerminalLine {
  id: number;
  text: string;
  isCommand: boolean;
}

export function TerminalEmulator() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: 1, text: "KEISANKI OS v1.2.0 (x86_64)", isCommand: false },
    { id: 2, text: "Type 'help' for a list of available mock commands.", isCommand: false },
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleCommand = async () => {
    const trimmedCmd = input.trim();
    if (!trimmedCmd) return;

    if (trimmedCmd.toLowerCase() === 'clear') {
      setHistory([]);
      setInput("");
      return;
    }

    const newHistory = [...history, { id: Date.now(), text: `admin@node-01:~$ ${trimmedCmd}`, isCommand: true }];
    setHistory(newHistory);
    setInput("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/terminal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: trimmedCmd }),
      });

      const data = await res.json();
      if (data.output) {
        setHistory(prev => [...prev, { id: Date.now(), text: data.output, isCommand: false }]);
      } else if (data.error) {
        setHistory(prev => [...prev, { id: Date.now(), text: `Error: ${data.error}`, isCommand: false }]);
      }
    } catch (err: any) {
      setHistory(prev => [...prev, { id: Date.now(), text: `Network Error: ${err.message}`, isCommand: false }]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.trafficLights}>
          <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
          <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
          <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
        </View>
        <Text style={styles.headerTitle}>admin@node-01 : ~</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.terminalBody} 
        contentContainerStyle={styles.terminalContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {history.map((line) => (
          <Text 
            key={line.id} 
            style={[styles.terminalText, line.isCommand ? styles.commandText : null]}
          >
            {line.text}
          </Text>
        ))}
        
        <View style={styles.inputRow}>
          <Text style={styles.prompt}>admin@node-01:~$ </Text>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleCommand}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            keyboardAppearance="dark"
            blurOnSubmit={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  trafficLights: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  headerTitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  terminalBody: {
    flex: 1,
  },
  terminalContent: {
    padding: 12,
  },
  terminalText: {
    color: '#cbd5e1',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    marginBottom: 4,
  },
  commandText: {
    color: '#34d399',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  prompt: {
    color: '#34d399',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
  },
  input: {
    flex: 1,
    color: '#cbd5e1',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    padding: 0,
    minHeight: 20,
  },
});
