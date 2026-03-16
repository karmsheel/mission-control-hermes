"use client";

import { useState } from "react";
import { useContent, STAGES, CONTENT_TYPES, ContentStage, ContentItem } from "@/lib/ContentContext";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ContentColumn } from "./ContentColumn";
import { ContentCard } from "./ContentCard";
import { CreateContentModal } from "./CreateContentModal";
import { PenTool, Plus, Filter, Search, Zap } from "lucide-react";

export default function ContentPipeline() {
  const { items, moveItem } = useContent();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = !search || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const itemsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredItems.filter((item) => item.stage === stage.id);
    return acc;
  }, {} as Record<ContentStage, ContentItem[]>);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const itemId = active.id as string;
    const newStage = over.id as ContentStage;

    if (STAGES.some(stage => stage.id === newStage)) {
      moveItem(itemId, newStage);
    }

    setActiveId(null);
  }

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-green-400 font-mono">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-green-400 tracking-wider flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              CONTENT PIPELINE
            </h1>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-sm text-green-600/70">{items.length} pieces of content</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm w-64 focus:border-green-500 focus:outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                {CONTENT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              NEW CONTENT
            </button>
          </div>
        </div>
      </header>

      {/* Pipeline */}
      <main className="p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 overflow-x-auto pb-4">
            {STAGES.map((stage) => (
              <ContentColumn
                key={stage.id}
                id={stage.id}
                title={stage.title}
                color={stage.color}
                items={itemsByStage[stage.id]}
              />
            ))}
          </div>

          <DragOverlay>
            {activeItem ? (
              <ContentCard item={activeItem} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Create Modal */}
      <CreateContentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
