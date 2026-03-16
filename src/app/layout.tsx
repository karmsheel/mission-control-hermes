import "./globals.css";
import { TaskProvider } from "@/lib/TaskContext";
import { ContentProvider } from "@/lib/ContentContext";
import { CalendarProvider } from "@/lib/CalendarContext";
import { ThemeProvider } from "@/lib/DesignSystem";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "Mission Control | Hermes Hackathon",
  description: "Task tracking dashboard for Hermes Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 theme-matrix">
        <ThemeProvider>
          <CalendarProvider>
            <TaskProvider>
              <ContentProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <main className="flex-1 ml-16">
                    {children}
                  </main>
                </div>
              </ContentProvider>
            </TaskProvider>
          </CalendarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
