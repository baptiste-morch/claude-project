import Spoiler from './Spoiler';

// Parses a body string and renders it with || ... || segments converted to
// click-to-reveal Spoiler components. Preserves whitespace and line breaks via
// CSS (white-space: pre-wrap on .body).

const SPOILER_RE = /\|\|([\s\S]+?)\|\|/g;

export default function Body({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(SPOILER_RE)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(<Spoiler key={`s-${i++}`}>{m[1]}</Spoiler>);
    last = start + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
