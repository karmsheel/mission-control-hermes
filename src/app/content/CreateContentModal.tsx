"use client";

import { useState } from "react";
import { useContent, ContentStage, STAGES, CONTENT_TYPES, ContentType } from "@/lib/ContentContext";
import { X, Zap, Bot, User } from "lucide-react";

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateContentModal({ isOpen, onClose }: CreateContentModalProps) {
  const { addItem } = useContent();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video" as ContentType,
    stage: "idea" as ContentStage,
    tags: "",
    assignee: "user" as "user" | "hermes",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addItem({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      stage: formData.stage,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      attachments: [],
      assignee: formData.assignee,
    });

    setFormData({
      title: "",
      description: "",
      type: "video",
      stage: "idea",
      tags: "",
      assignee: "user",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border-2 border-green-500/50 rounded-xl w-full max-w-md p-6 shadow-2xl shadow-green-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            NEW CONTENT
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">TITLE *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Content title..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-green-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-green-500 focus:outline-none resize-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">TYPE</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentType })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-green-500 focus:outline-none"
            >
              {CONTENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
              ))}
            </select>
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">STARTING STAGE</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as ContentStage })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-green-500 focus:outline-none"
            >
              {STAGES.slice(0, 4).map((stage) => (
                <option key={stage.id} value={stage.id}>{stage.icon} {stage.title.replace(/[💡📝✍️🔍✨]/, "").trim()}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">TAGS</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="hackathon, demo, video (comma separated)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">ASSIGN TO</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, assignee: "user" })}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all
                  ${formData.assignee === "user" 
                    ? "bg-blue-500/20 border-blue-500 text-blue-400" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                  }
                `}
              >
                <User className="w-4 h-4" />
                You
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, assignee: "hermes" })}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all
                  ${formData.assignee === "hermes" 
                    ? "bg-green-500/20 border-green-500 text-green-400" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                  }
                `}
              >
                <Bot className="w-4 h-4" />
                Hermes
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formData.title.trim()}
            className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            CREATE CONTENT
          </button>
        </form>
      </div>
    </div>
  );
}
