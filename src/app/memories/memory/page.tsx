"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { 
  BookOpen, 
  Search, 
  Tag,
  Calendar,
  Bot,
  User,
  ExternalLink,
  FileText,
  MemoryStick,
  Filter,
  RefreshCw
} from "lucide-react";

interface MemoryEntry {
  id: string;
  content: string;
  type: "user" | "system" | "conversation";
  tags: string[];
  createdAt: number;
  source?: string;
}

interface MemoryWithMetadata {
  id: string;
  title: string;
  content: string;
  type: "user" | "system" | "conversation";
  tags: string[];
  timestamp: string;
  source?: string;
  category: string;
}

// Parse memory content into structured entries
function parseMemoryContent(content: string): MemoryWithMetadata[] {
  const entries: MemoryWithMetadata[] = [];
  const sections = content.split("§");
  
  sections.forEach((section, index) => {
    const trimmed = section.trim();
    if (!trimmed) return;
    
    // Determine type and category
    let type: "user" | "system" | "conversation" = "conversation";
    let category = "General";
    let tags: string[] = [];
    let title = "Memory Entry";
    let timestamp = new Date().toISOString();
    
    // Detect type from content
    if (trimmed.toLowerCase().includes("discord")) {
      type = "system";
      category = "Integration";
      tags = ["discord", "messaging"];
    } else if (trimmed.toLowerCase().includes("telegram")) {
      type = "system";
      category = "Integration";
      tags = ["telegram", "messaging"];
    } else if (trimmed.toLowerCase().includes("pkm") || trimmed.toLowerCase().includes("progress")) {
      type = "conversation";
      category = "Project";
      tags = ["pokemon", "gaming"];
    } else if (trimmed.toLowerCase().includes("slash command")) {
      type = "system";
      category = "Troubleshooting";
      tags = ["discord", "bug-fix"];
    }
    
    // Create title from first line or content snippet
    const firstLine = trimmed.split("\n")[0];
    if (firstLine.length < 50) {
      title = firstLine;
    } else {
      title = firstLine.substring(0, 47) + "...";
    }
    
    entries.push({
      id: `mem-${index}`,
      title,
      content: trimmed,
      type,
      tags,
      timestamp: new Date(Date.now() - index * 86400000).toISOString(), // Stagger timestamps
      category,
    });
  });
  
  return entries;
}

// Demo memories for display
const DEMO_MEMORIES: MemoryWithMetadata[] = [
  {
    id: "mem-1",
    title: "Discord Channel Configuration",
    content: "Discord channel for messaging: 1481928388829646860 (Hermes_Bot)",
    type: "system",
    tags: ["discord", "configuration"],
    timestamp: "2026-03-15T19:03:00Z",
    category: "Integration",
    source: "system"
  },
  {
    id: "mem-2", 
    title: "Discord Slash Commands Issue",
    content: "Discord slash commands issue: User has Hermes bot but slash commands aren't showing in a specific server. Cause: Bot was likely invited without `applications.commands` OAuth scope. Fix: Re-invite with scope=bot%applications.commands and permissions=3072.",
    type: "system",
    tags: ["discord", "bug-fix", "oauth"],
    timestamp: "2026-03-15T19:03:00Z",
    category: "Troubleshooting",
    source: "hermes"
  },
  {
    id: "mem-3",
    title: "Telegram Bot Setup",
    content: "Telegram bot setup: Bot token and user ID (132261175) are configured in .env. For group chats, user needs to disable \"Group Privacy\" via @BotFather (Bot Settings → Group Privacy → OFF).",
    type: "system", 
    tags: ["telegram", "configuration", "privacy"],
    timestamp: "2026-03-15T19:03:00Z",
    category: "Integration",
    source: "hermes"
  },
  {
    id: "mem-4",
    title: "User Preferences - Text Only",
    content: "User prefers text responses only (no voice) even when they send voice memos.",
    type: "user",
    tags: ["preferences", "communication"],
    timestamp: "2026-03-15T19:03:00Z",
    category: "Preferences",
    source: "user"
  },
  {
    id: "mem-5",
    title: "PKM Project Progress",
    content: "PKM:PROGRESS: Pokemon Red restarted fresh. Server running on port 9876. Now at Pallet Town, need to complete Oak's intro and get starter Pokemon.",
    type: "conversation",
    tags: ["pokemon", "gaming", "project"],
    timestamp: "2026-03-14T12:00:00Z",
    category: "Project",
    source: "hermes"
  },
  {
    id: "mem-6",
    title: "Mission Control Dashboard Build",
    content: "Hackathon project: Mission Control dashboard with Task Board, Content Pipeline, Calendar, Metrics. Built with Next.js, Tailwind CSS, localStorage persistence.",
    type: "conversation",
    tags: ["hackathon", "nextjs", "dashboard"],
    timestamp: "2026-03-15T16:00:00Z",
    category: "Project",
    source: "hermes"
  }
];

