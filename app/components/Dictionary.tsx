"use client";

import { useMemo } from "react";
import { sections, type Section, type MethodItem } from "../data/cs-data";

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-400/30 text-yellow-200 rounded-[2px]">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function MethodRow({ m, color, query }: { m: MethodItem; color: Section["color"]; query: string }) {
  const nameClass =
    color === "yellow"
      ? "text-yellow-200 text-[11px] whitespace-nowrap shrink-0"
      : color === "red"
        ? "text-red-300 text-[11px] whitespace-nowrap shrink-0"
        : "text-white text-[11px] whitespace-nowrap shrink-0";

  return (
    <div className="px-2 py-[3px] flex gap-2 items-baseline hover:bg-zinc-800/70 transition-colors">
      <code className={nameClass}>{highlight(m.name, query)}</code>
      <span className="text-zinc-200 text-[11px] leading-snug min-w-0">
        {highlight(m.desc, query)}
        {m.example && (
          <code className="ml-1 text-zinc-400 text-[10px]">
            ex: {m.example}
          </code>
        )}
      </span>
    </div>
  );
}

function SectionCard({ sec, query }: { sec: Section; query: string }) {
  const titleClass =
    sec.color === "yellow"
      ? "text-yellow-400 font-bold text-sm"
      : sec.color === "red"
        ? "text-red-400 font-bold text-sm"
        : "text-white font-bold text-sm";

  const filteredMethods = query
    ? sec.methods.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.desc.toLowerCase().includes(query.toLowerCase())
      )
    : sec.methods;

  if (filteredMethods.length === 0) return null;

  return (
    <div className="break-inside-avoid mb-3 border border-zinc-700 bg-[#141414] rounded">
      <div className="px-2 py-1 border-b border-zinc-700 flex items-baseline gap-2 flex-wrap">
        <span className={titleClass}>{sec.title}</span>
        <span className="text-zinc-400 text-[10px] leading-tight">{sec.summary}</span>
      </div>
      <div className="divide-y divide-zinc-800">
        {filteredMethods.map((m) => (
          <MethodRow key={m.name} m={m} color={sec.color} query={query} />
        ))}
      </div>
    </div>
  );
}

export default function Dictionary({ query }: { query: string }) {
  const filtered = useMemo(
    () =>
      sections.filter((sec) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          sec.title.toLowerCase().includes(q) ||
          sec.summary.toLowerCase().includes(q) ||
          sec.methods.some(
            (m) => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
          )
        );
      }),
    [query]
  );

  if (filtered.length === 0) {
    return (
      <div className="text-zinc-500 text-sm text-center py-8">
        &quot;{query}&quot; 에 해당하는 결과가 없어
      </div>
    );
  }

  return (
    <div className="columns-[310px] gap-3">
      {filtered.map((sec) => (
        <SectionCard key={sec.id} sec={sec} query={query} />
      ))}
    </div>
  );
}
