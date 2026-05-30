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
  | { type: "h2"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ordered"; items: string[] }
  | { type: "unordered"; items: string[] }
  | { type: "table"; rows: string[][] };

function toBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "") });
      index += 1;
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
        className="pt-4 text-xl font-bold leading-snug text-[var(--text-strong)]"
      >
        {block.text}
      </h2>
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
      <div key={index} className="overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          {head && (
            <thead className="bg-[var(--lav-50)] text-[var(--text-strong)]">
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
          className="font-semibold text-[var(--lav-600)] underline"
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
        className="font-semibold text-[var(--lav-600)] underline"
      >
        {label}
      </a>
    );
  });
}
