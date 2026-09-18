import Link from "next/link";

/**
 * The small slice of markdown Saarthi is asked to use: paragraphs, bullet
 * lines, **bold** and [links](/path). Built as React nodes, never as raw
 * HTML, so a stray tag in an answer can never become markup.
 */

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string, keyBase: string) {
  return text.split(TOKEN).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:/.test(href);
      return external ? (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent-text underline-offset-2 hover:underline"
        >
          {label}
        </a>
      ) : (
        <Link key={key} href={href} className="font-medium text-accent-text underline-offset-2 hover:underline">
          {label}
        </Link>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={key} className="flex list-none flex-col gap-1.5 pl-0">
        {bullets.map((b, i) => (
          <li key={`${key}-${i}`} className="flex gap-2">
            <span aria-hidden className="mt-[9px] size-1 shrink-0 rounded-full bg-accent" />
            <span>{inline(b, `${key}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (/^\s*[-*]\s+/.test(line)) {
      bullets.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    flush(`ul-${i}`);
    if (!line.trim()) return;
    if (/^#{1,6}\s+/.test(line)) {
      blocks.push(
        <p key={`h-${i}`} className="type-body-sm font-semibold">
          {inline(line.replace(/^#{1,6}\s+/, ""), `h-${i}`)}
        </p>,
      );
      return;
    }
    blocks.push(<p key={`p-${i}`}>{inline(line, `p-${i}`)}</p>);
  });
  flush("ul-end");

  return <div className="flex flex-col gap-3 type-body-sm leading-relaxed text-fg-2">{blocks}</div>;
}
