/**
 * The model behind Saarthi.
 *
 * Whichever key is present in the environment is the one that gets used, so
 * you can switch providers without touching the app:
 *
 *   ANTHROPIC_API_KEY=...        # Claude
 *   OPENAI_API_KEY=...           # GPT
 *   GEMINI_API_KEY=...           # Gemini
 *
 * Optional overrides: SAARTHI_PROVIDER (anthropic | openai | gemini) and
 * SAARTHI_MODEL to pin a specific model name.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Provider = "anthropic" | "openai" | "gemini";

const DEFAULT_MODEL: Record<Provider, string> = {
  anthropic: "claude-sonnet-4-5",
  openai: "gpt-4.1-mini",
  gemini: "gemini-2.0-flash",
};

export function activeProvider(): Provider | null {
  const forced = process.env.SAARTHI_PROVIDER as Provider | undefined;
  if (forced && keyFor(forced)) return forced;
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return null;
}

function keyFor(provider: Provider) {
  if (provider === "anthropic") return process.env.ANTHROPIC_API_KEY;
  if (provider === "openai") return process.env.OPENAI_API_KEY;
  return process.env.GEMINI_API_KEY;
}

function modelFor(provider: Provider) {
  return process.env.SAARTHI_MODEL || DEFAULT_MODEL[provider];
}

/** Server sent events, line by line, handing back only the text deltas. */
async function* sseText(res: Response, pick: (data: unknown) => string | null) {
  const reader = res.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const text = pick(JSON.parse(payload));
        if (text) yield text;
      } catch {
        // a partial or non-JSON frame: skip it, the next one will carry the text
      }
    }
  }
}

type AnthropicEvent = { type?: string; delta?: { text?: string } };
type OpenAiEvent = { choices?: { delta?: { content?: string } }[] };
type GeminiEvent = { candidates?: { content?: { parts?: { text?: string }[] } }[] };

/** Streams the answer as plain text chunks. Throws on a provider error. */
export async function streamAnswer({
  system,
  messages,
  signal,
}: {
  system: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}): Promise<AsyncGenerator<string>> {
  const provider = activeProvider();
  if (!provider) throw new Error("no-provider");
  const key = keyFor(provider)!;
  const model = modelFor(provider);

  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens: 900, system, stream: true, messages }),
    });
    if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
    return sseText(res, (data) => {
      const e = data as AnthropicEvent;
      return e.type === "content_block_delta" ? (e.delta?.text ?? null) : null;
    });
  }

  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        stream: true,
        max_tokens: 900,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    if (!res.ok) throw new Error(`openai ${res.status}: ${await res.text()}`);
    return sseText(res, (data) => (data as OpenAiEvent).choices?.[0]?.delta?.content ?? null);
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`,
    {
      method: "POST",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        generationConfig: { maxOutputTokens: 900 },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      }),
    },
  );
  if (!res.ok) throw new Error(`gemini ${res.status}: ${await res.text()}`);
  return sseText(res, (data) => (data as GeminiEvent).candidates?.[0]?.content?.parts?.[0]?.text ?? null);
}
