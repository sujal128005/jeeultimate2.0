import { systemPrompt } from "@/lib/saarthi/prompt";
import { activeProvider, streamAnswer, type ChatMessage } from "@/lib/saarthi/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 16;
const MAX_CHARS = 2000;
/** A light guard so one visitor cannot hammer the key. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) if (times.every((t) => now - t > WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Tells the panel whether answers are switched on, without leaking the key. */
export function GET() {
  return Response.json({ ready: activeProvider() !== null });
}

export async function POST(request: Request) {
  if (!activeProvider()) {
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return Response.json({ error: "slow-down" }, { status: 429 });
  }

  let body: { messages?: ChatMessage[]; pathname?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "no-question" }, { status: 400 });
  }

  try {
    const chunks = await streamAnswer({ system: systemPrompt(body.pathname), messages });
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const text of chunks) controller.enqueue(encoder.encode(text));
        } catch {
          controller.enqueue(encoder.encode("\n\nSomething broke on the way here. Try that again in a moment."));
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-accel-buffering": "no",
      },
    });
  } catch (error) {
    console.error("[saarthi]", error);
    // A busy model is not a broken site, and the panel should say so kindly.
    const message = error instanceof Error ? error.message : String(error);
    const status = Number(message.match(/\s(\d{3}):/)?.[1]);
    const busy = status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
    // In development the reason travels to the panel, so a misconfigured model
    // or key says so on screen instead of hiding in the terminal.
    const detail =
      process.env.NODE_ENV === "production" ? undefined : String(error instanceof Error ? error.message : error).slice(0, 300);
    return Response.json({ error: busy ? "busy" : "upstream", detail }, { status: 502 });
  }
}
