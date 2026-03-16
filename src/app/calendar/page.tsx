"use client";

import { useState } from "react";
import { useCalendar, ScheduledEvent, ScheduleType } from "@/lib/CalendarContext";
import { useTheme } from "@/lib/DesignSystem";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Play,
  Pause,
  Trash2,
  Plus,
  Bot,
  User,
  Bell,
  RefreshCw,
  CalendarDays
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TYPE_ICONS: Record<ScheduleType, string> = {
  cron: "⏰",
  "one-time": "🎯",
  interval: "🔄",
};

const TYPE_LABELS: Record<ScheduleType, string> = {
  cron: "Cron Job",
  "one-time": "One-Time",
  interval: "Interval",
};

export default function CalendarPage() {
  const { events, deleteEvent, updateEvent, getEventsForDay } = useCalendar();
  const { colors } = useTheme();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week">("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push(daysInPrevMonth - i);
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
  // Next month days to fill the grid
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push(null);
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return day === selectedDate.getDate() && 
           month === selectedDate.getMonth() && 
           year === selectedDate.getFullYear();
  };

  const handleDayClick = (day: number | null) => {
    if (day) {
      setSelectedDate(new Date(year, month, day));
    }
  };

  const getEventsForDate = (day: number | null, isCurrentMonth: boolean) => {
    if (!day || !isCurrentMonth) return [];
    const date = new Date(year, month, day);
    return getEventsForDay(date);
  };

  const formatSchedule = (schedule: string, type: ScheduleType) => {
    if (type === "cron") {
      return `Cron: ${schedule}`;
    } else if (type === "interval") {
      return `Every ${schedule.replace("every ", "")}`;
    } else {
      return `At ${new Date(schedule).toLocaleString()}`;
    }
  };

  // Get selected date events
  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div 
      className="min-h-screen font-mono p-6"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6" style={{ color: colors.primary }} />
            <h1 
              className="text-2xl font-bold tracking-wider"
              style={{ color: colors.primary }}
            >
              SCHEDULE CALENDAR
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setView("month")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  view === "month" ? "bg-slate-700" : ""
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  view === "week" ? "bg-slate-700" : ""
                }`}
              >
                Week
              </button>
            </div>

            <button
              onClick={goToToday}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:border-green-500/50 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div 
            className="grid grid-cols-7 gap-1 mb-2"
            style={{ borderColor: colors.border }}
          >
            {DAYS.map((day) => (
              <div 
                key={day} 
                className="text-center text-sm font-bold py-2"
                style={{ color: colors.textDim }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div 
            className="grid grid-cols-7 gap-1"
            style={{ borderColor: colors.border }}
          >
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day !== null && index < firstDayOfMonth + daysInMonth && index >= firstDayOfMonth;
              const dayEvents = getEventsForDate(day, isCurrentMonth);
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative min-h-[80px] p-1 rounded-lg border cursor-pointer transition-all
                    ${!isCurrentMonth ? "opacity-30" : ""}
                    ${isToday(day) ? "border-2" : "border"}
                    ${isSelected(day) ? "bg-slate-800" : "hover:bg-slate-800/50"}
                  `}
                  style={{ 
                    borderColor: isToday(day) ? colors.primary : colors.border,
                    backgroundColor: isSelected(day) ? `${colors.primary}15` : undefined,
                  }}
                >
                  {day && (
                    <>
                      <span 
                        className={`text-sm font-bold ${
                          isToday(day) ? "w-6 h-6 rounded-full flex items-center justify-center" : ""
                        }`}
                        style={{ 
                          color: isToday(day) ? colors.primary : colors.text,
                          backgroundColor: isToday(day) ? `${colors.primary}20` : undefined,
                        }}
                      >
                        {day}
                      </span>
                      
                      {/* Event indicators */}
                      {hasEvents && (
                        <div className="mt-1 space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs truncate px-1 py-0.5 rounded"
                              style={{ 
                                backgroundColor: event.source === "hermes" ? `${colors.primary}20` : `${colors.secondary}20`,
                                color: colors.textDim,
                              }}
                            >
                              {TYPE_ICONS[event.type]} {event.title.substring(0, 15)}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs" style={{ color: colors.textDim }}>
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Selected Day Details */}
        <div 
          className="w-80 bg-slate-900/50 border rounded-xl p-4"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5" style={{ color: colors.primary }} />
            <h3 className="font-bold">
              {selectedDate 
                ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
                : "Select a day"
              }
            </h3>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="text-center py-8" style={{ color: colors.textDim }}>
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No events scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: `${colors.primary}10`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{TYPE_ICONS[event.type]}</span>
                      <span className="font-bold text-sm">{event.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {event.source === "hermes" ? (
                        <Bot className="w-3 h-3" style={{ color: colors.primary }} />
                      ) : (
                        <User className="w-3 h-3" style={{ color: colors.secondary }} />
                      )}
                    </div>
                  </div>

                  <div className="text-xs space-y-1" style={{ color: colors.textDim }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatSchedule(event.schedule, event.type)}
                    </div>
                    {event.description && (
                      <p className="truncate">{event.description}</p>
                    )}
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center justify-between mt-2">
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ 
                        backgroundColor: event.status === "running" ? `${colors.primary}20` : "rgba(100,100,100,0.2)",
                        color: event.status === "running" ? colors.primary : colors.textDim,
                      }}
                    >
                      {event.status.toUpperCase()}
                    </span>
                    
                    <div className="flex gap-1">
                      <button 
                        onClick={() => updateEvent(event.id, { status: event.status === "running" ? "pending" : "running" })}
                        className="p-1 hover:bg-slate-700 rounded"
                      >
                        {event.status === "running" ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Delete this scheduled event?")) {
                            deleteEvent(event.id);
                          }
                        }}
                        className="p-1 hover:bg-red-500/20 rounded text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          <div 
            className="mt-6 pt-4 border-t"
            style={{ borderColor: colors.border }}
          >
            <h4 className="text-sm font-bold mb-3">SUMMARY</h4>
            <div className="space-y-2 text-xs" style={{ color: colors.textDim }}>
              <div className="flex justify-between">
                <span>Total Events</span>
                <span style={{ color: colors.text }}>{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span style={{ color: colors.warning }}>{events.filter(e => e.status === "pending").length}</span>
              </div>
              <div className="flex justify-between">
                <span>Running</span>
                <span style={{ color: colors.primary }}>{events.filter(e => e.status === "running").length}</span>
              </div>
              <div className="flex justify-between">
                <span>Hermes Scheduled</span>
                <span style={{ color: colors.primary }}>{events.filter(e => e.source === "hermes").length}</span>
              </div>
              <div className="flex justify-between">
                <span>User Scheduled</span>
                <span style={{ color: colors.secondary }}>{events.filter(e => e.source === "user").length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
