"use client";

import { useState, useMemo } from "react";
import { interviewSections, type InterviewSection, type InterviewItem } from "../data/cs-interview";

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

function InterviewCard({ item, color, query }: { item: InterviewItem; color: InterviewSection["color"]; query: string }) {
  const [open, setOpen] = useState(!!query);

  // query 있으면 강제 펼침
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
          <span className="text-zinc-400 text-[13px] ml-2 leading-[1.6]">
            — {highlight(item.oneliner, query)}
          </span>
        </div>
      </button>

      {isOpen && (
        <ul className="px-3 pb-2 space-y-[3px] border-t border-zinc-800 pt-1.5">
          {item.detail.map((d, i) => (
            <li key={i} className="flex gap-1.5 items-baseline">
              <span className="text-zinc-600 text-[12px] shrink-0">•</span>
              <span className="text-zinc-200 text-[13px] leading-[1.6] font-mono">
                {highlight(d, query)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InterviewSectionBlock({ sec, query }: { sec: InterviewSection; query: string }) {
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
          item.detail.some((d) => d.toLowerCase().includes(query.toLowerCase()))
      )
    : sec.items;

  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="mb-1.5 px-1">
        <span className={titleClass}>{sec.title}</span>
      </div>
      {filteredItems.map((item) => (
        <InterviewCard key={item.term} item={item} color={sec.color} query={query} />
      ))}
    </div>
  );
}

export default function Interview({ query }: { query: string }) {
  const filtered = useMemo(
    () =>
      interviewSections.filter((sec) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          sec.title.toLowerCase().includes(q) ||
          sec.items.some(
            (item) =>
              item.term.toLowerCase().includes(q) ||
              item.oneliner.toLowerCase().includes(q) ||
              item.detail.some((d) => d.toLowerCase().includes(q))
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
        <InterviewSectionBlock key={sec.id} sec={sec} query={query} />
      ))}
    </div>
  );
}
