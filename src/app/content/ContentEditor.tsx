"use client";

import { useState } from "react";
import { useContent, ContentItem, ContentStage, ContentType, STAGES, CONTENT_TYPES } from "@/lib/ContentContext";
import { useTheme } from "@/lib/DesignSystem";
import { X, Save, Tag, Paperclip, Image, Trash2, ArrowRight, Bot, User } from "lucide-react";

interface ContentEditorProps {
  item: ContentItem;
  onClose: () => void;
}

type Tab = "idea" | "outline" | "script" | "attachments";

export function ContentEditor({ item, onClose }: ContentEditorProps) {
  const { updateItem, addAttachment, removeAttachment } = useContent();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("idea");
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || "",
    type: item.type,
    stage: item.stage,
    idea: item.idea || "",
    outline: item.outline || "",
    script: item.script || "",
    tags: item.tags.join(", "),
    assignee: item.assignee,
  });

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "idea", label: "💡 Idea", icon: "💡" },
    { id: "outline", label: "📝 Outline", icon: "📝" },
    { id: "script", label: "✍️ Script", icon: "✍️" },
    { id: "attachments", label: "📎 Attachments", icon: "📎" },
  ];

  const handleSave = () => {
    updateItem(item.id, {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type as any,
      stage: formData.stage as ContentStage,
      idea: formData.idea || undefined,
      outline: formData.outline || undefined,
      script: formData.script || undefined,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      assignee: formData.assignee as "user" | "hermes",
    });
    onClose();
  };

  const handleAddAttachment = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      addAttachment(item.id, {
        name: url.split("/").pop() || "attachment",
        url,
        type: "image",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: `${colors.background}ea` }}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        style={{ 
          backgroundColor: colors.backgroundAlt,
          border: `2px solid ${colors.primary}80`,
          boxShadow: `0 0 40px ${colors.primary}30`,
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.borderSubtle }}
        >
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-xl font-bold bg-transparent border-none focus:outline-none flex-1"
            style={{ color: colors.primary }}
            placeholder="Content Title"
          />
          <button 
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundSubtle}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta row */}
        <div 
          className="flex items-center gap-4 p-4 border-b"
          style={{ 
            backgroundColor: `${colors.backgroundSubtle}50`,
            borderColor: colors.borderSubtle,
          }}
        >
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentType })}
            className="rounded-lg px-3 py-2 text-sm"
            style={{ 
              backgroundColor: colors.backgroundAlt,
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
            ))}
          </select>

          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value as ContentStage })}
            className="rounded-lg px-3 py-2 text-sm"
            style={{ 
              backgroundColor: colors.backgroundAlt,
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          >
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>{stage.icon} {stage.title}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, assignee: "user" })}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition-all"
              style={{ 
                backgroundColor: formData.assignee === "user" ? `${colors.info}20` : colors.backgroundAlt,
                borderColor: formData.assignee === "user" ? colors.info : colors.border,
                color: formData.assignee === "user" ? colors.info : colors.textMuted,
              }}
            >
              <User className="w-4 h-4" /> You
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, assignee: "hermes" })}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition-all"
              style={{ 
                backgroundColor: formData.assignee === "hermes" ? `${colors.success}20` : colors.backgroundAlt,
                borderColor: formData.assignee === "hermes" ? colors.success : colors.border,
                color: formData.assignee === "hermes" ? colors.success : colors.textMuted,
              }}
            >
              <Bot className="w-4 h-4" /> Hermes
            </button>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <Tag className="w-4 h-4" style={{ color: colors.textMuted }} />
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Tags (comma separated)"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ 
                backgroundColor: colors.backgroundAlt,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: colors.borderSubtle }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 text-sm font-medium transition-colors"
              style={{
                color: activeTab === tab.id ? colors.primary : colors.textMuted,
                borderBottom: activeTab === tab.id ? `2px solid ${colors.primary}` : "2px solid transparent",
                backgroundColor: activeTab === tab.id ? `${colors.primary}08` : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]" style={{ color: colors.text }}>
          {activeTab === "idea" && (
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textMuted }}>IDEAS & BRAINSTORMING</label>
              <textarea
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                placeholder="Write your initial ideas, concepts, brainstorms..."
                rows={10}
                className="w-full rounded-lg px-4 py-3 placeholder focus:outline-none resize-none font-mono text-sm"
                style={{ 
                  backgroundColor: colors.backgroundAlt,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              />
            </div>
          )}

          {activeTab === "outline" && (
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textMuted }}>OUTLINE / STRUCTURE</label>
              <textarea
                value={formData.outline}
                onChange={(e) => setFormData({ ...formData, outline: e.target.value })}
                placeholder="Create your outline structure, bullet points, sections..."
                rows={10}
                className="w-full rounded-lg px-4 py-3 placeholder focus:outline-none resize-none font-mono text-sm"
                style={{ 
                  backgroundColor: colors.backgroundAlt,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              />
              <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
                💡 Tip: Use markdown (# Heading, ## Subheading, - Bullet points)
              </p>
            </div>
          )}

          {activeTab === "script" && (
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textMuted }}>FULL SCRIPT / CONTENT</label>
              <textarea
                value={formData.script}
                onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                placeholder="Write your complete script, article, post..."
                rows={15}
                className="w-full rounded-lg px-4 py-3 placeholder focus:outline-none resize-none font-mono text-sm"
                style={{ 
                  backgroundColor: colors.backgroundAlt,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              />
            </div>
          )}

          {activeTab === "attachments" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm" style={{ color: colors.textMuted }}>ATTACHMENTS & IMAGES</label>
                <button
                  onClick={handleAddAttachment}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: colors.background,
                  }}
                >
                  <Image className="w-4 h-4" />
                  Add Image
                </button>
              </div>

              {item.attachments.length === 0 ? (
                <div className="text-center py-8" style={{ color: colors.textMuted }}>
                  <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" style={{ color: colors.textMuted }} />
                  <p>No attachments yet</p>
                  <p className="text-sm">Add images, reference docs, or other files</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {item.attachments.map((att) => (
                    <div key={att.id} className="relative group">
                      {att.type === "image" ? (
                        <img 
                          src={att.url} 
                          alt={att.name}
                          className="w-full h-32 object-cover rounded-lg"
                          style={{ border: `1px solid ${colors.border}` }}
                        />
                      ) : (
                        <div 
                          className="w-full h-32 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: colors.backgroundAlt,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          <Paperclip className="w-8 h-8" style={{ color: colors.textMuted }} />
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(item.id, att.id)}
                        className="absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: colors.error }}
                      >
                        <Trash2 className="w-3 h-3" style={{ color: colors.background }} />
                      </button>
                      <p className="text-xs mt-1 truncate" style={{ color: colors.textMuted }}>{att.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <div 
                className="mt-4 p-3 rounded-lg border"
                style={{ 
                  backgroundColor: `${colors.backgroundSubtle}50`,
                  borderColor: colors.border,
                }}
              >
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  <strong style={{ color: colors.text }}>Tip:</strong> You can also paste images directly into the script tab using Ctrl+V!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between p-4 border-t"
          style={{ 
            backgroundColor: `${colors.backgroundSubtle}30`,
            borderColor: colors.borderSubtle,
          }}
        >
          <div className="text-xs" style={{ color: colors.textMuted }}>
            Created: {new Date(item.createdAt).toLocaleDateString()} | 
            Updated: {new Date(item.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: colors.backgroundAlt,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: colors.primary, 
                color: colors.background,
              }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
