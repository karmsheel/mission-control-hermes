"use client";

import { useState } from "react";
import { useTasks } from "@/lib/TaskContext";
import { X, Bot, User, Flag, Zap } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type Assignee = "user" | "hermes";
type Priority = "low" | "medium" | "high";

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<Assignee>("user");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  
  const { addTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      assignee,
      priority,
      status,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setAssignee("user");
    setPriority("medium");
    setStatus("todo");
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
            CREATE NEW TASK
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
            <label className="block text-sm text-slate-400 mb-2">TASK TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-green-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">DESCRIPTION (OPTIONAL)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-green-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">ASSIGN TO</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAssignee("user")}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all
                  ${assignee === "user" 
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
                onClick={() => setAssignee("hermes")}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all
                  ${assignee === "hermes" 
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

          {/* Priority */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              <Flag className="w-3 h-3 inline mr-1" />
              PRIORITY
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`
                    flex-1 py-2 rounded-lg border text-sm capitalize transition-all
                    ${priority === p 
                      ? p === "high" ? "bg-red-500/20 border-red-500 text-red-400"
                      : p === "medium" ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                      : "bg-slate-500/20 border-slate-500 text-slate-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    }
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">INITIAL STATUS</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-green-500 focus:outline-none transition-colors"
            >
              <option value="todo">📋 To Do</option>
              <option value="in_progress">⚡ In Progress</option>
              <option value="review">🔍 Review</option>
              <option value="done">✅ Done</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            CREATE TASK
          </button>
        </form>
      </div>
    </div>
  );
}