import Link from "next/link";

interface Props {
  body: string;
}

export default function GuideMarkdown({ body }: Props) {
  const blocks = toBlocks(body);

  return (
    <div className="space-y-5 text-[15.5px] leading-8 text-[var(--text-default)]">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

type Block =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "ordered"; items: string[] }
  | { type: "unordered"; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "callout"; variant: "info" | "caution" | "decision"; title: string; blocks: Block[] };

export interface GuideHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

export function getGuideHeadings(body: string): GuideHeading[] {
  return toBlocks(body)
    .filter((block): block is Extract<Block, { type: "h2" | "h3" }> =>
      block.type === "h2" || block.type === "h3",
    )
    .map((block) => ({
      id: block.id,
      level: block.type === "h2" ? 2 : 3,
      text: block.text,
    }));
}

function toBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  const headingCounts = new Map<string, number>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const text = line.replace(/^##\s+/, "");
      blocks.push({ type: "h2", text, id: uniqueHeadingId(text, headingCounts) });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      const text = line.replace(/^###\s+/, "");
      blocks.push({ type: "h3", text, id: uniqueHeadingId(text, headingCounts) });
      index += 1;
      continue;
    }

    const calloutMatch = /^:::(info|caution|decision)\s*(.*)$/.exec(line);
    if (calloutMatch) {
      const [, variant, title] = calloutMatch;
      const content: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") {
        content.push(lines[index]);
        index += 1;
      }
      if (index < lines.length && lines[index].trim() === ":::") {
        index += 1;
      }
      blocks.push({
        type: "callout",
        variant: variant as "info" | "caution" | "decision",
        title: title.trim(),
        blocks: toBlocks(content.join("\n")),
      });
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      blocks.push({ type: "table", rows: parseTable(tableLines) });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ordered", items });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "unordered", items });
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("## ") &&
      !lines[index].trim().startsWith("### ") &&
      !/^:::(info|caution|decision)\b/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("|") &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("- ")
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function parseTable(lines: string[]) {
  return lines
    .filter((line) => !/^\|\s*-/.test(line))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .filter((row) => row.some(Boolean));
}

function renderBlock(block: Block, index: number) {
  if (block.type === "h2") {
    return (
      <h2
        key={index}
        id={block.id}
        className="scroll-mt-24 border-l-4 border-[var(--gold)] pl-4 pt-4 text-xl font-extrabold leading-snug text-[var(--text-strong)]"
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === "h3") {
    return (
      <h3
        key={index}
        id={block.id}
        className="scroll-mt-24 pt-2 text-lg font-bold leading-snug text-[var(--gold-deep)]"
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === "callout") {
    const styles = {
      info: "border-[var(--border-emphasis)] bg-[var(--bg-soft)] text-[var(--text-strong)]",
      caution: "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--text-strong)]",
      decision: "border-[var(--border-emphasis)] bg-white text-[var(--text-strong)]",
    }[block.variant];

    return (
      <aside key={index} className={`space-y-3 rounded-2xl border p-5 ${styles}`}>
        {block.title && <p className="font-bold">{renderInline(block.title)}</p>}
        <div className="space-y-4 text-[15px] leading-7">
          {block.blocks.map((child, childIndex) => renderBlock(child, childIndex))}
        </div>
      </aside>
    );
  }

  if (block.type === "ordered") {
    return (
      <ol key={index} className="space-y-2 rounded-2xl bg-[var(--bg-soft)] p-5">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex} className="ml-5 list-decimal">
            {renderInline(item)}
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "unordered") {
    return (
      <ul key={index} className="space-y-2 rounded-2xl bg-[var(--bg-soft)] p-5">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex} className="ml-5 list-disc">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "table") {
    const [head, ...rows] = block.rows;
    return (
      <div key={index} className="overflow-x-auto rounded-2xl border bg-white shadow-[var(--shadow-sm)]">
        <table className="w-full min-w-[560px] text-left text-sm">
          {head && (
            <thead className="bg-[var(--bg-soft)] text-[var(--text-strong)]">
              <tr>
                {head.map((cell) => (
                  <th key={cell} className="px-4 py-3 font-bold">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p key={index} className="text-[var(--text-default)]">
      {renderInline(block.text)}
    </p>
  );
}

function uniqueHeadingId(text: string, counts: Map<string, number>) {
  const base = slugifyHeading(text);
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function slugifyHeading(text: string) {
  const slug = text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^0-9a-z가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "section";
}

function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (!match) return <span key={index}>{part}</span>;

    const [, label, href] = match;
    if (href.startsWith("/")) {
      return (
        <Link
          key={index}
          href={href}
          className="font-semibold text-[var(--article-accent,var(--lav-600))] underline"
        >
          {label}
        </Link>
      );
    }

    return (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[var(--article-accent,var(--lav-600))] underline"
      >
        {label}
      </a>
    );
  });
}
