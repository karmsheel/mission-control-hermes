"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTasks } from "@/lib/TaskContext";
import { useTheme } from "@/lib/DesignSystem";
import { GripVertical, Bot, User, Flag, Trash2 } from "lucide-react";
import { useState } from "react";

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

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityColors = {
  low: "text-slate-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

const priorityLabels = {
  low: "⬇",
  medium: "▶",
  high: "⬆",
};

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { deleteTask } = useTasks();
  const { colors } = useTheme();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this task?")) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-lg border p-3 
        hover:border transition-all duration-200
        ${isDragging ? "shadow-xl rotate-2 scale-105" : ""}
        cursor-grab active:cursor-grabbing
      `}
      onMouseEnter={() => {
        setShowActions(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setShowActions(false);
        setIsHovered(false);
      }}
      style={{
        ...style,
        backgroundColor: `${colors.backgroundAlt}cc`,
        borderColor: isHovered ? colors.primary : colors.border,
        boxShadow: isDragging ? `0 0 20px ${colors.primary}40` : undefined,
      }}
    >
      {/* Drag Handle & Actions */}
      <div className="flex items-center justify-between mb-2">
        <div 
          {...attributes} 
          {...listeners}
          className="flex items-center gap-1 cursor-grab"
          style={{ color: colors.textMuted }}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            <button 
              onClick={handleDelete}
              className="p-1 rounded transition-colors"
              style={{ 
                backgroundColor: `${colors.error}20`,
                color: colors.textMuted,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.error}30`;
                e.currentTarget.style.color = colors.error;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.error}20`;
                e.currentTarget.style.color = colors.textMuted;
              }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Task Content */}
      <h3 
        className="font-medium text-sm mb-2 line-clamp-2"
        style={{ color: colors.text }}
      >
        {task.title}
      </h3>

      {task.description && (
        <p 
          className="text-xs mb-3 line-clamp-2"
          style={{ color: colors.textMuted }}
        >
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div 
        className="flex items-center justify-between mt-auto pt-2 border-t"
        style={{ borderColor: colors.borderSubtle }}
      >
        <div className="flex items-center gap-2">
          {/* Assignee */}
          {task.assignee === "hermes" ? (
            <span 
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border"
              style={{ 
                backgroundColor: `${colors.success}20`,
                color: colors.success,
                borderColor: `${colors.success}30`,
              }}
            >
              <Bot className="w-3 h-3" /> Hermes
            </span>
          ) : (
            <span 
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border"
              style={{ 
                backgroundColor: `${colors.info}20`,
                color: colors.info,
                borderColor: `${colors.info}30`,
              }}
            >
              <User className="w-3 h-3" /> You
            </span>
          )}
        </div>

        {/* Priority */}
        {task.priority && (
          <div 
            className="flex items-center gap-1 text-xs"
            style={{ 
              color: task.priority === "high" ? colors.error : task.priority === "medium" ? colors.warning : colors.textMuted 
            }}
          >
            <Flag className="w-3 h-3" />
            {task.priority === "high" ? "⬆" : task.priority === "medium" ? "▶" : "⬇"}
          </div>
        )}
      </div>
    </div>
  );
}