export default function MemoryPage() {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [memories, setMemories] = useState<MemoryWithMetadata[]>(DEMO_MEMORIES);
  const [loading, setLoading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryWithMetadata | null>(null);

  // Filter memories
  const filteredMemories = memories.filter((mem) => {
    const matchesSearch = !search || 
      mem.title.toLowerCase().includes(search.toLowerCase()) ||
      mem.content.toLowerCase().includes(search.toLowerCase()) ||
      mem.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = filter === "all" || 
      mem.type === filter ||
      mem.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(memories.map(m => m.category))];
  const typeCounts = {
    all: memories.length,
    user: memories.filter(m => m.type === "user").length,
    system: memories.filter(m => m.type === "system").length,
    conversation: memories.filter(m => m.type === "conversation").length,
  };

  return (
    <div 
      className="min-h-screen font-mono p-6"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" style={{ color: colors.primary }} />
            <h1 
              className="text-2xl font-bold tracking-wider"
              style={{ color: colors.primary }}
            >
              MEMORIES
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh memories"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
        
        <p 
          className="text-sm mt-1"
          style={{ color: colors.textDim }}
        >
          All stored memories, preferences, and conversation context
        </p>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textDim }} />
          <input
            type="text"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            style={{ 
              backgroundColor: colors.backgroundAlt,
              borderColor: colors.border,
              color: colors.text 
            }}
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: colors.textDim }} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            style={{ 
              backgroundColor: colors.backgroundAlt,
              borderColor: colors.border,
              color: colors.text 
            }}
          >
            <option value="all">All ({typeCounts.all})</option>
            <option value="user">User ({typeCounts.user})</option>
            <option value="system">System ({typeCounts.system})</option>
            <option value="conversation">Conversation ({typeCounts.conversation})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMemories.map((memory) => (
          <div
            key={memory.id}
            onClick={() => setSelectedMemory(memory)}
            className="p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01]"
            style={{ 
              backgroundColor: colors.backgroundAlt,
              borderColor: colors.border,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {memory.type === "user" ? (
                  <User className="w-4 h-4" style={{ color: colors.secondary }} />
                ) : memory.type === "system" ? (
                  <MemoryStick className="w-4 h-4" style={{ color: colors.primary }} />
                ) : (
                  <Bot className="w-4 h-4" style={{ color: colors.primary }} />
                )}
                <span 
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary 
                  }}
                >
                  {memory.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: colors.textDim }}>
                <Calendar className="w-3 h-3" />
                {new Date(memory.timestamp).toLocaleDateString()}
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm mb-2 line-clamp-1">{memory.title}</h3>

            {/* Content Preview */}
            <p 
              className="text-sm mb-3 line-clamp-2"
              style={{ color: colors.textDim }}
            >
              {memory.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {memory.tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: colors.border,
                    color: colors.textDim 
                  }}
                >
                  #{tag}
                </span>
              ))}
              <span 
                className="text-xs px-2 py-0.5 rounded"
                style={{ 
                  backgroundColor: `${colors.secondary}20`,
                  color: colors.secondary 
                }}
              >
                {memory.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMemories.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: colors.textDim }} />
          <p style={{ color: colors.textDim }}>No memories found</p>
          <p className="text-sm" style={{ color: colors.textDim }}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            onClick={() => setSelectedMemory(null)}
          />
          <div 
            className="relative bg-slate-900 border-2 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
            style={{ borderColor: colors.primary }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2">
                {selectedMemory.type === "user" ? (
                  <User className="w-5 h-5" style={{ color: colors.secondary }} />
                ) : (
                  <MemoryStick className="w-5 h-5" style={{ color: colors.primary }} />
                )}
                <h2 className="font-bold">{selectedMemory.title}</h2>
              </div>
              <button
                onClick={() => setSelectedMemory(null)}
                className="p-2 hover:bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: colors.textDim }}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedMemory.timestamp).toLocaleString()}
                </span>
                <span 
                  className="px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                >
                  {selectedMemory.type}
                </span>
                <span 
                  className="px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}
                >
                  {selectedMemory.category}
                </span>
              </div>

              <div className="p-4 rounded-lg whitespace-pre-wrap text-sm" style={{ 
                backgroundColor: colors.background,
                color: colors.text 
              }}>
                {selectedMemory.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedMemory.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: colors.border,
                      color: colors.textDim 
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t" style={{ borderColor: colors.border }}>
              <button
                onClick={() => setSelectedMemory(null)}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: colors.backgroundAlt, color: colors.text }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
