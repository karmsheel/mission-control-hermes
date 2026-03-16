"use client";

import { createContext, useContext, useState, useEffect, ReactNode, CSSProperties } from "react";

export type ThemeName = "matrix" | "charizard" | "yin_yang" | "ocean_calm" | "sky_blue";

interface ThemeColors {
  // Core colors
  primary: string;
  primaryDim: string;
  secondary: string;
  
  // Backgrounds
  background: string;
  backgroundAlt: string;
  backgroundSubtle: string;
  
  // Borders
  border: string;
  borderSubtle: string;
  
  // Text
  text: string;
  textDim: string;
  textMuted: string;
  
  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeContextType {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
  
  // Design system utilities
  style: {
    card: (overrides?: CSSProperties) => CSSProperties;
    cardHover: (overrides?: CSSProperties) => CSSProperties;
    buttonPrimary: (overrides?: CSSProperties) => CSSProperties;
    buttonSecondary: (overrides?: CSSProperties) => CSSProperties;
    input: (overrides?: CSSProperties) => CSSProperties;
    badge: (variant?: "primary" | "secondary" | "success" | "warning" | "error", overrides?: CSSProperties) => CSSProperties;
    border: (overrides?: CSSProperties) => CSSProperties;
    text: (variant?: "primary" | "secondary" | "dim" | "muted", overrides?: CSSProperties) => CSSProperties;
    background: (variant?: "base" | "alt" | "subtle", overrides?: CSSProperties) => CSSProperties;
  };
  
  // Classes utility
  cn: (...classes: (string | undefined | false)[]) => string;
}

const THEMES: Record<ThemeName, ThemeColors> = {
  matrix: {
    primary: "#00ff41",
    primaryDim: "#00cc33",
    secondary: "#39ff14",
    background: "#0d0d0d",
    backgroundAlt: "#1a1a1a",
    backgroundSubtle: "#252525",
    border: "#003300",
    borderSubtle: "#1a3d1a",
    text: "#00ff41",
    textDim: "#00ff99",
    textMuted: "#339933",
    success: "#00ff41",
    warning: "#ffff00",
    error: "#ff3333",
    info: "#00ccff",
  },
  charizard: {
    primary: "#ff4500",
    primaryDim: "#dc143c",
    secondary: "#ffa500",
    background: "#1a0a05",
    backgroundAlt: "#2d1510",
    backgroundSubtle: "#3d2020",
    border: "#8b2500",
    borderSubtle: "#5c1a00",
    text: "#ffa500",
    textDim: "#ff8c00",
    textMuted: "#cc7000",
    success: "#00ff41",
    warning: "#ffd700",
    error: "#ff4500",
    info: "#87ceeb",
  },
  yin_yang: {
    primary: "#f5f5f5",
    primaryDim: "#c0c0c0",
    secondary: "#2a2a2a",
    background: "#0a0a0a",
    backgroundAlt: "#151515",
    backgroundSubtle: "#202020",
    border: "#333333",
    borderSubtle: "#444444",
    text: "#f5f5f5",
    textDim: "#e0e0e0",
    textMuted: "#808080",
    success: "#f5f5f5",
    warning: "#a0a0a0",
    error: "#ff6b6b",
    info: "#69c0ff",
  },
  ocean_calm: {
    primary: "#0891b2",
    primaryDim: "#0e7490",
    secondary: "#22d3ee",
    background: "#0c1929",
    backgroundAlt: "#132f4c",
    backgroundSubtle: "#1a3a5c",
    border: "#1e3a5f",
    borderSubtle: "#2a4a70",
    text: "#22d3ee",
    textDim: "#67e8f9",
    textMuted: "#0891b2",
    success: "#22d3ee",
    warning: "#fbbf24",
    error: "#f87171",
    info: "#67e8f9",
  },
  sky_blue: {
    primary: "#0066A1",
    primaryDim: "#005080",
    secondary: "#4A9DCA",
    background: "#FFFFFF",
    backgroundAlt: "#F5F9FC",
    backgroundSubtle: "#E8F1F7",
    border: "#0066A1",
    borderSubtle: "#B8D8E9",
    text: "#0066A1",
    textDim: "#4A9DCA",
    textMuted: "#7AB8D6",
    success: "#28A745",
    warning: "#FFC107",
    error: "#DC3545",
    info: "#B8D8E9",
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "mission-control-theme";

// Utility to combine classes
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("matrix");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES[stored as ThemeName]) {
      setThemeState(stored as ThemeName);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const colors = THEMES[theme];
    const root = document.documentElement;
    
    // Apply CSS variables for globals.css to use
    root.style.setProperty("--theme-primary", colors.primary);
    root.style.setProperty("--theme-primary-dim", colors.primaryDim);
    root.style.setProperty("--theme-secondary", colors.secondary);
    root.style.setProperty("--theme-background", colors.background);
    root.style.setProperty("--theme-background-alt", colors.backgroundAlt);
    root.style.setProperty("--theme-background-subtle", colors.backgroundSubtle);
    root.style.setProperty("--theme-border", colors.border);
    root.style.setProperty("--theme-border-subtle", colors.borderSubtle);
    root.style.setProperty("--theme-text", colors.text);
    root.style.setProperty("--theme-text-dim", colors.textDim);
    root.style.setProperty("--theme-text-muted", colors.textMuted);
    root.style.setProperty("--theme-success", colors.success);
    root.style.setProperty("--theme-warning", colors.warning);
    root.style.setProperty("--theme-error", colors.error);
    root.style.setProperty("--theme-info", colors.info);
    
    document.body.className = `theme-${theme}`;
    
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  const colors = THEMES[theme];

  // Create style helpers
  const style = {
    card: (overrides?: CSSProperties): CSSProperties => ({
      backgroundColor: colors.backgroundAlt,
      border: `1px solid ${colors.border}`,
      borderRadius: "0.75rem",
      padding: "1rem",
      ...overrides,
    }),
    
    cardHover: (overrides?: CSSProperties): CSSProperties => ({
      backgroundColor: colors.backgroundAlt,
      border: `1px solid ${colors.primary}`,
      borderRadius: "0.75rem",
      padding: "1rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      ...overrides,
    }),
    
    buttonPrimary: (overrides?: CSSProperties): CSSProperties => ({
      backgroundColor: colors.primary,
      color: "#000",
      border: "none",
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.15s ease",
      ...overrides,
    }),
    
    buttonSecondary: (overrides?: CSSProperties): CSSProperties => ({
      backgroundColor: colors.backgroundAlt,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem",
      cursor: "pointer",
      transition: "all 0.15s ease",
      ...overrides,
    }),
    
    input: (overrides?: CSSProperties): CSSProperties => ({
      backgroundColor: colors.backgroundAlt,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: "0.5rem",
      padding: "0.5rem 0.75rem",
      outline: "none",
      ...overrides,
    }),
    
    badge: (variant: "primary" | "secondary" | "success" | "warning" | "error" = "primary", overrides?: CSSProperties): CSSProperties => {
      const badgeColors: Record<string, { bg: string; text: string }> = {
        primary: { bg: `${colors.primary}20`, text: colors.primary },
        secondary: { bg: `${colors.secondary}20`, text: colors.secondary },
        success: { bg: `${colors.success}20`, text: colors.success },
        warning: { bg: `${colors.warning}20`, text: colors.warning },
        error: { bg: `${colors.error}20`, text: colors.error },
      };
      return {
        backgroundColor: badgeColors[variant].bg,
        color: badgeColors[variant].text,
        borderRadius: "0.25rem",
        padding: "0.125rem 0.5rem",
        fontSize: "0.75rem",
        fontWeight: 500,
        ...overrides,
      };
    },
    
    border: (overrides?: CSSProperties): CSSProperties => ({
      border: `1px solid ${colors.border}`,
      ...overrides,
    }),
    
    text: (variant: "primary" | "secondary" | "dim" | "muted" = "primary", overrides?: CSSProperties): CSSProperties => {
      const textColors: Record<string, string> = {
        primary: colors.text,
        secondary: colors.secondary,
        dim: colors.textDim,
        muted: colors.textMuted,
      };
      return {
        color: textColors[variant],
        ...overrides,
      };
    },
    
    background: (variant: "base" | "alt" | "subtle" = "base", overrides?: CSSProperties): CSSProperties => {
      const bgColors: Record<string, string> = {
        base: colors.background,
        alt: colors.backgroundAlt,
        subtle: colors.backgroundSubtle,
      };
      return {
        backgroundColor: bgColors[variant],
        ...overrides,
      };
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, style, cn }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Export cn for use in components
export { cn };
