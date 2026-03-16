"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AgentStatus = "online" | "working" | "idle" | "away" | "offline";
export type TaskType = "coding" | "research" | "writing" | "testing" | "meeting" | "break";

export interface Agent {
  id: string;
  name: string;
  avatar: string; // Emoji or icon
  role: string;
  status: AgentStatus;
  currentTask?: string;
  taskType?: TaskType;
  computerOn: boolean;
  location: "desk" | "meeting" | "breakroom" | "away";
  
  // Stats
  tasksCompleted: number;
  tasksInProgress: number;
  
  // Timing
  lastActive: number;
  workStartTime?: number;
}

export interface Workstation {
  id: string;
  agentId: string;
  stationNumber: number;
  computerOn: boolean;
  screenContent?: string;
  deskItems: string[];
}

interface OfficeContextType {
  agents: Agent[];
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
}

const OfficeContext = createContext<OfficeContextType | null>(null);

const INITIAL_AGENTS: Agent[] = [
  {
    id: "hermes",
    name: "Hermes",
    avatar: "🤖",
    role: "AI Developer",
    status: "working",
    currentTask: "Building dashboard features",
    taskType: "coding",
    computerOn: true,
    location: "desk",
    tasksCompleted: 47,
    tasksInProgress: 3,
    lastActive: Date.now(),
    workStartTime: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: "user",
    name: "You",
    avatar: "👤",
    role: "Product Owner",
    status: "online",
    currentTask: "Reviewing project",
    taskType: "meeting",
    computerOn: true,
    location: "desk",
    tasksCompleted: 12,
    tasksInProgress: 5,
    lastActive: Date.now(),
  },
  {
    id: "claude",
    name: "Claude Code",
    avatar: "🧠",
    role: "Code Assistant",
    status: "working",
    currentTask: "Writing unit tests",
    taskType: "coding",
    computerOn: true,
    location: "desk",
    tasksCompleted: 89,
    tasksInProgress: 2,
    lastActive: Date.now(),
    workStartTime: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "codex",
    name: "Codex",
    avatar: "⚡",
    role: "Automation Bot",
    status: "working",
    currentTask: "Running CI/CD pipeline",
    taskType: "testing",
    computerOn: true,
    location: "desk",
    tasksCompleted: 156,
    tasksInProgress: 1,
    lastActive: Date.now(),
    workStartTime: Date.now() - 30 * 60 * 1000,
  },
  {
    id: "browser",
    name: "Browser Bot",
    avatar: "🌐",
    role: "Web Automation",
    status: "idle",
    currentTask: "Waiting for tasks",
    taskType: "testing",
    computerOn: true,
    location: "desk",
    tasksCompleted: 34,
    tasksInProgress: 0,
    lastActive: Date.now() - 5 * 60 * 1000,
  },
  {
    id: "websearch",
    name: "Web Search",
    avatar: "🔍",
    role: "Research Agent",
    status: "working",
    currentTask: "Gathering info",
    taskType: "research",
    computerOn: true,
    location: "desk",
    tasksCompleted: 67,
    tasksInProgress: 1,
    lastActive: Date.now(),
    workStartTime: Date.now() - 1 * 60 * 60 * 1000,
  },
];

export function OfficeProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Simulate activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        // Randomly update status occasionally
        if (Math.random() < 0.05) {
          const statuses: AgentStatus[] = ["online", "working", "idle", "away"];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...agent, status: newStatus, lastActive: Date.now() };
        }
        return { ...agent, lastActive: Date.now() };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev =>
      prev.map(agent => agent.id === id ? { ...agent, ...updates } : agent)
    );
  };

  return (
    <OfficeContext.Provider value={{ agents, updateAgent, selectedAgent, setSelectedAgent }}>
      {children}
    </OfficeContext.Provider>
  );
}

export function useOffice() {
  const context = useContext(OfficeContext);
  if (!context) {
    throw new Error("useOffice must be used within OfficeProvider");
  }
  return context;
}
