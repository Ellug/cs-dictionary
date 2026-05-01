"use client";

import { useState, useMemo } from "react";
import { patternSections, type PatternSection, type PatternItem } from "../data/cs-patterns";
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

const CATEGORY_COLOR: Record<PatternItem["category"], string> = {
  생성: "text-yellow-500 border-yellow-700 bg-yellow-500/10",
  구조: "text-zinc-400 border-zinc-600 bg-zinc-500/10",
  행동: "text-red-400 border-red-700 bg-red-500/10",
  아키텍처: "text-blue-400 border-blue-700 bg-blue-500/10",
};

function PatternCard({
  item,
  color,
  query,
  onOpenDetail,
}: {
  item: PatternItem;
  color: PatternSection["color"];
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
    </div>
  );
}

function PatternSectionBlock({
  sec,
  query,
  onOpenDetail,
}: {
  sec: PatternSection;
  query: string;
  onOpenDetail: (sec: PatternSection, item: PatternItem) => void;
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
        <PatternCard
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

export default function Patterns({ query }: { query: string }) {
  const [selected, setSelected] = useState<{
    section: PatternSection;
    item: PatternItem;
  } | null>(null);

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
          <PatternSectionBlock
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
        code={selected?.item.csharp ? highlight(selected.item.csharp, query) : undefined}
        badge={
          selected ? (
            <span
              className={`text-[12px] px-1.5 border rounded ${CATEGORY_COLOR[selected.item.category]}`}
            >
              {selected.item.category}
            </span>
          ) : undefined
        }
        accentClass={accentClass}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
