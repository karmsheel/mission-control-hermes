"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContent, ContentItem, CONTENT_TYPES } from "@/lib/ContentContext";
import { useTheme } from "@/lib/DesignSystem";
import { ContentEditor } from "./ContentEditor";
import { GripVertical, Trash2, Edit2, Tag, Paperclip, Bot, User, Eye } from "lucide-react";

interface ContentCardProps {
  item: ContentItem;
  isDragging?: boolean;
}

const typeIcons: Record<string, string> = {
  video: "🎬",
  blog: "📄",
  social: "📱",
  podcast: "🎙️",
  article: "📰",
  other: "📦",
};

export function ContentCard({ item, isDragging = false }: ContentCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { deleteItem } = useContent();
  const { colors } = useTheme();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this content?")) {
      deleteItem(item.id);
    }
  };

  const typeInfo = CONTENT_TYPES.find(t => t.id === item.type) || CONTENT_TYPES[5];

  if (isEditing) {
    return <ContentEditor item={item} onClose={() => setIsEditing(false)} />;
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-lg border p-3 
        hover:border transition-all duration-200 cursor-pointer
        ${isDragging ? "shadow-xl rotate-2 scale-105" : ""}
      `}
      onMouseEnter={() => {
        setShowActions(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setShowActions(false);
        setIsHovered(false);
      }}
      onClick={() => setIsEditing(true)}
      style={{
        ...style,
        backgroundColor: `${colors.backgroundAlt}cc`,
        borderColor: isHovered ? colors.primary : colors.border,
        boxShadow: isDragging ? `0 0 20px ${colors.primary}40` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeIcons[item.type]}</span>
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" style={{ color: colors.textMuted }} />
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-1 rounded transition-colors"
              style={{ 
                backgroundColor: `${colors.success}20`,
                color: colors.textMuted,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.success}30`;
                e.currentTarget.style.color = colors.success;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.success}20`;
                e.currentTarget.style.color = colors.textMuted;
              }}
            >
              <Edit2 className="w-3 h-3" />
            </button>
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

      {/* Title */}
      <h3 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: colors.text }}>
        {item.title}
      </h3>

      {/* Description */}
      {item.description && (
        <p className="text-xs mb-2 line-clamp-2" style={{ color: colors.textMuted }}>
          {item.description}
        </p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ 
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
              }}
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs" style={{ color: colors.textMuted }}>+{item.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Attachments indicator */}
      {item.attachments.length > 0 && (
        <div className="flex items-center gap-1 text-xs mb-2" style={{ color: colors.textMuted }}>
          <Paperclip className="w-3 h-3" />
          <span>{item.attachments.length} attachment{item.attachments.length > 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Footer */}
      <div 
        className="flex items-center justify-between pt-2 border-t"
        style={{ borderColor: colors.borderSubtle }}
      >
        <div className="flex items-center gap-2">
          {item.assignee === "hermes" ? (
            <span 
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
              style={{ 
                backgroundColor: `${colors.success}20`,
                color: colors.success,
              }}
            >
              <Bot className="w-2.5 h-2.5" /> Hermes
            </span>
          ) : (
            <span 
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
              style={{ 
                backgroundColor: `${colors.info}20`,
                color: colors.info,
              }}
            >
              <User className="w-2.5 h-2.5" /> You
            </span>
          )}
        </div>

        {/* Content indicators */}
        <div className="flex items-center gap-2 text-xs" style={{ color: colors.textMuted }}>
          {item.idea && <span title="Has idea">💡</span>}
          {item.outline && <span title="Has outline">📝</span>}
          {item.script && <span title="Has script">✍️</span>}
        </div>
      </div>

      {/* Click to edit hint */}
      {showActions && (
        <div 
          className="mt-2 pt-2 border-t flex items-center justify-center gap-1 text-xs"
          style={{ 
            borderColor: `${colors.borderSubtle}50`,
            color: colors.textMuted,
          }}
        >
          <Eye className="w-3 h-3" />
          <span>Click to edit</span>
        </div>
      )}
    </div>
  );
}
