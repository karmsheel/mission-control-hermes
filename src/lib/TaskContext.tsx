"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type Assignee = "user" | "hermes";
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: Assignee;
  priority?: Priority;
  createdAt: number;
  updatedAt: number;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

const STORAGE_KEY = "mission-control-tasks";

// Initial tasks for demo
const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Set up Mission Control dashboard",
    description: "Initialize Next.js project with task board UI",
    status: "done",
    assignee: "hermes",
    priority: "high",
    createdAt: 1700000000000,
    updatedAt: 1700000000000
  },
  {
    id: "task-2",
    title: "Implement drag-and-drop for tasks",
    description: "Use @dnd-kit to enable moving tasks between columns",
    status: "done",
    assignee: "hermes",
    priority: "high",
    createdAt: 1700000001000,
    updatedAt: 1700000001000
  },
  {
    id: "task-3",
    title: "Add task creation modal",
    description: "Create a modal form to add new tasks with assignee selection",
    status: "in_progress",
    assignee: "hermes",
    priority: "medium",
    createdAt: 1700000002000,
    updatedAt: 1700000002000
  },
  {
    id: "task-4",
    title: "Build demo video for hackathon submission",
    description: "Record a short demo showing Mission Control features",
    status: "todo",
    assignee: "user",
    priority: "high",
    createdAt: 1700000003000,
    updatedAt: 1700000003000
  },
  {
    id: "task-5",
    title: "Add real-time sync with Convex",
    description: "Replace localStorage with Convex backend for multi-device sync",
    status: "todo",
    assignee: "hermes",
    priority: "medium",
    createdAt: 1700000004000,
    updatedAt: 1700000004000
  },
  {
    id: "task-6",
    title: "Write hackathon submission writeup",
    description: "Document the project features and creative aspects",
    status: "todo",
    assignee: "user",
    priority: "medium",
    createdAt: 1700000005000,
    updatedAt: 1700000005000
  }
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadInitialTasks = () => {
    setTasks(INITIAL_TASKS);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        } else {
          loadInitialTasks();
        }
      } catch (e) {
        console.error("Failed to load tasks:", e);
        loadInitialTasks();
      }
    } else {
      // Load initial tasks if no localStorage data
      loadInitialTasks();
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const newTask: Task = {
      ...task,
      id: `task-${now}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
}
