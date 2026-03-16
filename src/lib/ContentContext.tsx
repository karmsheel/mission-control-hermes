"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ContentStage = "idea" | "outline" | "draft" | "review" | "final" | "published";
export type ContentType = "video" | "blog" | "social" | "podcast" | "article" | "other";

export interface ContentAttachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "document" | "other";
  createdAt: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  stage: ContentStage;
  
  // Content fields
  idea?: string;           // Raw idea/brainstorm
  outline?: string;        // Structured outline (JSON or markdown)
  script?: string;        // Full script/content
  
  // Metadata
  tags: string[];
  attachments: ContentAttachment[];
  
  // Dates
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  publishedAt?: number;
  
  // Assignees
  assignee: "user" | "hermes";
}

interface ContentContextType {
  items: ContentItem[];
  addItem: (item: Omit<ContentItem, "id" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteItem: (id: string) => void;
  moveItem: (itemId: string, newStage: ContentStage) => void;
  addAttachment: (itemId: string, attachment: Omit<ContentAttachment, "id" | "createdAt">) => void;
  removeAttachment: (itemId: string, attachmentId: string) => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

const STORAGE_KEY = "mission-control-content";

// Initial demo content
const INITIAL_CONTENT: ContentItem[] = [
  {
    id: "content-1",
    title: "Hackathon Demo Video",
    description: "60-second demo of Mission Control dashboard",
    type: "video",
    stage: "draft",
    idea: "Create a quick demo video showing:\n- Task board with drag-and-drop\n- Agent metrics dashboard\n- Real-time updates\n- Terminal aesthetic",
    outline: "## Demo Script\n\n1. Intro (5s) - \"Welcome to Mission Control...\"\n2. Task Board (20s) - Show kanban, drag a task\n3. Metrics (20s) - Show live CPU/memory, real config\n4. Outro (15s) - \"Built with Hermes Agent\"",
    script: `# Hackathon Demo Script\n\n[INTRO - 5 seconds]\n\"Hey everyone! Welcome to Mission Control - a real-time dashboard for Hermes Agent, built entirely by AI!\"\n\n[TASK BOARD - 20 seconds]\n\"Here's our task board. We can create tasks, assign them to me or you, set priorities, and drag-and-drop between stages.\"\n\n[METRICS - 20 seconds]\n\"And here's the metrics page - it pulls real data from our Hermes config. Check it out - that's the actual model we're using!\"\n\n[OUTRO - 15 seconds]\n\"This entire application - from concept to code - was built in real-time collaboration with Hermes Agent. Thanks for watching!\"`,
    tags: ["hackathon", "demo", "video"],
    attachments: [],
    assignee: "hermes",
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: "content-2", 
    title: "Blog: Building with AI Agents",
    description: "Technical blog post about the hackathon project",
    type: "blog",
    stage: "idea",
    idea: "Write about:\n- How Hermes Agent built the dashboard\n- The tech stack (Next.js, Tailwind, localStorage)\n- Real-time config reading\n- Future possibilities",
    tags: ["blog", "technical", "AI"],
    attachments: [],
    assignee: "user",
    createdAt: 1700000001000,
    updatedAt: 1700000001000,
  },
  {
    id: "content-3",
    title: "Twitter Thread - Hackathon",
    description: "Announcement and updates about the project",
    type: "social",
    stage: "final",
    idea: "Thread ideas:\n1. Announce we're building\n2. Show progress pics\n3. Tease the demo\n4. Post-submission celebration",
    outline: "1/ We're building Mission Control with @HermesAgent! 🏴‍☠️\n\n2/ A real-time dashboard for agent health & task tracking\n\n3/ The AI writes code WHILE we chat - wild, right?\n\n4/ Stay tuned for the demo... 🚀",
    tags: ["twitter", "announcement", "hackathon"],
    attachments: [],
    assignee: "hermes",
    createdAt: 1700000002000,
    updatedAt: 1700000002000,
  },
  {
    id: "content-4",
    title: "Podcast Intro Script",
    description: "Script for podcast episode introduction",
    type: "podcast",
    stage: "outline",
    idea: "Create an intro for a podcast where we discuss AI agents and the future of coding",
    outline: "## Podcast Intro\n\n- Welcome listeners\n- Introduce the concept of AI agents\n- Preview what we'll build today\n- Call to action for questions",
    tags: ["podcast", "intro", "script"],
    attachments: [],
    assignee: "user",
    createdAt: 1700000003000,
    updatedAt: 1700000003000,
  },
];

export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          setItems(INITIAL_CONTENT);
        }
      } catch (e) {
        setItems(INITIAL_CONTENT);
      }
    } else {
      setItems(INITIAL_CONTENT);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = (item: Omit<ContentItem, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const newItem: ContentItem = {
      ...item,
      id: `content-${now}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ContentItem>) => {
    setItems((prev) =>
      prev.map((item) => 
        item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveItem = (itemId: string, newStage: ContentStage) => {
    updateItem(itemId, { stage: newStage });
  };

  const addAttachment = (itemId: string, attachment: Omit<ContentAttachment, "id" | "createdAt">) => {
    const newAttachment: ContentAttachment = {
      ...attachment,
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, attachments: [...item.attachments, newAttachment], updatedAt: Date.now() }
          : item
      )
    );
  };

  const removeAttachment = (itemId: string, attachmentId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { 
              ...item, 
              attachments: item.attachments.filter((a) => a.id !== attachmentId),
              updatedAt: Date.now()
            }
          : item
      )
    );
  };

  return (
    <ContentContext.Provider value={{ 
      items, 
      addItem, 
      updateItem, 
      deleteItem, 
      moveItem,
      addAttachment,
      removeAttachment
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
}

// Stage configurations
export const STAGES: { id: ContentStage; title: string; color: string; icon: string }[] = [
  { id: "idea", title: "💡 Ideas", color: "border-yellow-500", icon: "💡" },
  { id: "outline", title: "📝 Outline", color: "border-blue-500", icon: "📝" },
  { id: "draft", title: "✍️ Draft", color: "border-purple-500", icon: "✍️" },
  { id: "review", title: "🔍 Review", color: "border-orange-500", icon: "🔍" },
  { id: "final", title: "✨ Final", color: "border-green-500", icon: "✨" },
  { id: "published", title: "🚀 Published", color: "border-cyan-500", icon: "🚀" },
];

export const CONTENT_TYPES: { id: ContentType; label: string; icon: string }[] = [
  { id: "video", label: "Video", icon: "🎬" },
  { id: "blog", label: "Blog Post", icon: "📄" },
  { id: "social", label: "Social Media", icon: "📱" },
  { id: "podcast", label: "Podcast", icon: "🎙️" },
  { id: "article", label: "Article", icon: "📰" },
  { id: "other", label: "Other", icon: "📦" },
];
