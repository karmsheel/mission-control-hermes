"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ScheduleType = "cron" | "one-time" | "interval";
export type ScheduleStatus = "pending" | "running" | "completed" | "cancelled";

export interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  type: ScheduleType;
  schedule: string; // cron expression, "30m", "2h", timestamp
  status: ScheduleStatus;
  deliver: string; // "origin", "telegram", "discord", "local"
  
  // Timing
  nextRun?: number;      // Next scheduled execution timestamp
  lastRun?: number;       // Last execution timestamp
  repeatCount?: number;   // How many times to repeat
  repeatDone?: number;   // How many times already run
  
  // Content
  prompt: string;         // The prompt/instructions for the task
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  
  // Source
  source: "user" | "hermes";
}

interface CalendarContextType {
  events: ScheduledEvent[];
  addEvent: (event: Omit<ScheduledEvent, "id" | "createdAt" | "updatedAt">) => void;
  updateEvent: (id: string, updates: Partial<ScheduledEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDay: (date: Date) => ScheduledEvent[];
  getEventsForMonth: (year: number, month: number) => ScheduledEvent[];
}

const CalendarContext = createContext<CalendarContextType | null>(null);

const STORAGE_KEY = "mission-control-schedule";

// Demo scheduled events
const INITIAL_EVENTS: ScheduledEvent[] = [
  {
    id: "event-1",
    title: "Daily Standup Reminder",
    description: "Remind team about daily standup meeting",
    type: "interval",
    schedule: "every 9h",
    status: "pending",
    deliver: "discord",
    nextRun: Date.now() + 9 * 60 * 60 * 1000, // 9 hours from now
    repeatCount: 999,
    prompt: "Send a reminder to the #general channel about the daily standup meeting starting in 15 minutes.",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    source: "user",
  },
  {
    id: "event-2",
    title: "Weekly Project Review",
    description: "Review progress on all hackathon tasks",
    type: "cron",
    schedule: "0 18 * * 5", // Every Friday at 6 PM
    status: "pending",
    deliver: "telegram",
    nextRun: getNextCronRun("0 18 * * 5"),
    repeatCount: 52,
    prompt: "Create a summary of all completed tasks this week and post to the team channel.",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    source: "hermes",
  },
  {
    id: "event-3",
    title: "Hackathon Submission Check",
    description: "Verify all deliverables are ready",
    type: "one-time",
    schedule: "2026-03-16T18:00:00", // Today 6 PM
    status: "pending",
    deliver: "origin",
    nextRun: new Date("2026-03-16T18:00:00").getTime(),
    prompt: "Check the content pipeline and verify all hackathon submission materials are in the 'Final' or 'Published' stage.",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    source: "hermes",
  },
  {
    id: "event-4",
    title: "Code Backup",
    description: "Backup project to GitHub",
    type: "interval",
    schedule: "every 2h",
    status: "running",
    deliver: "local",
    lastRun: Date.now() - 2 * 60 * 60 * 1000,
    nextRun: Date.now(),
    repeatCount: 100,
    repeatDone: 12,
    prompt: "Commit and push all changes to the GitHub repository with message 'Auto-backup'.",
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    source: "hermes",
  },
];

// Helper to calculate next cron run (simplified)
function getNextCronRun(cron: string): number {
  // Very simplified - in production use a proper cron parser
  const now = new Date();
  const [minute, hour, , , dayOfWeek] = cron.split(" ").map(Number);
  
  const next = new Date(now);
  next.setHours(hour || 0, minute || 0, 0, 0);
  
  // If time has passed this day, move to next occurrence
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  
  // If day of week specified, find next matching day
  if (dayOfWeek !== undefined && !isNaN(dayOfWeek)) {
    while (next.getDay() !== dayOfWeek) {
      next.setDate(next.getDate() + 1);
    }
  }
  
  return next.getTime();
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
        } else {
          setEvents(INITIAL_EVENTS);
        }
      } catch (e) {
        setEvents(INITIAL_EVENTS);
      }
    } else {
      setEvents(INITIAL_EVENTS);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events, loaded]);

  const addEvent = (event: Omit<ScheduledEvent, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const newEvent: ScheduledEvent = {
      ...event,
      id: `event-${now}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<ScheduledEvent>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...updates, updatedAt: Date.now() } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const getEventsForDay = (date: Date): ScheduledEvent[] => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      if (!event.nextRun) return false;
      return event.nextRun >= dayStart.getTime() && event.nextRun <= dayEnd.getTime();
    });
  };

  const getEventsForMonth = (year: number, month: number): ScheduledEvent[] => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return events.filter((event) => {
      if (!event.nextRun) return false;
      return event.nextRun >= monthStart.getTime() && event.nextRun <= monthEnd.getTime();
    });
  };

  return (
    <CalendarContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, getEventsForDay, getEventsForMonth }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}
