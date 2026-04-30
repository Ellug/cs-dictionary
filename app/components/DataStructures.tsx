"use client";

import { useMemo, useState } from "react";
import {
  dsSections,
  type DSItem,
  type DSSection,
} from "../data/cs-datastructures";

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

function DSCard({
  item,
  color,
  query,
}: {
  item: DSItem;
  color: DSSection["color"];
  query: string;
}) {
  const [open, setOpen] = useState(!!query);
  const isOpen = query ? true : open;

  const termClass =
    color === "yellow"
      ? "text-yellow-300 font-bold text-[14px]"
      : color === "red"
        ? "text-red-300 font-bold text-[14px]"
        : "text-white font-bold text-[14px]";

  return (
    <div className="border border-zinc-700 bg-[#141414] rounded mb-2 break-inside-avoid">
      <button
        className="w-full text-left px-2 py-1.5 flex items-start gap-2 hover:bg-zinc-800/60 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-zinc-600 text-[12px] mt-[2px] shrink-0 select-none">
          {isOpen ? "▾" : "▸"}
        </span>
        <div className="flex-1 min-w-0">
          <span className={termClass}>{highlight(item.term, query)}</span>
          <span className="text-zinc-400 text-[13px] ml-2 leading-snug">
            — {highlight(item.oneliner, query)}
          </span>
          {item.complexity && (
            <div className="mt-1">
              <code className="text-[11px] text-cyan-300/90 bg-cyan-500/10 border border-cyan-700/40 rounded px-1.5 py-[1px]">
                {highlight(item.complexity, query)}
              </code>
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-800">
          <ul className="px-3 py-2 space-y-[3px]">
            {item.detail.map((d, i) => (
              <li key={i} className="flex gap-1.5 items-baseline">
                <span className="text-zinc-600 text-[12px] shrink-0">•</span>
                <span className="text-zinc-200 text-[13px] leading-snug font-mono">
                  {highlight(d, query)}
                </span>
              </li>
            ))}
          </ul>
          {item.csharp && (
            <pre className="mx-2 mb-2 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-[12px] text-green-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {highlight(item.csharp, query)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function DSSectionBlock({
  sec,
  query,
}: {
  sec: DSSection;
  query: string;
}) {
  const titleClass =
    sec.color === "yellow"
      ? "text-yellow-400 font-bold text-base"
      : sec.color === "red"
        ? "text-red-400 font-bold text-base"
        : "text-white font-bold text-base";

  const filteredItems = query
    ? sec.items.filter(
        (item) =>
          item.term.toLowerCase().includes(query.toLowerCase()) ||
          item.oneliner.toLowerCase().includes(query.toLowerCase()) ||
          item.detail.some((d) => d.toLowerCase().includes(query.toLowerCase())) ||
          item.complexity?.toLowerCase().includes(query.toLowerCase()) ||
          item.csharp?.toLowerCase().includes(query.toLowerCase())
      )
    : sec.items;

  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="mb-1.5 px-1">
        <span className={titleClass}>{sec.title}</span>
        <span className="text-zinc-600 text-[12px] ml-2">{filteredItems.length}개</span>
      </div>
      {filteredItems.map((item) => (
        <DSCard key={item.term} item={item} color={sec.color} query={query} />
      ))}
    </div>
  );
}

export default function DataStructures({ query }: { query: string }) {
  const filtered = useMemo(
    () =>
      dsSections.filter((sec) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          sec.title.toLowerCase().includes(q) ||
          sec.items.some(
            (item) =>
              item.term.toLowerCase().includes(q) ||
              item.oneliner.toLowerCase().includes(q) ||
              item.detail.some((d) => d.toLowerCase().includes(q)) ||
              item.complexity?.toLowerCase().includes(q) ||
              item.csharp?.toLowerCase().includes(q)
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
    <div className="columns-[480px] gap-3">
      {filtered.map((sec) => (
        <DSSectionBlock key={sec.id} sec={sec} query={query} />
      ))}
    </div>
  );
}
