"use client";

import { Terminal, Search, Filter, Download, Trash2 } from "lucide-react";
import { useState } from "react";

export default function LogsPage() {
  const [filter, setFilter] = useState("all");

  const logs = [
    { time: "16:42:31", level: "INFO", source: "agent", message: "Task completed: Build demo video" },
    { time: "16:42:16", level: "DEBUG", source: "tool", message: "Executing: terminal npm run build" },
    { time: "16:42:01", level: "INFO", source: "api", message: "API call to Claude Opus 4.6 completed in 145ms" },
    { time: "16:41:58", level: "INFO", source: "gateway", message: "Message received from Discord #hackathon" },
    { time: "16:41:45", level: "DEBUG", source: "context", message: "Context compressed: 12,450 → 8,200 tokens" },
    { time: "16:41:32", level: "WARN", source: "memory", message: "Session memory approaching limit (85%)" },
    { time: "16:41:15", level: "INFO", source: "task", message: "New task created: Write hackathon writeup" },
    { time: "16:40:58", level: "INFO", source: "agent", message: "Agent metrics page rendered successfully" },
    { time: "16:40:45", level: "DEBUG", source: "tool", message: "Tool discovery: 47 tools available" },
    { time: "16:40:32", level: "INFO", source: "gateway", message: "Telegram connection established" },
  ];

  const levelColors: Record<string, string> = {
    INFO: "text-blue-400",
    WARN: "text-yellow-400",
    ERROR: "text-red-400",
    DEBUG: "text-slate-400",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-green-400 font-mono p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400 tracking-wider flex items-center gap-3">
              <Terminal className="w-6 h-6" />
              SYSTEM LOGS
            </h1>
            <p className="text-sm text-green-600/70 mt-1">
              Real-time log output from all Hermes Agent components
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:border-green-500/50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:border-red-500/50 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search logs..."
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm w-64 focus:border-green-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>
        </div>
      </div>

      {/* Log Output */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-500">Showing {logs.length} entries</span>
          <span className="text-slate-500">Auto-scroll: ON</span>
        </div>
        <div className="p-2 font-mono text-sm max-h-[70vh] overflow-y-auto">
          {logs.map((log, i) => (
            <div 
              key={i} 
              className="flex items-start gap-3 px-3 py-2 hover:bg-slate-800/50 rounded"
            >
              <span className="text-slate-500 shrink-0 w-20">{log.time}</span>
              <span className={`shrink-0 w-16 font-bold ${levelColors[log.level]}`}>
                {log.level}
              </span>
              <span className="text-purple-400 shrink-0 w-20">[{log.source}]</span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
