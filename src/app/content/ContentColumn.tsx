"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ContentCard } from "./ContentCard";
import { ContentItem } from "@/lib/ContentContext";
import { useTheme } from "@/lib/DesignSystem";

interface ContentColumnProps {
  id: string;
  title: string;
  color: string;
  items: ContentItem[];
}

export function ContentColumn({ id, title, color, items }: ContentColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { colors } = useTheme();

  return (
    <div
      ref={setNodeRef}
      className={`
        min-w-[280px] w-[280px] rounded-xl border-2 p-3 flex flex-col
        transition-colors duration-200
      `}
      style={{
        backgroundColor: `${colors.backgroundAlt}80`,
        borderColor: isOver ? colors.primary : colors.border,
      }}
    >
      {/* Column Header */}
      <div 
        className="flex items-center justify-between mb-3 pb-2 border-b"
        style={{ borderColor: colors.borderSubtle }}
      >
        <h2 className="font-bold text-sm tracking-wide" style={{ color: colors.text }}>
          {title}
        </h2>
        <span 
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ 
            backgroundColor: colors.backgroundSubtle,
            color: colors.textMuted,
          }}
        >
          {items.length}
        </span>
      </div>

      {/* Items */}
      <SortableContext 
        items={items.map(item => item.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>

      {items.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-sm" style={{ color: colors.textMuted }}>No content here</p>
        </div>
      )}
    </div>
  );
}
