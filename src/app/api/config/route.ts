import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function GET() {
  try {
    const hermesDir = path.join(os.homedir(), ".hermes");
    const configPath = path.join(hermesDir, "config.yaml");
    const envPath = path.join(hermesDir, ".env");

    let config: Record<string, any> = {};
    let envVars: Record<string, string | boolean> = {};

    // Read config.yaml
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, "utf-8");
      // Simple YAML parser for our specific config
      const modelMatch = configContent.match(/model:\s*\n\s+default:\s*(.+)/);
      const providerMatch = configContent.match(/model:\s*\n\s+provider:\s*(.+)/);
      const baseUrlMatch = configContent.match(/model:\s*\n\s+base_url:\s*(.+)/);
      
      config = {
        model: modelMatch ? modelMatch[1].trim() : "unknown",
        provider: providerMatch ? providerMatch[1].trim() : "unknown",
        baseUrl: baseUrlMatch ? baseUrlMatch[1].trim() : "",
        maxTurns: configContent.match(/max_turns:\s*(\d+)/)?.[1] || "60",
        memoryEnabled: configContent.includes("memory_enabled: true"),
        toolExecutionTimeout: configContent.match(/timeout:\s*(\d+)/)?.[1] || "180",
      };
    }

    // Read .env (only public-safe values)
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      
      // Extract LLM_MODEL
      const llmMatch = envContent.match(/LLM_MODEL=(.+)/m);
      if (llmMatch) {
        envVars.llmModel = llmMatch[1].trim();
      }

      // Check which providers are configured
      envVars.hasOpenRouter = envContent.includes("OPENROUTER_API_KEY") && !envContent.includes("OPENROUTER_API_KEY=***");
      envVars.hasAnthropic = envContent.includes("ANTHROPIC_API_KEY") && !envContent.includes("ANTHROPIC_API_KEY=***");
      envVars.hasOpenAI = envContent.includes("OPENAI_API_KEY") && !envContent.includes("OPENAI_API_KEY=***");
    }

    // Get system stats (simulated for demo - real would need backend)
    const stats = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      platform: os.platform(),
      nodeVersion: process.version,
    };

    return NextResponse.json({
      config,
      envVars,
      system: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error reading config:", error);
    return NextResponse.json(
      { error: "Failed to read Hermes configuration" },
      { status: 500 }
    );
  }
}
