#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { STTClient } from "@dtelecom/stt";

const PRIVATE_KEY = process.env.DTELECOM_PRIVATE_KEY;
const SERVICE_URL = process.env.DTELECOM_STT_URL || "https://x402stt.dtelecom.org";

function getClient(): STTClient {
  if (!PRIVATE_KEY) {
    throw new Error(
      "DTELECOM_PRIVATE_KEY environment variable is required. " +
        "Set it to your Ethereum private key (0x-prefixed hex string)."
    );
  }
  return new STTClient({ privateKey: PRIVATE_KEY, url: SERVICE_URL });
}

const server = new McpServer({
  name: "dtelecom-stt",
  version: "0.1.0",
});

// Tool: Transcribe a WAV file
server.tool(
  "transcribe_file",
  "Transcribe a WAV audio file to text using dTelecom STT. " +
    "The file must be PCM16, 16kHz, mono. " +
    "Convert with: ffmpeg -i input.mp3 -ar 16000 -ac 1 -acodec pcm_s16le output.wav",
  {
    path: z.string().describe("Absolute path to a WAV file (PCM16, 16kHz, mono)"),
    language: z
      .string()
      .default("en")
      .describe("Language code, e.g. en, ru, de, fr, es"),
    minutes: z
      .number()
      .default(5)
      .describe("Session duration in minutes (5-120). Billed at $0.005/min"),
  },
  async ({ path, language, minutes }) => {
    try {
      const client = getClient();
      const stream = await client
        .session({ minutes, language, autoExtend: true })
        .open();

      const results: string[] = [];
      try {
        for await (const t of stream.transcribeFile(path)) {
          const start = t.start != null ? `[${t.start.toFixed(1)}s]` : "";
          results.push(`${start} ${t.text}`.trim());
        }
      } finally {
        await stream.close();
      }

      if (results.length === 0) {
        return {
          content: [{ type: "text" as const, text: "No speech detected in the audio file." }],
        };
      }

      return {
        content: [{ type: "text" as const, text: results.join("\n") }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Transcription error: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get pricing info
server.tool(
  "stt_pricing",
  "Get current dTelecom STT pricing information. No payment required.",
  {},
  async () => {
    try {
      const client = getClient();
      const info = await client.pricing();
      return {
        content: [
          {
            type: "text" as const,
            text: [
              `Price: $${info.pricePerMinuteUsd}/min`,
              `Minimum: ${info.minMinutes} minutes ($${info.minPriceUsd})`,
              `Maximum: ${info.maxMinutes} minutes`,
              `Currency: ${info.currency} on ${info.network}`,
            ].join("\n"),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Check service health
server.tool(
  "stt_health",
  "Check if the dTelecom STT service is running and healthy.",
  {},
  async () => {
    try {
      const client = getClient();
      const data = await client.health();
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(data, null, 2) },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Service unreachable: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("dTelecom STT MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
