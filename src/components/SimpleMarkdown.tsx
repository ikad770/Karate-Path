import React from "react";
import { Link } from "react-router-dom";

type Props = {
  md?: string | null;
  className?: string;
};

/**
 * Very small markdown renderer (headings, lists, blockquotes, links, bold/italic/code).
 * This avoids adding new dependencies while keeping content readable.
 */
function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  const pushText = (t: string) => {
    if (!t) return;
    nodes.push(t);
  };

  while (i < text.length) {
    // links: [text](url)
    const linkMatch = text.slice(i).match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const key = `lnk-${i}-${url}`;
      if (url.startsWith("/") || url.startsWith("#")) {
        nodes.push(<Link key={key} to={url} className="underline underline-offset-4 hover:opacity-90">{label}</Link>);
      } else {
        nodes.push(
          <a key={key} href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-90">
            {label}
          </a>
        );
      }
      i += linkMatch[0].length;
      continue;
    }

    // bold: **text**
    const boldMatch = text.slice(i).match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      const [, inner] = boldMatch;
      nodes.push(<strong key={`b-${i}`}>{inner}</strong>);
      i += boldMatch[0].length;
      continue;
    }

    // code: `text`
    const codeMatch = text.slice(i).match(/^`([^`]+)`/);
    if (codeMatch) {
      const [, inner] = codeMatch;
      nodes.push(
        <code key={`c-${i}`} className="rounded bg-muted px-1 py-0.5 text-[0.92em]">
          {inner}
        </code>
      );
      i += codeMatch[0].length;
      continue;
    }

    // italic: *text*
    const italicMatch = text.slice(i).match(/^\*([^*]+)\*/);
    if (italicMatch) {
      const [, inner] = italicMatch;
      nodes.push(<em key={`i-${i}`}>{inner}</em>);
      i += italicMatch[0].length;
      continue;
    }

    // plain char
    pushText(text[i]);
    i += 1;
  }

  return nodes;
}

export default function SimpleMarkdown({ md, className }: Props) {
  const content = (md ?? "").trim();
  if (!content) return null;

  const lines = content.split(/\r?\n/);

  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc pl-6 space-y-1">
        {list.map((li, idx) => (
          <li key={idx}>{parseInline(li)}</li>
        ))}
      </ul>
    );
    list = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();

    if (!line.trim()) {
      flushList();
      return;
    }

    // blockquote
    if (line.trimStart().startsWith(">")) {
      flushList();
      const quote = line.replace(/^\s*>\s?/, "");
      blocks.push(
        <blockquote
          key={`q-${idx}`}
          className="border-r-2 pr-4 text-muted-foreground italic"
        >
          {parseInline(quote)}
        </blockquote>
      );
      return;
    }

    // headings
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushList();
      const level = h[1].length;
      const text = h[2];
      if (level === 1)
        blocks.push(<h1 key={`h1-${idx}`} className="text-2xl font-bold">{parseInline(text)}</h1>);
      else if (level === 2)
        blocks.push(<h2 key={`h2-${idx}`} className="text-xl font-semibold mt-4">{parseInline(text)}</h2>);
      else
        blocks.push(<h3 key={`h3-${idx}`} className="text-lg font-semibold mt-3">{parseInline(text)}</h3>);
      return;
    }

    // list item
    const li = line.match(/^\s*[-•]\s+(.*)$/);
    if (li) {
      list.push(li[1]);
      return;
    }

    // normal paragraph
    flushList();
    blocks.push(
      <p key={`p-${idx}`} className="leading-7">
        {parseInline(line)}
      </p>
    );
  });

  flushList();

  return <div className={["space-y-3", className].filter(Boolean).join(" ")}>{blocks}</div>;
}
