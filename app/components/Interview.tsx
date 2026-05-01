"use client";

import { useState, useMemo } from "react";
import { interviewSections, type InterviewSection, type InterviewItem } from "../data/cs-interview";
import DetailModal from "./DetailModal";

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

function InterviewCard({
  item,
  color,
  query,
  onOpenDetail,
}: {
  item: InterviewItem;
  color: InterviewSection["color"];
  query: string;
  onOpenDetail: () => void;
}) {
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
        onClick={onOpenDetail}
        aria-label={`${item.term} 상세 보기`}
      >
        <span className="text-zinc-600 text-[12px] mt-[2px] shrink-0 select-none">↗</span>
        <div className="flex-1 min-w-0">
          <span className={termClass}>{highlight(item.term, query)}</span>
          <span className="text-zinc-400 text-[13px] ml-2 leading-[1.6]">
            — {highlight(item.oneliner, query)}
          </span>
        </div>
      </button>
    </div>
  );
}

function InterviewSectionBlock({
  sec,
  query,
  onOpenDetail,
}: {
  sec: InterviewSection;
  query: string;
  onOpenDetail: (sec: InterviewSection, item: InterviewItem) => void;
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
        <InterviewCard
          key={item.term}
          item={item}
          color={sec.color}
          query={query}
          onOpenDetail={() => onOpenDetail(sec, item)}
        />
      ))}
    </div>
  );
}

export default function Interview({ query }: { query: string }) {
  const [selected, setSelected] = useState<{
    section: InterviewSection;
    item: InterviewItem;
  } | null>(null);

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

  const accentClass = selected
    ? selected.section.color === "yellow"
      ? "text-yellow-300"
      : selected.section.color === "red"
        ? "text-red-300"
        : "text-orange-300"
    : "text-zinc-300";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-[1700px]:grid-cols-3 gap-6">
        {filtered.map((sec) => (
          <InterviewSectionBlock
            key={sec.id}
            sec={sec}
            query={query}
            onOpenDetail={(section, item) => setSelected({ section, item })}
          />
        ))}
      </div>

      <DetailModal
        isOpen={!!selected}
        title={selected ? highlight(selected.item.term, query) : ""}
        sectionTitle={selected ? selected.section.title : ""}
        description={selected ? highlight(selected.item.oneliner, query) : ""}
        details={selected ? selected.item.detail.map((d) => highlight(d, query)) : []}
        accentClass={accentClass}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
