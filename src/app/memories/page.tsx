"use client";

import { useState, useEffect } from "react";
import { useTheme, cn } from "@/lib/DesignSystem";
import { 
  Brain, 
  Search, 
  Filter, 
  ExternalLink, 
  Bot, 
  User,
  MessageSquare,
  Gamepad2,
  Settings,
  Hash,
  RefreshCw,
  FileText,
  Tag
} from "lucide-react";

interface Memory {
  id: string;
  title: string;
  content: string;
  type: string;
  updatedAt: number;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  discord: MessageSquare,
  telegram: MessageSquare,
  pokemon: Gamepad2,
  preference: Settings,
  general: FileText,
};

const TYPE_COLORS: Record<string, string> = {
  discord: "#5865F2",
  telegram: "#0088cc",
  pokemon: "#ff6b6b",
  preference: "#f5a5a5",
  general: "#00ff41",
};

export default function MemoriesPage() {
  const { colors, cn } = useTheme();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memories");
      const data = await res.json();
      setMemories(data.memories || []);
    } catch (e) {
      console.error("Failed to load memories:", e);
    }
    setLoading(false);
  };

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch = !search || 
      memory.title.toLowerCase().includes(search.toLowerCase()) ||
      memory.content.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || memory.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <Brain className="w-6 h-6" style={{ color: colors.primary }} />
            <h1 
              className="text-2xl font-bold tracking-wider"
              style={{ color: colors.primary }}
            >
              MEMORIES
            </h1>
            <span 
              className="text-sm px-2 py-1 rounded"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
            >
              {memories.length} memories
            </span>
          </div>
          
          <button
            onClick={fetchMemories}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            style={{ borderColor: colors.border }}
          >
            <RefreshCw className="w-5 h-5" style={{ color: colors.primary }} />
          </button>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
            style={{ color: colors.textMuted }} 
          />
          <input
            type="text"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg pl-10 pr-4 py-2 text-sm"
            style={{ 
              backgroundColor: colors.backgroundAlt,
              borderColor: colors.border,
              color: colors.text,
            }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: colors.textMuted }} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{ 
              backgroundColor: colors.backgroundAlt,
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <option value="all">All Types</option>
            <option value="discord">Discord</option>
            <option value="telegram">Telegram</option>
            <option value="pokemon">Pokemon</option>
            <option value="preference">Preferences</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
        </div>
      ) : filteredMemories.length === 0 ? (
        <div 
          className="text-center py-20"
          style={{ color: colors.textMuted }}
        >
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No memories found</p>
        </div>
      ) : (
        /* Memories Grid */
        <div className="grid grid-cols-1 gap-4">
          {filteredMemories.map((memory) => {
            const TypeIcon = TYPE_ICONS[memory.type] || FileText;
            const typeColor = TYPE_COLORS[memory.type] || colors.primary;
            const isExpanded = expandedId === memory.id;
            
            return (
              <div
                key={memory.id}
                className="rounded-xl border overflow-hidden"
                style={{ 
                  backgroundColor: colors.backgroundAlt,
                  borderColor: isExpanded ? colors.primary : colors.border,
                }}
              >
                {/* Memory Header */}
                <div 
                  className="p-4 flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : memory.id)}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${typeColor}20` }}
                    >
                      <TypeIcon className="w-5 h-5" style={{ color: typeColor }} />
                    </div>
                    <div>
                      <h3 
                        className="font-bold"
                        style={{ color: colors.text }}
                      >
                        {memory.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                        {formatDate(memory.updatedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs px-2 py-1 rounded uppercase"
                      style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
                    >
                      {memory.type}
                    </span>
                  </div>
                </div>
                
                {/* Memory Content */}
                {isExpanded && (
                  <div 
                    className="px-4 pb-4 pt-0"
                    style={{ borderTopColor: colors.border }}
                  >
                    <div 
                      className="p-4 rounded-lg mt-0"
                      style={{ 
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      }}
                    >
                      <pre 
                        className="whitespace-pre-wrap text-sm"
                        style={{ color: colors.textDim, fontFamily: "inherit" }}
                      >
                        {memory.content}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
