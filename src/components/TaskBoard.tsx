"use client";

import { useState } from "react";
import { useTasks } from "@/lib/TaskContext";
import { useTheme } from "@/lib/DesignSystem";
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
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";
import { Terminal, Zap, Shield, Cpu } from "lucide-react";

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type Assignee = "user" | "hermes";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: Assignee;
  priority?: "low" | "medium" | "high";
  createdAt: number;
  updatedAt: number;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "📋 To Do", color: "border-yellow-500" },
  { id: "in_progress", title: "⚡ In Progress", color: "border-blue-500" },
  { id: "review", title: "🔍 Review", color: "border-purple-500" },
  { id: "done", title: "✅ Done", color: "border-green-500" },
];

export default function TaskBoard() {
  const { tasks, moveTask } = useTasks();
  const { colors } = useTheme();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((task: Task) => task.status === col.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    if (COLUMNS.some(col => col.id === newStatus)) {
      moveTask(taskId, newStatus);
    }

    setActiveId(null);
  }

  const activeTask = activeId ? tasks.find((t: Task) => t.id === activeId) : null;

  return (
    <div className="min-h-screen font-mono" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Compact Header */}
      <header 
        className="border-b sticky top-0 z-50"
        style={{ 
          backgroundColor: `${colors.backgroundAlt}80`,
          borderColor: colors.borderSubtle,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-wider" style={{ color: colors.primary }}>
              TASK BOARD
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span 
                className="px-2 py-1 rounded border"
                style={{ 
                  backgroundColor: `${colors.backgroundAlt}`,
                  borderColor: `${colors.primary}30`,
                  color: colors.textDim,
                }}
              >
                🤖 HERMES
              </span>
              <span 
                className="px-2 py-1 rounded border"
                style={{ 
                  backgroundColor: `${colors.backgroundAlt}`,
                  borderColor: `${colors.info}30`,
                  color: colors.textDim,
                }}
              >
                👤 YOU
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: colors.primary, 
                color: colors.background,
              }}
            >
              <Zap className="w-4 h-4" />
              NEW TASK
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div 
        className="border-b"
        style={{ 
          backgroundColor: `${colors.backgroundAlt}50`,
          borderColor: colors.borderSubtle,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span style={{ color: colors.success }}>●</span>
            <span>MEMORY:</span>
            <span style={{ color: colors.textDim, fontWeight: "bold" }}>{tasks.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: colors.warning }}>●</span>
            <span>ACTIVE:</span>
            <span style={{ color: colors.textDim, fontWeight: "bold" }}>{tasksByStatus.todo.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: colors.info }}>●</span>
            <span>PROCESSING:</span>
            <span style={{ color: colors.textDim, fontWeight: "bold" }}>{tasksByStatus.in_progress.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: colors.secondary }}>●</span>
            <span>SEARCH:</span>
            <span style={{ color: colors.textDim, fontWeight: "bold" }}>{tasksByStatus.review.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: colors.success }}>●</span>
            <span>ARCHIVED:</span>
            <span style={{ color: colors.textDim, fontWeight: "bold" }}>{tasksByStatus.done.length}</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto p-6 pb-24">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-4 gap-4">
            {COLUMNS.map((column) => (
              <TaskColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={tasksByStatus[column.id]}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Footer - Always at absolute bottom, accounts for sidebar */}
      <footer 
        className="fixed bottom-0 left-16 right-0 py-2 px-4 backdrop-blur-sm"
        style={{ 
          backgroundColor: `${colors.background}ee`,
          borderTop: `1px solid ${colors.borderSubtle}`,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4" style={{ color: colors.textMuted }}>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" style={{ color: colors.textMuted }} /> SYSTEM ONLINE
            </span>
            <span>STORAGE: LOCAL</span>
          </div>
          <div style={{ color: colors.textMuted }}>
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </footer>

      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}