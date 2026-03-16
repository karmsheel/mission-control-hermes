"use client";

import { GitBranch, Plus, ExternalLink, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const connections = [
  { 
    name: "Telegram", 
    type: "messaging", 
    status: "connected", 
    details: "Bot: @HermesBot | Chat: 132261175",
    icon: "📱"
  },
  { 
    name: "Discord", 
    type: "messaging", 
    status: "connected", 
    details: "Server: Hermes Work | Channel: #hackathon",
    icon: "💬"
  },
  { 
    name: "GitHub", 
    type: "developer", 
    status: "connected", 
    details: "Repository: NousResearch/hermes-agent",
    icon: "🐙"
  },
  { 
    name: "Claude API", 
    type: "ai", 
    status: "connected", 
    details: "Model: claude-opus-4-20250514",
    icon: "🤖"
  },
  { 
    name: "Convex", 
    type: "database", 
    status: "disconnected", 
    details: "Not configured - using localStorage",
    icon: "🗄️"
  },
  { 
    name: "Browserbase", 
    type: "automation", 
    status: "connected", 
    details: "Session: active | Region: us-east-1",
    icon: "🌐"
  },
];

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-green-400 font-mono p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400 tracking-wider flex items-center gap-3">
              <GitBranch className="w-6 h-6" />
              CONNECTIONS
            </h1>
            <p className="text-sm text-green-600/70 mt-1">
              Manage integrations and external service connections
            </p>
          </div>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            ADD CONNECTION
          </button>
        </div>
      </header>

      {/* Connection Cards */}
      <div className="grid grid-cols-2 gap-4">
        {connections.map((conn) => (
          <div 
            key={conn.name}
            className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-green-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{conn.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-200">{conn.name}</h3>
                  <span className="text-xs text-slate-500 uppercase">{conn.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {conn.status === "connected" ? (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    CONNECTED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <XCircle className="w-3 h-3" />
                    DISCONNECTED
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{conn.details}</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs hover:border-green-500/50 transition-colors flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Reconnect
              </button>
              <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs hover:border-green-500/50 transition-colors flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Webhooks Section */}
      <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded-xl p-4">
        <h2 className="text-lg font-bold text-green-400 mb-4">WEBHOOKS</h2>
        <div className="text-sm text-slate-400">
          <p>No webhooks configured yet.</p>
          <button className="mt-2 text-green-400 hover:underline">+ Add webhook</button>
        </div>
      </div>
    </div>
  );
}
