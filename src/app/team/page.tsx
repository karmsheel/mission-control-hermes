"use client";

import { useState } from "react";
import { 
  Bot, 
  Users, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Settings,
  Cpu,
  Globe,
  Code,
  Terminal,
  Brain,
  Sparkles,
  X
} from "lucide-react";

interface SubAgent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "active" | "paused";
  model: string;
  capabilities: string[];
  tasksCompleted: number;
  color: string;
}

const defaultSubAgents: SubAgent[] = [
  {
    id: "1",
    name: "Codex",
    role: "Coding Specialist",
    status: "idle",
    model: "codex-1",
    capabilities: ["Code Generation", "Bug Fixing", "Refactoring"],
    tasksCompleted: 42,
    color: "blue",
  },
  {
    id: "2",
    name: "Claude Code",
    role: "AI Coding Assistant",
    status: "idle",
    model: "claude-sonnet-4-20250514",
    capabilities: ["Code Review", "Debugging", "Architecture"],
    tasksCompleted: 28,
    color: "purple",
  },
  {
    id: "3",
    name: "Researcher",
    role: "Web Research",
    status: "idle",
    model: "anthropic/claude-opus-4.6",
    capabilities: ["Web Search", "Content Extraction", "Analysis"],
    tasksCompleted: 15,
    color: "cyan",
  },
];

const capabilityIcons: Record<string, React.ElementType> = {
  "Code Generation": Code,
  "Bug Fixing": Terminal,
  "Refactoring": Code,
  "Code Review": Users,
  "Debugging": Terminal,
  "Architecture": Brain,
  "Web Search": Globe,
  "Content Extraction": Globe,
  "Analysis": Brain,
};

export default function TeamPage() {
  const [subAgents, setSubAgents] = useState<SubAgent[]>(defaultSubAgents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");
  const [newAgentModel, setNewAgentModel] = useState("anthropic/claude-opus-4.6");

  const handleCreateAgent = () => {
    if (!newAgentName.trim()) return;
    
    const colors = ["blue", "purple", "cyan", "green", "yellow", "pink"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newAgent: SubAgent = {
      id: Date.now().toString(),
      name: newAgentName,
      role: newAgentRole || "General Assistant",
      status: "idle",
      model: newAgentModel,
      capabilities: ["General Tasks"],
      tasksCompleted: 0,
      color: randomColor,
    };
    
    setSubAgents([...subAgents, newAgent]);
    setShowCreateModal(false);
    setNewAgentName("");
    setNewAgentRole("");
  };

  const toggleAgentStatus = (id: string) => {
    setSubAgents(agents => agents.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === "active" ? "idle" : "active" }
        : agent
    ));
  };

  const deleteAgent = (id: string) => {
    setSubAgents(agents => agents.filter(agent => agent.id !== id));
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      blue: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", icon: "text-blue-400" },
      purple: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", icon: "text-purple-400" },
      cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400" },
      green: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", icon: "text-green-400" },
      yellow: { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", icon: "text-yellow-400" },
      pink: { bg: "bg-pink-500/20", border: "border-pink-500/30", text: "text-pink-400", icon: "text-pink-400" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-green-400 font-mono p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400 tracking-wider flex items-center gap-3">
              <Users className="w-6 h-6" />
              TEAM
            </h1>
            <p className="text-sm text-green-600/70 mt-1">
              Manage your agent team and delegate tasks
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            NEW SUBAGENT
          </button>
        </div>
      </header>

      {/* Main Agent - Hermes */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5" />
          MAIN AGENT
        </h2>
        <div className="bg-slate-900/50 border-2 border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-green-400" />
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-green-300">Hermes</h3>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  PRIMARY
                </span>
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-slate-400 mb-3">Advanced AI assistant with full tool access</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-500">
                  <Cpu className="w-4 h-4" />
                  <span>Model:</span>
                  <span className="text-green-400">anthropic/claude-opus-4.6</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-500">Tools: Full Access</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-500">Memory: Enabled</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SubAgents */}
      <section>
        <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          SUBAGENTS ({subAgents.length})
        </h2>
        
        {subAgents.length === 0 ? (
          <div className="bg-slate-900/30 border border-dashed border-slate-700 rounded-xl p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No subagents yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg transition-colors"
            >
              Create your first subagent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subAgents.map((agent) => {
              const colors = getColorClasses(agent.color);
              
              return (
                <div 
                  key={agent.id}
                  className={`bg-slate-900/50 border rounded-xl p-5 transition-all hover:border-green-500/30 ${colors.border}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center border ${colors.border}`}>
                        <Bot className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-200">{agent.name}</h3>
                        <p className="text-xs text-slate-500">{agent.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${
                      agent.status === "active" 
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : agent.status === "paused"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : "bg-slate-700 text-slate-400 border-slate-600"
                    }`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Model */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">Model</p>
                    <p className="text-sm text-slate-300 truncate">{agent.model}</p>
                  </div>
                  
                  {/* Capabilities */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map((cap) => {
                        const Icon = capabilityIcons[cap] || Bot;
                        return (
                          <span 
                            key={cap}
                            className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 flex items-center gap-1"
                          >
                            <Icon className="w-3 h-3" />
                            {cap}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <span className="text-xs text-slate-500">
                      {agent.tasksCompleted} tasks completed
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleAgentStatus(agent.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          agent.status === "active"
                            ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                            : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                        }`}
                        title={agent.status === "active" ? "Pause" : "Activate"}
                      >
                        {agent.status === "active" ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Subagent
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g., Research Bot"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500/50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Role (optional)</label>
                <input
                  type="text"
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  placeholder="e.g., Web Research Specialist"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500/50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Model</label>
                <select
                  value={newAgentModel}
                  onChange={(e) => setNewAgentModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
                >
                  <option value="anthropic/claude-opus-4.6">Claude Opus 4.6</option>
                  <option value="anthropic/claude-sonnet-4-20250514">Claude Sonnet 4</option>
                  <option value="anthropic/claude-haiku-3.5">Claude Haiku 3.5</option>
                  <option value="openai/gpt-4o">GPT-4o</option>
                  <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                  <option value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                disabled={!newAgentName.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-lg transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
