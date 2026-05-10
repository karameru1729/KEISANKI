"use client";

import { useState } from "react";
import { Settings, Shield, Bell, HardDrive, Save } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // Mock state for forms
  const [settings, setSettings] = useState({
    clusterName: "Alpha-Compute-01",
    autoScale: true,
    allowGuest: false,
    adminEmail: "admin@keisanki.local",
    slackAlerts: true,
    emailAlerts: false,
    alertThresholdCpu: 85,
    alertThresholdTemp: 80,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800); // Simulate network request
  };

  const tabs = [
    { id: "general", label: "General", icon: <HardDrive className="w-4 h-4" /> },
    { id: "permissions", label: "Permissions", icon: <Shield className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full max-w-5xl">
      <header className="flex justify-between items-end pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          </div>
          <p className="text-slate-400 mt-2">Configure cluster behavior, access control, and alerts.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === tab.id 
                    ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-[inset_0_0_10px_rgba(var(--color-primary-rgb),0.1)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="glass-panel p-8 rounded-2xl">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-semibold text-white mb-6">General Configuration</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Cluster Name</label>
                    <input 
                      type="text" 
                      value={settings.clusterName}
                      onChange={(e) => setSettings({ ...settings, clusterName: e.target.value })}
                      className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                    <label className="flex items-center justify-between cursor-pointer max-w-md">
                      <div>
                        <span className="text-white font-medium block">Auto-Scaling</span>
                        <span className="text-slate-400 text-sm">Automatically provision nodes based on job queue</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={settings.autoScale} onChange={(e) => setSettings({ ...settings, autoScale: e.target.checked })} />
                        <div className={cn("block w-14 h-8 rounded-full transition-colors", settings.autoScale ? "bg-[var(--color-primary)]" : "bg-slate-700")}></div>
                        <div className={cn("dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform", settings.autoScale ? "transform translate-x-6" : "")}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "permissions" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-semibold text-white mb-6">Access & Permissions</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Admin Contact Email</label>
                    <input 
                      type="email" 
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                    <label className="flex items-center justify-between cursor-pointer max-w-md">
                      <div>
                        <span className="text-white font-medium block">Guest Access</span>
                        <span className="text-slate-400 text-sm">Allow unauthenticated users to view dashboard</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={settings.allowGuest} onChange={(e) => setSettings({ ...settings, allowGuest: e.target.checked })} />
                        <div className={cn("block w-14 h-8 rounded-full transition-colors", settings.allowGuest ? "bg-[var(--color-primary)]" : "bg-slate-700")}></div>
                        <div className={cn("dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform", settings.allowGuest ? "transform translate-x-6" : "")}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-semibold text-white mb-6">Alerts & Notifications</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer max-w-md">
                      <div>
                        <span className="text-white font-medium block">Slack Alerts</span>
                        <span className="text-slate-400 text-sm">Send notifications to connected workspace</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={settings.slackAlerts} onChange={(e) => setSettings({ ...settings, slackAlerts: e.target.checked })} />
                        <div className={cn("block w-14 h-8 rounded-full transition-colors", settings.slackAlerts ? "bg-[var(--color-primary)]" : "bg-slate-700")}></div>
                        <div className={cn("dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform", settings.slackAlerts ? "transform translate-x-6" : "")}></div>
                      </div>
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer max-w-md">
                      <div>
                        <span className="text-white font-medium block">Email Alerts</span>
                        <span className="text-slate-400 text-sm">Send daily digests and critical alerts</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={settings.emailAlerts} onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })} />
                        <div className={cn("block w-14 h-8 rounded-full transition-colors", settings.emailAlerts ? "bg-[var(--color-primary)]" : "bg-slate-700")}></div>
                        <div className={cn("dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform", settings.emailAlerts ? "transform translate-x-6" : "")}></div>
                      </div>
                    </label>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Thresholds</h3>
                    <div className="flex items-center gap-4 max-w-md">
                      <div className="flex-1">
                        <label className="block text-sm text-slate-400 mb-1.5">CPU Usage (%)</label>
                        <input 
                          type="number" 
                          value={settings.alertThresholdCpu}
                          onChange={(e) => setSettings({ ...settings, alertThresholdCpu: Number(e.target.value) })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-danger)] transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-slate-400 mb-1.5">Temp (°C)</label>
                        <input 
                          type="number" 
                          value={settings.alertThresholdTemp}
                          onChange={(e) => setSettings({ ...settings, alertThresholdTemp: Number(e.target.value) })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-danger)] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
