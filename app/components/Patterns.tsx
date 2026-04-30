"use client";

import { useState, useMemo } from "react";
import { patternSections, type PatternSection, type PatternItem } from "../data/cs-patterns";

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

const CATEGORY_COLOR: Record<PatternItem["category"], string> = {
  생성: "text-yellow-500 border-yellow-700 bg-yellow-500/10",
  구조: "text-zinc-400 border-zinc-600 bg-zinc-500/10",
  행동: "text-red-400 border-red-700 bg-red-500/10",
  아키텍처: "text-blue-400 border-blue-700 bg-blue-500/10",
};

function PatternCard({ item, color, query }: { item: PatternItem; color: PatternSection["color"]; query: string }) {
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className={termClass}>{highlight(item.term, query)}</span>
            <span className={`text-[12px] px-1.5 border rounded ${CATEGORY_COLOR[item.category]}`}>
              {item.category}
            </span>
          </div>
          <span className="text-zinc-400 text-[13px] leading-[1.6] block mt-[1px]">
            {highlight(item.oneliner, query)}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-800">
          <ul className="px-3 py-2 space-y-[3px]">
            {item.detail.map((d, i) => (
              <li key={i} className="flex gap-1.5 items-baseline">
                <span className="text-zinc-600 text-[12px] shrink-0">•</span>
                <span className="text-zinc-200 text-[13px] leading-[1.6] font-mono">
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

function PatternSectionBlock({ sec, query }: { sec: PatternSection; query: string }) {
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
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.detail.some((d) => d.toLowerCase().includes(query.toLowerCase())) ||
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
        <PatternCard key={item.term} item={item} color={sec.color} query={query} />
      ))}
    </div>
  );
}

export default function Patterns({ query }: { query: string }) {
  const filtered = useMemo(
    () =>
      patternSections.filter((sec) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          sec.title.toLowerCase().includes(q) ||
          sec.items.some(
            (item) =>
              item.term.toLowerCase().includes(q) ||
              item.oneliner.toLowerCase().includes(q) ||
              item.category.toLowerCase().includes(q) ||
              item.detail.some((d) => d.toLowerCase().includes(q)) ||
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
    <div className="grid grid-cols-1 lg:grid-cols-2 min-[1700px]:grid-cols-3 gap-6">
      {filtered.map((sec) => (
        <PatternSectionBlock key={sec.id} sec={sec} query={query} />
      ))}
    </div>
  );
}
