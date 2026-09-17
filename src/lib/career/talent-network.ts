/**
 * Talent network - frontend contract only (Phase 2).
 *
 * Configure ONE of these to make the form live:
 *   NEXT_PUBLIC_TALENT_NETWORK_ENDPOINT  → JSON POST to your backend / form service
 *   NEXT_PUBLIC_CAREERS_EMAIL            → opens the visitor's email app, pre-filled
 * With neither set, the form explains that the network opens soon and sends nothing.
 */

export type TalentProfile = {
  name: string;
  email: string;
  role: string;
  link?: string;
  note?: string;
};

export type TalentSubmitResult =
  | { status: "sent" }
  | { status: "mailto" }
  | { status: "unavailable" }
  | { status: "error"; message: string };

export const talentNetworkConfig = {
  endpoint: process.env.NEXT_PUBLIC_TALENT_NETWORK_ENDPOINT || null,
  email: process.env.NEXT_PUBLIC_CAREERS_EMAIL || null,
};

export const isTalentNetworkLive = Boolean(talentNetworkConfig.endpoint || talentNetworkConfig.email);

export async function submitTalentProfile(profile: TalentProfile): Promise<TalentSubmitResult> {
  const { endpoint, email } = talentNetworkConfig;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, source: "career-page" }),
      });
      if (!res.ok) return { status: "error", message: "We couldn’t send that just now. Please try again." };
      return { status: "sent" };
    } catch {
      return { status: "error", message: "Network error. Please check your connection and try again." };
    }
  }

  if (email) {
    const subject = encodeURIComponent(`Talent network · ${profile.role} · ${profile.name}`);
    const body = encodeURIComponent(
      [
        `Name: ${profile.name}`,
        `Email: ${profile.email}`,
        `I build as: ${profile.role}`,
        profile.link ? `Link: ${profile.link}` : null,
        profile.note ? `\n${profile.note}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    return { status: "mailto" };
  }

  // Simulate a short round-trip so the UI feels consistent.
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { status: "unavailable" };
}
