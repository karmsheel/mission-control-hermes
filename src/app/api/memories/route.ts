import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function GET() {
  try {
    const memories: Array<{ id: string; title: string; content: string; type: string; updatedAt: number }> = [];
    
    // Read from ~/.hermes/memories/
    const memoriesDir = path.join(os.homedir(), ".hermes", "memories");
    const memoriesFile = path.join(memoriesDir, "MEMORY.md");
    
    if (fs.existsSync(memoriesFile)) {
      const content = fs.readFileSync(memoriesFile, "utf-8");
      // Split by § (section separator)
      const sections = content.split("§").filter(s => s.trim());
      
      sections.forEach((section, index) => {
        const lines = section.trim().split("\n");
        const title = lines[0]?.trim() || `Memory ${index + 1}`;
        // Get everything after the title as content
        const body = lines.slice(1).join("\n").trim() || section.trim();
        
        // Determine type based on content
        let type = "general";
        if (title.toLowerCase().includes("discord")) type = "discord";
        else if (title.toLowerCase().includes("telegram")) type = "telegram";
        else if (title.toLowerCase().includes("pkm") || title.toLowerCase().includes("pokemon")) type = "pokemon";
        else if (title.toLowerCase().includes("preference")) type = "preference";
        
        memories.push({
          id: `memory-${index}`,
          title,
          content: body,
          type,
          updatedAt: Date.now() - (index * 3600000), // Stagger times
        });
      });
    }
    
    return NextResponse.json({ memories });
  } catch (error) {
    console.error("Error reading memories:", error);
    return NextResponse.json({ error: "Failed to load memories" }, { status: 500 });
  }
}
