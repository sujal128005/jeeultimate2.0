/**
 * The model behind Saarthi.
 *
 * Whichever key is present in the environment is the one that gets used, so
 * you can switch providers without touching the app:
 *
 *   XAI_API_KEY=...              # Grok
 *   ANTHROPIC_API_KEY=...        # Claude
 *   OPENAI_API_KEY=...           # GPT
 *   GEMINI_API_KEY=...           # Gemini
 *
 * Optional overrides: SAARTHI_PROVIDER (xai | anthropic | openai | gemini) and
 * SAARTHI_MODEL to pin a specific model name.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Provider = "xai" | "anthropic" | "openai" | "gemini";

const DEFAULT_MODEL: Record<Provider, string> = {
  xai: "grok-4.6",
  anthropic: "claude-sonnet-4-5",
  openai: "gpt-4.1-mini",
  gemini: "gemini-3.5-flash",
};

export function activeProvider(): Provider | null {
  const forced = process.env.SAARTHI_PROVIDER as Provider | undefined;
  if (forced && keyFor(forced)) return forced;
  if (process.env.XAI_API_KEY || process.env.GROK_API_KEY) return "xai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return null;
}

function keyFor(provider: Provider) {
  if (provider === "xai") return process.env.XAI_API_KEY || process.env.GROK_API_KEY;
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

/** Statuses worth a second go: the model is busy, not wrong. */
const RETRY_STATUS = new Set([429, 500, 502, 503, 504]);
const BACKOFF_MS = [700, 1800];

/**
 * A model under load answers 503 and means "ask again in a second". Retrying
 * here rather than in the panel keeps that invisible to the student, who
 * should not have to know which model is having a busy morning.
 */
async function fetchModel(url: string, init: RequestInit, label: string) {
  let last: Response | null = null;
  for (let attempt = 0; attempt <= BACKOFF_MS.length; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt - 1]));
    const res = await fetch(url, init);
    if (res.ok) return res;
    if (!RETRY_STATUS.has(res.status)) throw new Error(`${label} ${res.status}: ${await res.text()}`);
    last = res;
  }
  throw new Error(`${label} ${last?.status}: ${await last?.text()}`);
}

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
    const res = await fetchModel(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        signal,
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({ model, max_tokens: 900, system, stream: true, messages }),
      },
      "anthropic",
    );
    return sseText(res, (data) => {
      const e = data as AnthropicEvent;
      return e.type === "content_block_delta" ? (e.delta?.text ?? null) : null;
    });
  }

  // Grok speaks the OpenAI chat shape, so one branch serves both.
  if (provider === "openai" || provider === "xai") {
    const url = provider === "xai" ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
    const res = await fetchModel(
      url,
      {
        method: "POST",
        signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          stream: true,
          max_tokens: 900,
          messages: [{ role: "system", content: system }, ...messages],
        }),
      },
      provider,
    );
    return sseText(res, (data) => (data as OpenAiEvent).choices?.[0]?.delta?.content ?? null);
  }

  // The key goes in a header, never in the URL: query string keys leak into
  // logs and error text, and the newer AQ. keys from AI Studio are rejected
  // when passed as ?key=.
  const res = await fetchModel(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        generationConfig: { maxOutputTokens: 900 },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      }),
    },
    "gemini",
  );
  return sseText(res, (data) => (data as GeminiEvent).candidates?.[0]?.content?.parts?.[0]?.text ?? null);
}
