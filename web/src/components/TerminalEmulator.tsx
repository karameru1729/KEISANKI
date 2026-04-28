"use client";

import React, { useState, useRef, useEffect } from "react";

interface TerminalLine {
  id: number;
  text: string;
  isCommand: boolean;
}

export function TerminalEmulator() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: 1, text: "KEISANKI OS v1.2.0 (x86_64)", isCommand: false },
    { id: 2, text: "Connected to SSH backend.", isCommand: false },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (!isProcessing) {
      // Small timeout to ensure the DOM has updated the disabled attribute
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isProcessing]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    if (trimmedCmd.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const newHistory = [...history, { id: Date.now(), text: `admin@node-01:~$ ${trimmedCmd}`, isCommand: true }];
    setHistory(newHistory);
    setInput("");
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: trimmedCmd })
      });
      
      const data = await res.json();
      
      if (data.error) {
        newHistory.push({ id: Date.now() + 1, text: `Error: ${data.error}`, isCommand: false });
      } else {
        newHistory.push({ id: Date.now() + 1, text: data.output || "", isCommand: false });
      }
    } catch (e: any) {
      newHistory.push({ id: Date.now() + 1, text: `Failed to execute: ${e.message}`, isCommand: false });
    }

    setHistory([...newHistory]);
    setIsProcessing(false);
  };

  return (
    <div 
      className="glass-panel w-full h-[600px] rounded-xl overflow-hidden flex flex-col font-mono text-sm bg-[#050505] border-slate-700/50 shadow-2xl"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="bg-slate-800/80 px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <span className="text-slate-400 text-xs ml-2 font-sans tracking-wider">admin@node-01 : ~</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto text-slate-300">
        {history.map((line) => (
          <div key={line.id} className="mb-1 whitespace-pre-wrap">
            {line.isCommand ? (
              <span className="text-emerald-400 font-semibold">{line.text}</span>
            ) : (
              <span className="text-slate-300">{line.text}</span>
            )}
          </div>
        ))}
        
        <div className="flex items-center mt-1">
          <span className="text-emerald-400 font-semibold mr-2">admin@node-01:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isProcessing) handleCommand(input);
            }}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-slate-300 min-w-0"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
