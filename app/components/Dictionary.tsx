"use client";

import { useEffect, useMemo, useState } from "react";
import { sections, type Section, type MethodItem } from "../data/cs-data";
import {
  getMethodExample,
  getMethodExampleKey,
  type MethodExample,
} from "../data/cs-reference-examples";

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

type SelectedMethod = {
  section: Section;
  method: MethodItem;
};

function MethodRow({
  m,
  color,
  query,
  onOpenExample,
}: {
  m: MethodItem;
  color: Section["color"];
  query: string;
  onOpenExample: () => void;
}) {
  const nameClass =
    color === "yellow"
      ? "text-yellow-200 text-[14px] font-mono"
      : color === "red"
        ? "text-red-300 text-[14px] font-mono"
        : "text-orange-300 text-[14px] font-mono";

  return (
    <div className="px-2 py-1 grid grid-cols-[1fr_1.6fr] gap-x-2 items-start hover:bg-zinc-800/70 transition-colors">
      <div className="min-w-0">
        <button
          type="button"
          onClick={onOpenExample}
          className="w-full text-left"
          aria-label={`${m.name} 예시 보기`}
        >
          <code
            className={
              nameClass + " break-all leading-[1.6] block underline-offset-4 hover:underline"
            }
          >
            {highlight(m.name, query)}
          </code>
        </button>
        {m.example && (
          <code className="text-zinc-500 text-[12px] leading-[1.6] block">
            ex: {m.example}
          </code>
        )}
      </div>
      <span className="text-zinc-200 text-[13px] leading-[1.6]">
        {highlight(m.desc, query)}
      </span>
    </div>
  );
}

function SectionCard({
  sec,
  query,
  onOpenExample,
}: {
  sec: Section;
  query: string;
  onOpenExample: (selected: SelectedMethod) => void;
}) {
  const titleClass =
    sec.color === "yellow"
      ? "text-yellow-400 font-bold text-base"
      : sec.color === "red"
        ? "text-red-400 font-bold text-base"
        : "text-white font-bold text-base";

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
        <span className="text-zinc-400 text-[12px] leading-snug">{sec.summary}</span>
      </div>
      <div className="divide-y divide-zinc-800">
        {filteredMethods.map((m) => (
          <MethodRow
            key={m.name}
            m={m}
            color={sec.color}
            query={query}
            onOpenExample={() =>
              onOpenExample({
                section: sec,
                method: m,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function ExampleFallback({ selected }: { selected: SelectedMethod }) {
  return (
    <div className="rounded border border-zinc-700 bg-[#121212] p-3 text-[13px] text-zinc-300 leading-[1.7]">
      <p className="text-zinc-200 font-semibold mb-1">아직 예시 데이터가 연결되지 않았어.</p>
      <p className="mb-2">아래 키로 예시를 추가하면 이 팝업에 자동 연결돼.</p>
      <pre className="bg-[#0b0b0b] border border-zinc-800 rounded p-2 overflow-x-auto text-zinc-300">
        <code>{getMethodExampleKey(selected.section.id, selected.method.name)}</code>
      </pre>
      <p className="mt-2 text-zinc-400">
        파일: <code>app/data/cs-reference-examples.ts</code>
      </p>
    </div>
  );
}

function ExampleModal({
  selected,
  onClose,
}: {
  selected: SelectedMethod | null;
  onClose: () => void;
}) {
  if (!selected) return null;

  const example: MethodExample | undefined = getMethodExample(
    selected.section,
    selected.method
  );

  const sectionColorClass =
    selected.section.color === "yellow"
      ? "text-yellow-300"
      : selected.section.color === "red"
        ? "text-red-300"
        : "text-orange-300";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 px-4 py-6 sm:py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${selected.method.name} 예시 팝업`}
    >
      <div className="mx-auto w-full max-w-5xl max-h-full overflow-hidden rounded-lg border border-zinc-700 bg-[#0f0f0f] shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-700 px-4 py-3">
          <div className="min-w-0">
            <p className={`text-[12px] ${sectionColorClass}`}>{selected.section.title}</p>
            <h3 className="text-[16px] text-zinc-100 font-semibold break-all">
              {selected.method.name}
            </h3>
            <p className="text-[13px] text-zinc-300 mt-1 leading-[1.6]">{selected.method.desc}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400 transition-colors"
            aria-label="팝업 닫기"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {example?.title && (
            <p className="text-sm text-zinc-200 font-semibold">{example.title}</p>
          )}

          {example ? (
            <>
              <pre className="bg-[#111827] border border-zinc-700 rounded p-3 overflow-x-auto text-[13px] leading-[1.65] text-zinc-100">
                <code>{example.code}</code>
              </pre>
              <p className="text-[13px] leading-[1.7] text-zinc-200 whitespace-pre-line">
                {example.explanation}
              </p>
            </>
          ) : (
            <ExampleFallback selected={selected} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dictionary({ query }: { query: string }) {
  const [selected, setSelected] = useState<SelectedMethod | null>(null);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-[1700px]:grid-cols-3 gap-6">
        {filtered.map((sec) => (
          <SectionCard
            key={sec.id}
            sec={sec}
            query={query}
            onOpenExample={setSelected}
          />
        ))}
      </div>
      <ExampleModal selected={selected} onClose={() => setSelected(null)} />
    </>
  );
}
