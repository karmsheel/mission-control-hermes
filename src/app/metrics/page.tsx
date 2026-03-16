"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  Network, 
  Clock, 
  Zap,
  MessageSquare,
  Terminal,
  CheckCircle,
  AlertCircle,
  Gauge,
  Bot,
  Brain,
  Zap as Lightning,
  RefreshCw,
  HardDrive,
  Server
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "stable";
  status?: "healthy" | "warning" | "critical";
  color: string;
}

function MetricCard({ title, value, unit, icon: Icon, trend, status = "healthy", color }: MetricCardProps) {
  const statusColors = {
    healthy: "text-green-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-green-500/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`text-xs ${statusColors[status]}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${statusColors[status]}`}>{value}</span>
          {unit && <span className="text-sm text-slate-500">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

interface HermesConfig {
  config: {
    model: string;
    provider: string;
    baseUrl: string;
    maxTurns: string;
    memoryEnabled: boolean;
    toolExecutionTimeout: string;
  };
  envVars: {
    llmModel?: string;
    hasOpenRouter?: boolean;
    hasAnthropic?: boolean;
    hasOpenAI?: boolean;
  };
  system: {
    uptime: number;
    platform: string;
    nodeVersion: string;
  };
  timestamp: string;
}

interface ProcessInfo {
  name: string;
  status: "running" | "idle" | "error";
  uptime: string;
  memory: string;
}

export default function MetricsPage() {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [hermesConfig, setHermesConfig] = useState<HermesConfig | null>(null);
  const [metrics, setMetrics] = useState({
    cpu: 23,
    memory: 67,
    activeTasks: 3,
    completedTasks: 156,
    apiCalls: 1247,
    tokensUsed: 892340,
    uptime: "4h 32m",
    latency: 145,
    successRate: 99.7,
  });

  useEffect(() => {
    // Fetch Hermes config
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        setHermesConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load config:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Simulate metric fluctuations
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(5, Math.min(80, prev.cpu + Math.floor(Math.random() * 10) - 5)),
        memory: Math.max(40, Math.min(90, prev.memory + Math.floor(Math.random() * 6) - 3)),
        latency: Math.max(50, Math.min(300, prev.latency + Math.floor(Math.random() * 40) - 20)),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 3),
        tokensUsed: prev.tokensUsed + Math.floor(Math.random() * 100),
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Get the actual model from config
  const getModelInfo = () => {
    if (!hermesConfig) return { model: "Loading...", provider: "..." };
    
    const config = hermesConfig.config;
    const env = hermesConfig.envVars;
    
    // Use env LLM_MODEL if set, otherwise fall back to config
    const model = env.llmModel || config.model;
    const provider = config.provider || "openrouter";
    
    return { model, provider };
  };

  const modelInfo = getModelInfo();

  const processes: ProcessInfo[] = [
    { name: "Agent Core", status: "running", uptime: "4h 32m", memory: "245 MB" },
    { name: "Message Gateway", status: "running", uptime: "4h 32m", memory: "128 MB" },
    { name: "Tool Orchestrator", status: "running", uptime: "2h 15m", memory: "89 MB" },
    { name: "Context Manager", status: "idle", uptime: "4h 32m", memory: "56 MB" },
    { name: "Task Scheduler", status: "running", uptime: "1h 45m", memory: "34 MB" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-green-400 font-mono p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400 tracking-wider flex items-center gap-3">
              <Activity className="w-6 h-6" />
              AGENT METRICS
            </h1>
            <p className="text-sm text-green-600/70 mt-1">
              Real-time monitoring of Hermes Agent health and performance
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">LAST UPDATE</p>
            <p className="text-sm text-green-400">{time.toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="CPU Usage"
          value={metrics.cpu}
          unit="%"
          icon={Cpu}
          trend={metrics.cpu > 50 ? "up" : "down"}
          status={metrics.cpu > 70 ? "warning" : "healthy"}
          color="bg-blue-500/20 text-blue-400"
        />
        <MetricCard
          title="Memory"
          value={metrics.memory}
          unit="%"
          icon={MemoryStick}
          trend={metrics.memory > 70 ? "up" : "stable"}
          status={metrics.memory > 80 ? "critical" : metrics.memory > 60 ? "warning" : "healthy"}
          color="bg-purple-500/20 text-purple-400"
        />
        <MetricCard
          title="API Latency"
          value={metrics.latency}
          unit="ms"
          icon={Gauge}
          trend={metrics.latency > 200 ? "up" : "down"}
          status={metrics.latency > 250 ? "critical" : metrics.latency > 150 ? "warning" : "healthy"}
          color="bg-yellow-500/20 text-yellow-400"
        />
        <MetricCard
          title="Success Rate"
          value={metrics.successRate}
          unit="%"
          icon={CheckCircle}
          trend="stable"
          status="healthy"
          color="bg-green-500/20 text-green-400"
        />
      </div>

      {/* Hermes Config - Dynamic */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-500 uppercase">Active Model</span>
            {loading && <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />}
          </div>
          <p className="text-lg font-bold text-green-300">{modelInfo.model}</p>
          <p className="text-xs text-slate-500 mt-1">via {modelInfo.provider}</p>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-500 uppercase">API Calls</span>
          </div>
          <p className="text-lg font-bold text-green-300">{metrics.apiCalls.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-500 uppercase">Tokens Used</span>
          </div>
          <p className="text-lg font-bold text-green-300">{(metrics.tokensUsed / 1000).toFixed(1)}K</p>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-500 uppercase">Uptime</span>
          </div>
          <p className="text-lg font-bold text-green-300">{metrics.uptime}</p>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-500 uppercase">Tasks Done</span>
          </div>
          <p className="text-lg font-bold text-green-300">{metrics.completedTasks}</p>
        </div>
      </div>

      {/* Config Details - Dynamic */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-green-500/30 rounded-xl p-4">
          <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5" />
            HERMES CONFIG
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">Model</span>
              <span className="text-green-300">{loading ? "Loading..." : hermesConfig?.config.model || "N/A"}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">Provider</span>
              <span className="text-green-300">{loading ? "Loading..." : hermesConfig?.config.provider || "N/A"}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">Max Turns</span>
              <span className="text-green-300">{loading ? "..." : hermesConfig?.config.maxTurns || "N/A"}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">Memory</span>
              <span className={hermesConfig?.config.memoryEnabled ? "text-green-300" : "text-red-300"}>
                {loading ? "..." : hermesConfig?.config.memoryEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            SYSTEM INFO
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">Platform</span>
              <span className="text-green-300">{hermesConfig?.system?.platform || "linux"}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">Node.js</span>
              <span className="text-green-300">{hermesConfig?.system?.nodeVersion || "v20.x"}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">OpenRouter</span>
              <span className={hermesConfig?.envVars?.hasOpenRouter ? "text-green-300" : "text-red-300"}>
                {loading ? "..." : hermesConfig?.envVars?.hasOpenRouter ? "Configured" : "Not set"}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-slate-500">Config Load</span>
              <span className="text-green-300">
                {hermesConfig ? "Success" : loading ? "Loading..." : "Failed"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Process Status */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          PROCESS STATUS
        </h2>
        <div className="space-y-3">
          {processes.map((proc) => (
            <div 
              key={proc.name}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-2 h-2 rounded-full
                  ${proc.status === "running" ? "bg-green-400 animate-pulse" : 
                    proc.status === "idle" ? "bg-yellow-400" : "bg-red-400"}
                `} />
                <span className="text-slate-200">{proc.name}</span>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <span className="text-slate-500">{proc.uptime}</span>
                <span className="text-slate-400">{proc.memory}</span>
                <span className={`
                  px-2 py-0.5 rounded
                  ${proc.status === "running" ? "bg-green-500/20 text-green-400" : 
                    proc.status === "idle" ? "bg-yellow-500/20 text-yellow-400" : 
                    "bg-red-500/20 text-red-400"}
                `}>
                  {proc.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            RECENT ACTIVITY
          </h2>
          <div className="space-y-2 text-sm">
            {[
              { time: "2s ago", action: "Task completed", detail: "Build demo video" },
              { time: "15s ago", action: "Tool execution", detail: "terminal: npm run build" },
              { time: "32s ago", action: "API call", detail: modelInfo.model },
              { time: "45s ago", action: "Message received", detail: "Discord: @Hermes" },
              { time: "1m ago", action: "Task started", detail: "Agent metrics page" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50">
                <span className="text-slate-500 text-xs w-16">{activity.time}</span>
                <span className="text-green-400">{activity.action}</span>
                <span className="text-slate-500">— {activity.detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
          <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <Lightning className="w-5 h-5" />
            CONNECTED PLATFORMS
          </h2>
          <div className="space-y-3">
            {[
              { name: "Telegram", status: "connected", icon: "📱" },
              { name: "Discord", status: "connected", icon: "💬" },
              { name: "CLI", status: "connected", icon: "⌨️" },
              { name: "Local Files", status: "connected", icon: "📁" },
            ].map((platform) => (
              <div 
                key={platform.name}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <span>{platform.icon}</span>
                  <span className="text-slate-200">{platform.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-xs text-green-400">CONNECTED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
