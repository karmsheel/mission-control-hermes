"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { useTheme } from "@/lib/DesignSystem";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee: "user" | "hermes";
  priority?: "low" | "medium" | "high";
  createdAt: number;
  updatedAt: number;
}

interface TaskColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export function TaskColumn({ id, title, color, tasks }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });
  const { colors } = useTheme();

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-xl border-2 p-4 min-h-[500px] flex flex-col
        transition-colors duration-200
      `}
      style={{
        backgroundColor: `${colors.backgroundAlt}80`,
        borderColor: isOver ? colors.primary : colors.border,
      }}
    >
      {/* Column Header */}
      <div 
        className="flex items-center justify-between mb-4 pb-3 border-b"
        style={{ borderColor: colors.borderSubtle }}
      >
        <h2 
          className="font-bold text-sm tracking-wide flex items-center gap-2"
          style={{ color: colors.text }}
        >
          {title}
        </h2>
        <span 
          className="text-xs px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: colors.backgroundSubtle,
            color: colors.textMuted,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <SortableContext 
        items={tasks.map(t => t.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>

      {tasks.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: colors.textMuted }}>No tasks here</p>
        </div>
      )}
    </div>
  );
}