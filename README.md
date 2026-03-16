# Mission Control Dashboard

A real-time operational dashboard for Hermes Agent, built for the Nous Research Hackathon.

## 🏴‍☠️ Overview

Mission Control is a web-based dashboard that provides visibility into all Hermes Agent activities - from task management to content pipelines, scheduling, and agent health monitoring.

## 🎯 Features

### 1. Task Board (`/`)
- Kanban-style board with 4 columns: To Do, In Progress, Review, Done
- Drag-and-drop task management
- Assign tasks to "You" or "Hermes"
- Priority levels (low, medium, high)
- Real-time localStorage persistence

### 2. Content Pipeline (`/content`)
- 6-stage content workflow: Ideas → Outline → Draft → Review → Final → Published
- Rich content editing with tabs for:
  - 💡 Ideas & brainstorming
  - 📝 Outlines (markdown supported)
  - ✍️ Full scripts/content
  - 📎 Image attachments
- Content types: Video, Blog, Social, Podcast, Article, Other
- Search and filter by type/tags

### 3. Schedule Calendar (`/calendar`)
- Monthly calendar view with event indicators
- Event types: Cron jobs, One-time, Interval
- Event status: Pending, Running, Completed
- Source tracking (user vs hermes scheduled)
- Play/Pause/Delete controls

### 4. Agent Metrics (`/metrics`)
- Real-time CPU, Memory, API Latency monitoring
- Process status for all agent components
- Connected platforms status
- **Dynamic config reading** - pulls real values from `~/.hermes/config.yaml` and `~/.hermes/.env`

### 5. System Logs (`/logs`)
- Real-time log viewer
- Filter by level (INFO, WARN, ERROR, DEBUG)
- Search functionality
- Export capability

### 6. Connections (`/connections`)
- Integration status dashboard
- Webhook management
- API key status

### 7. Settings (`/settings`)
- **Theme Selection** - 4 unique themes with full color customization:
  - 🟢 **The Matrix** - Neon green digital reality
  - 🔥 **Charizard** - Fire orange/red
  - ⬛⬜ **Yin & Yang** - Black/white balance
  - 🌊 **Ocean Calm** - Blue/teal tranquility
- Model configuration
- Behavior settings (auto-save, notifications, verbose output)

## 🛠 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **State**: React Context + localStorage
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## 📁 Project Structure

```
mission-control/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx           # Task Board (home)
│   │   ├── globals.css        # Theme CSS + base styles
│   │   ├── content/          # Content Pipeline
│   │   │   ├── page.tsx
│   │   │   ├── ContentColumn.tsx
│   │   │   ├── ContentCard.tsx
│   │   │   ├── ContentEditor.tsx
│   │   │   └── CreateContentModal.tsx
│   │   ├── calendar/          # Schedule Calendar
│   │   │   └── page.tsx
│   │   ├── metrics/          # Agent Metrics
│   │   │   └── page.tsx
│   │   ├── logs/             # System Logs
│   │   │   └── page.tsx
│   │   ├── connections/      # Integrations
│   │   │   └── page.tsx
│   │   ├── settings/         # Configuration
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── config/       # Config API endpoint
│   │           └── route.ts
│   ├── components/
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   ├── TaskBoard.tsx     # Task kanban
│   │   ├── TaskColumn.tsx
│   │   ├── TaskCard.tsx
│   │   └── CreateTaskModal.tsx
│   └── lib/
│       ├── TaskContext.tsx   # Task state management
│       ├── ContentContext.tsx # Content pipeline state
│       ├── CalendarContext.tsx # Schedule state
│       ├── ThemeContext.tsx  # Theme management
│       └── ThemeColors.ts    # Theme definitions
├── public/
├── package.json
├── tailwind.config
└── next.config
```

## 🎨 Theme System

Themes are implemented via CSS variables and body classes. Each theme defines:

```typescript
interface ThemeColors {
  primary: string;      // Main accent color
  primaryDim: string;   // Dimmed primary
  secondary: string;    // Secondary accent
  background: string;  // Page background
  backgroundAlt: string; // Card backgrounds
  border: string;      // Border color
  text: string;        // Main text
  textDim: string;    // Dimmed text
  success: string;
  warning: string;
  error: string;
}
```

To add a new theme:
1. Add theme definition to `ThemeContext.tsx`
2. Add CSS overrides in `globals.css` with `body.theme-{name}` selector
3. Add theme option in Settings page

## 🔌 API Endpoints

### GET `/api/config`
Reads Hermes configuration from `~/.hermes/`:

```json
{
  "config": {
    "model": "minimax/minimax-m2.5",
    "provider": "openrouter",
    "maxTurns": "60",
    "memoryEnabled": true
  },
  "envVars": {
    "llmModel": "anthropic/claude-opus-4.6",
    "hasOpenRouter": true
  },
  "system": {
    "uptime": 5.36,
    "platform": "linux",
    "nodeVersion": "v22.22.0"
  }
}
```

## 🚀 Running the Project

```bash
cd mission-control
npm install
npm run dev
```

Access at: `http://localhost:3001`

## 💾 Data Storage

All data is stored in browser `localStorage`:
- Tasks: `mission-control-tasks`
- Content: `mission-control-content`
- Schedule: `mission-control-schedule`
- Theme: `mission-control-theme`

For production, consider migrating to Convex or another backend.

## 🎯 Design Decisions

### Why localStorage?
- Zero setup required
- Works offline
- Fast for demos
- Easy to export/import

### Why Context API?
- Simple state management
- No external dependencies
- Works well for this scale

### Theme Implementation
- CSS variables for runtime theme switching
- Body classes for CSS cascade overrides
- Per-theme custom properties for hover/focus states

## 🔜 Future Enhancements

1. **Convex Integration** - Real-time multi-user sync
2. **WebSocket Updates** - Live agent status
3. **More Themes** - Community theme gallery
4. **Export/Import** - Data portability
5. **Mobile Responsive** - Phone support
6. **Agent API** - Direct Hermes communication

---

Built with ❤️ by Hermes Agent for the Nous Research Hackathon
