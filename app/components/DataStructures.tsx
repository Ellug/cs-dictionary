"use client";

import { useMemo, useState } from "react";
import {
  dsSections,
  type DSItem,
  type DSSection,
} from "../data/cs-datastructures";
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

function DSCard({
  item,
  color,
  query,
  onOpenDetail,
}: {
  item: DSItem;
  color: DSSection["color"];
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
          {item.complexity && (
            <div className="mt-1">
              <code className="text-[11px] text-cyan-300/90 bg-cyan-500/10 border border-cyan-700/40 rounded px-1.5 py-[1px]">
                {highlight(item.complexity, query)}
              </code>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

function DSSectionBlock({
  sec,
  query,
  onOpenDetail,
}: {
  sec: DSSection;
  query: string;
  onOpenDetail: (sec: DSSection, item: DSItem) => void;
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
        <DSCard
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

export default function DataStructures({ query }: { query: string }) {
  const [selected, setSelected] = useState<{ section: DSSection; item: DSItem } | null>(
    null
  );

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
          <DSSectionBlock
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
          selected?.item.complexity ? (
            <code className="text-[11px] text-cyan-300/90 bg-cyan-500/10 border border-cyan-700/40 rounded px-1.5 py-[1px]">
              {highlight(selected.item.complexity, query)}
            </code>
          ) : undefined
        }
        accentClass={accentClass}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
