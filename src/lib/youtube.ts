/**
 * Reads the channel's public feed. No API key, no quota.
 * The feed carries the newest uploads with their id, title, date and
 * thumbnail; it does not say which ones are Shorts, so each id is probed
 * once against the /shorts/ URL, which only stays put for a real Short.
 */

export const CHANNEL_ID = "UC6OsAtAaghhSDST_zsVi5Ig";
export const CHANNEL_URL = "https://www.youtube.com/@jeeultimate2.0";
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
/** Re-read the channel once an hour */
const REVALIDATE = 3600;

export type Video = {
  id: string;
  title: string;
  published: string;
  thumb: string;
  url: string;
  short: boolean;
};

const pick = (block: string, tag: string) => {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
};

const decode = (v: string) =>
  v
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

async function isShort(id: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual",
      next: { revalidate: REVALIDATE },
    });
    // A long video's /shorts/ URL bounces to /watch, a real Short does not.
    return res.status >= 200 && res.status < 300;
  } catch {
    return false;
  }
}

/** Newest uploads, split into long videos and Shorts. Empty on any failure. */
export async function getChannelVideos(): Promise<{ long: Video[]; shorts: Video[]; ok: boolean }> {
  let xml = "";
  try {
    const res = await fetch(FEED, {
      next: { revalidate: REVALIDATE },
      headers: { "user-agent": "JEE-Ultimate-2.0 site (+https://jeeultimate.com)" },
    });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    xml = await res.text();
  } catch {
    return { long: [], shorts: [], ok: false };
  }

  const entries = xml.split("<entry>").slice(1, 13);
  const parsed = entries
    .map((block) => {
      const id = pick(block, "yt:videoId");
      const title = decode(pick(block, "title"));
      const published = pick(block, "published");
      if (!id || !title) return null;
      const video: Video = {
        id,
        title,
        published,
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${id}`,
        short: false,
      };
      return video;
    })
    .filter((v): v is Video => v !== null);

  if (!parsed.length) return { long: [], shorts: [], ok: false };

  const flags = await Promise.all(parsed.map((v) => isShort(v.id)));
  const withKind = parsed.map((v, i) => ({
    ...v,
    short: flags[i],
    url: flags[i] ? `https://www.youtube.com/shorts/${v.id}` : v.url,
  }));

  return {
    long: withKind.filter((v) => !v.short).slice(0, 2),
    shorts: withKind.filter((v) => v.short).slice(0, 5),
    ok: true,
  };
}

export function formatPublished(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
