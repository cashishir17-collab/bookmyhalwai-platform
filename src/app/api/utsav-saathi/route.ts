import { NextRequest, NextResponse } from "next/server";
import {
  buildUtsavSystemInstruction,
  getUtsavFallbackAnswer,
  type UtsavVendorContext,
} from "@/lib/utsavSaathi";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message?: string;
  history?: ChatMessage[];
  vendor?: Partial<UtsavVendorContext>;
}

interface RateEntry {
  count: number;
  resetAt: number;
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 20;
const rateEntries = new Map<string, RateEntry>();

function rateLimited(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = rateEntries.get(ip);

  if (!current || current.resetAt <= now) {
    rateEntries.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT;
}

function isVerifiedVendor(value: ChatRequestBody["vendor"]): value is UtsavVendorContext {
  return Boolean(
    value?.verified === true &&
      typeof value.businessName === "string" &&
      value.businessName.trim() &&
      typeof value.ownerName === "string" &&
      typeof value.category === "string" &&
      typeof value.status === "string",
  );
}

function sanitizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item): item is ChatMessage =>
        Boolean(
          item &&
            typeof item === "object" &&
            (item as ChatMessage).role &&
            ["user", "assistant"].includes((item as ChatMessage).role) &&
            typeof (item as ChatMessage).content === "string",
        ),
    )
    .slice(-8)
    .map((item) => ({ role: item.role, content: item.content.trim().slice(0, 800) }));
}

function collectText(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectText);
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  if (typeof record.text === "string") return [record.text];
  if (typeof record.output_text === "string") return [record.output_text];

  return Object.entries(record)
    .filter(([key]) => ["content", "parts", "output", "outputs", "steps"].includes(key))
    .flatMap(([, child]) => collectText(child));
}

function extractGeminiAnswer(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const record = payload as Record<string, unknown>;
  if (typeof record.output_text === "string") return record.output_text.trim();

  if (Array.isArray(record.candidates)) {
    const candidateText = collectText(record.candidates.slice(0, 1)).join("\n").trim();
    if (candidateText) return candidateText;
  }

  const candidates = Array.isArray(record.outputs)
    ? record.outputs.slice(-1)
    : Array.isArray(record.steps)
      ? record.steps.slice(-1)
      : [record.output];

  return collectText(candidates).join("\n").trim();
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { answer: "Please wait a few minutes before sending another question.", source: "rate_limit" },
      { status: 429 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ answer: "Invalid request." }, { status: 400 });
  }

  const message = body.message?.trim().slice(0, 1000) || "";
  if (!message) {
    return NextResponse.json({ answer: "Please enter a question." }, { status: 400 });
  }

  if (!isVerifiedVendor(body.vendor)) {
    return NextResponse.json(
      { answer: "Please complete vendor verification before asking a question." },
      { status: 403 },
    );
  }

  const fallback = getUtsavFallbackAnswer(message);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ answer: fallback, source: "knowledge_base" });
  }

  const history = sanitizeHistory(body.history);
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const contents = [
    ...history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildUtsavSystemInstruction(body.vendor) }],
        },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
        },
      }),
      signal: AbortSignal.timeout(12_000),
      },
    );

    if (!response.ok) {
      console.error("Utsav Saathi Gemini request failed", response.status);
      return NextResponse.json({ answer: fallback, source: "knowledge_base" });
    }

    const answer = extractGeminiAnswer(await response.json());
    return NextResponse.json({ answer: answer || fallback, source: answer ? "gemini" : "knowledge_base" });
  } catch (error) {
    console.error("Utsav Saathi Gemini request error", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ answer: fallback, source: "knowledge_base" });
  }
}
