"use client";

import { Settings, Save, RotateCcw, Key, Bell, Palette, Terminal, Globe, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme, ThemeName, cn } from "@/lib/DesignSystem";

const THEMES: { id: ThemeName; name: string; colors: string; description: string }[] = [
  { 
    id: "matrix", 
    name: "The Matrix", 
    colors: "🟢",
    description: "Neo green - digital reality awaits" 
  },
  { 
    id: "charizard", 
    name: "Charizard", 
    colors: "🔥🧡",
    description: "Fire-type power - blaze it!" 
  },
  { 
    id: "yin_yang", 
    name: "Yin & Yang", 
    colors: "⬛⬜",
    description: "Perfect balance of light and dark" 
  },
  { 
    id: "ocean_calm", 
    name: "Ocean Calm", 
    colors: "🌊🔵",
    description: "Deep ocean tranquility" 
  },
  { 
    id: "sky_blue", 
    name: "Sky Blue", 
    colors: "💙☁️",
    description: "Light and airy - open skies" 
  },
];

export default function SettingsPage() {
  const { theme, setTheme, colors } = useTheme();
  const [modelSettings, setModelSettings] = useState({
    model: "anthropic/claude-opus-4.6",
    maxTokens: 4096,
    temperature: 0.7,
  });
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    autoSave: true,
    verbose: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div 
      className="min-h-screen font-mono p-6"
      style={{ 
        backgroundColor: "var(--theme-background)",
        color: "var(--theme-text)"
      }}
    >
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-bold tracking-wider flex items-center gap-3"
              style={{ color: colors.primary }}
            >
              <Settings className="w-6 h-6" />
              SETTINGS
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: "var(--theme-text-dim)" }}
            >
              Configure Hermes Agent behavior and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:border-green-500/50 transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: saved ? colors.success : colors.primary,
                color: "#000"
              }}
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {/* Theme Selection */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <h2 
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: colors.primary }}
          >
            <Palette className="w-5 h-5" />
            APPEARANCE
          </h2>
          <p 
            className="text-sm mb-4"
            style={{ color: "var(--theme-text-dim)" }}
          >
            Choose your preferred theme. Changes apply instantly.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-left
                  ${theme === t.id 
                    ? "border-current shadow-lg" 
                    : "border-slate-700 hover:border-slate-600"
                  }
                `}
                style={{ 
                  backgroundColor: theme === t.id ? `${colors.primary}15` : undefined,
                  borderColor: theme === t.id ? colors.primary : undefined
                }}
              >
                {theme === t.id && (
                  <div 
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary, color: "#000" }}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="text-2xl mb-2">{t.colors}</div>
                <div className="font-bold text-sm">{t.name}</div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: "var(--theme-text-dim)" }}
                >
                  {t.description}
                </div>
              </button>
            ))}
          </div>

          {/* Color Preview */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
            <p className="text-xs mb-2">COLOR PREVIEW</p>
            <div className="flex gap-2">
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: colors.primary }}
                title="Primary"
              />
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: colors.secondary }}
                title="Secondary"
              />
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: colors.background }}
                title="Background"
              />
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: colors.backgroundAlt }}
                title="Background Alt"
              />
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: colors.border }}
                title="Border"
              />
            </div>
          </div>
        </div>

        {/* Model Settings */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <h2 
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: colors.primary }}
          >
            <Globe className="w-5 h-5" />
            MODEL CONFIGURATION
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: "var(--theme-text-dim)" }}>AI Model</label>
              <select 
                value={modelSettings.model}
                onChange={(e) => setModelSettings({...modelSettings, model: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                style={{ color: "var(--theme-text)" }}
              >
                <option value="anthropic/claude-opus-4.6">Claude Opus 4.6</option>
                <option value="anthropic/claude-sonnet-4.5">Claude Sonnet 4.5</option>
                <option value="anthropic/claude-haiku-3.5">Claude Haiku 3.5</option>
                <option value="minimax/minimax-m2.5">MiniMax M2.5</option>
              </select>
            </div>
            <div>
              <label 
                className="block text-sm mb-2" 
                style={{ color: "var(--theme-text-dim)" }}
              >
                Max Tokens: {modelSettings.maxTokens}
              </label>
              <input 
                type="range" 
                min="1024" 
                max="16384" 
                step="512"
                value={modelSettings.maxTokens}
                onChange={(e) => setModelSettings({...modelSettings, maxTokens: parseInt(e.target.value)})}
                className="w-full"
                style={{ accentColor: colors.primary }}
              />
            </div>
            <div>
              <label 
                className="block text-sm mb-2" 
                style={{ color: "var(--theme-text-dim)" }}
              >
                Temperature: {modelSettings.temperature}
              </label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={modelSettings.temperature}
                onChange={(e) => setModelSettings({...modelSettings, temperature: parseFloat(e.target.value)})}
                className="w-full"
                style={{ accentColor: colors.primary }}
              />
            </div>
          </div>
        </div>

        {/* Behavior */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <h2 
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: colors.primary }}
          >
            <Terminal className="w-5 h-5" />
            BEHAVIOR
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200">Auto-save Sessions</p>
                <p className="text-xs" style={{ color: "var(--theme-text-dim)" }}>Automatically persist conversation state</p>
              </div>
              <button 
                onClick={() => setAppSettings({...appSettings, autoSave: !appSettings.autoSave})}
                className={`w-12 h-6 rounded-full transition-colors ${appSettings.autoSave ? "" : "bg-slate-700"}`}
                style={{ backgroundColor: appSettings.autoSave ? colors.primary : undefined }}
              >
                <div 
                  className="w-4 h-4 rounded-full bg-white transition-transform" 
                  style={{ transform: appSettings.autoSave ? "translate-x-7)" : "translate-x-1" }}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200">Notifications</p>
                <p className="text-xs" style={{ color: "var(--theme-text-dim)" }}>Send task completion alerts</p>
              </div>
              <button 
                onClick={() => setAppSettings({...appSettings, notifications: !appSettings.notifications})}
                className={`w-12 h-6 rounded-full transition-colors`}
                style={{ backgroundColor: appSettings.notifications ? colors.primary : undefined }}
              >
                <div 
                  className="w-4 h-4 rounded-full bg-white transition-transform" 
                  style={{ transform: appSettings.notifications ? "translate-x-7" : "translate-x-1" }}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200">Verbose Output</p>
                <p className="text-xs" style={{ color: "var(--theme-text-dim)" }}>Show detailed tool execution info</p>
              </div>
              <button 
                onClick={() => setAppSettings({...appSettings, verbose: !appSettings.verbose})}
                className={`w-12 h-6 rounded-full transition-colors`}
                style={{ backgroundColor: appSettings.verbose ? colors.primary : undefined }}
              >
                <div 
                  className="w-4 h-4 rounded-full bg-white transition-transform" 
                  style={{ transform: appSettings.verbose ? "translate-x-7" : "translate-x-1" }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <h2 
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: colors.primary }}
          >
            <Key className="w-5 h-5" />
            API KEYS
          </h2>
          <div className="space-y-3">
            {[
              { name: "Anthropic API", key: "sk-ant-...", set: true },
              { name: "Telegram Bot", key: "Configured", set: true },
              { name: "Discord Bot", key: "Configured", set: true },
              { name: "Browserbase", key: "Configured", set: true },
            ].map((api) => (
              <div key={api.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-200">{api.name}</span>
                <span 
                  className="text-xs"
                  style={{ color: api.set ? colors.primary : colors.error }}
                >
                  {api.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
