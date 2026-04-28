import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

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

  const handleCommand = () => {
    const trimmedCmd = input.trim();
    if (!trimmedCmd) return;

    const newHistory = [...history, { id: Date.now(), text: `admin@node-01:~$ ${trimmedCmd}`, isCommand: true }];
    
    let response = "";
    switch (trimmedCmd.toLowerCase()) {
      case "help":
        response = "Available commands: ls, pwd, whoami, nvidia-smi, clear, date, uptime";
        break;
      case "ls":
        response = "data/  scripts/  models/  output.log  run_job.sh";
        break;
      case "pwd":
        response = "/home/admin";
        break;
      case "whoami":
        response = "admin";
        break;
      case "nvidia-smi":
        response = `+-----------------------------------------+
| NVIDIA-SMI 525.105.17   CUDA: 12.0      |
|-----------------------------------------|
| GPU  Name        Pwr:Usage/Cap  Util    |
|   0  A100...     120W / 300W    89%     |
+-----------------------------------------+`;
        break;
      case "date":
        response = new Date().toString();
        break;
      case "uptime":
        response = "up 14 days,  3:15";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        response = `bash: ${trimmedCmd}: command not found`;
    }

    if (response) {
      newHistory.push({ id: Date.now() + 1, text: response, isCommand: false });
    }

    setHistory(newHistory);
    setInput("");
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
