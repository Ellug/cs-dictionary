"use client";

import { useEffect, useMemo, useState } from "react";
import {
  hotQuestionSections,
  type HotQuestion,
  type HotQuestionSection,
} from "../data/cs-interview-questions";

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

const DIFFICULTY_CLASS: Record<HotQuestion["difficulty"], string> = {
  기초: "text-cyan-300 border-cyan-700/50 bg-cyan-500/10",
  중급: "text-yellow-300 border-yellow-700/50 bg-yellow-500/10",
  심화: "text-red-300 border-red-700/50 bg-red-500/10",
};

function QuestionCard({
  item,
  color,
  query,
  onOpen,
}: {
  item: HotQuestion;
  color: HotQuestionSection["color"];
  query: string;
  onOpen: () => void;
}) {
  const questionClass =
    color === "yellow"
      ? "text-yellow-200"
      : color === "red"
        ? "text-red-200"
        : "text-zinc-100";

  return (
    <div className="border border-zinc-700 bg-[#141414] rounded mb-2 break-inside-avoid">
      <button
        type="button"
        onClick={onOpen}
        className="w-full text-left px-2 py-2 hover:bg-zinc-800/60 transition-colors"
        aria-label={`${item.question} 질문 보기`}
      >
        <div className="flex items-start gap-2">
          <span className="text-zinc-600 text-[12px] mt-[2px] shrink-0">Q</span>
          <div className="min-w-0 flex-1">
            <p className={`text-[14px] font-semibold leading-[1.55] ${questionClass}`}>
              {highlight(item.question, query)}
            </p>
            <p className="text-zinc-400 text-[13px] leading-[1.6] mt-1">
              {highlight(item.oneLiner, query)}
            </p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span
                className={`text-[11px] px-1.5 py-[1px] rounded border ${DIFFICULTY_CLASS[item.difficulty]}`}
              >
                {item.difficulty}
              </span>
              {item.keywords.slice(0, 4).map((k) => (
                <span
                  key={k}
                  className="text-[11px] px-1.5 py-[1px] rounded border border-zinc-700 text-zinc-400 bg-zinc-800/50"
                >
                  {highlight(k, query)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function QuestionSectionBlock({
  sec,
  query,
  onOpen,
}: {
  sec: HotQuestionSection;
  query: string;
  onOpen: (section: HotQuestionSection, item: HotQuestion) => void;
}) {
  const titleClass =
    sec.color === "yellow"
      ? "text-yellow-400 font-bold text-base"
      : sec.color === "red"
        ? "text-red-400 font-bold text-base"
        : "text-white font-bold text-base";

  const filteredItems = query
    ? sec.items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.question.toLowerCase().includes(q) ||
          item.oneLiner.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)) ||
          item.modelAnswer.some((a) => a.toLowerCase().includes(q)) ||
          item.followUps.some(
            (f) =>
              f.question.toLowerCase().includes(q) ||
              f.modelAnswer.some((a) => a.toLowerCase().includes(q))
          )
        );
      })
    : sec.items;

  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="mb-1.5 px-1">
        <span className={titleClass}>{sec.title}</span>
        <span className="text-zinc-600 text-[12px] ml-2">{filteredItems.length}개</span>
      </div>
      {filteredItems.map((item) => (
        <QuestionCard
          key={item.id}
          item={item}
          color={sec.color}
          query={query}
          onOpen={() => onOpen(sec, item)}
        />
      ))}
    </div>
  );
}

function QuestionModal({
  selected,
  query,
  onClose,
}: {
  selected: { section: HotQuestionSection; item: HotQuestion } | null;
  query: string;
  onClose: () => void;
}) {
  const [answerOpen, setAnswerOpen] = useState(false);
  const [openFollowUps, setOpenFollowUps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected, onClose]);

  if (!selected) return null;

  const accentClass =
    selected.section.color === "yellow"
      ? "text-yellow-300"
      : selected.section.color === "red"
        ? "text-red-300"
        : "text-orange-300";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 px-4 py-6 sm:py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="면접 질문 상세"
    >
      <div className="mx-auto w-full max-w-5xl max-h-full overflow-hidden rounded-lg border border-zinc-700 bg-[#0f0f0f] shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-700 px-4 py-3">
          <div className="min-w-0">
            <p className={`text-[12px] ${accentClass}`}>{selected.section.title}</p>
            <h3 className="text-[16px] text-zinc-100 font-semibold leading-[1.6] mt-0.5">
              Q. {highlight(selected.item.question, query)}
            </h3>
            <p className="text-[13px] text-zinc-300 mt-1 leading-[1.6]">
              {highlight(selected.item.oneLiner, query)}
            </p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span
                className={`text-[11px] px-1.5 py-[1px] rounded border ${DIFFICULTY_CLASS[selected.item.difficulty]}`}
              >
                {selected.item.difficulty}
              </span>
              {selected.item.keywords.map((k) => (
                <span
                  key={k}
                  className="text-[11px] px-1.5 py-[1px] rounded border border-zinc-700 text-zinc-400 bg-zinc-800/50"
                >
                  {highlight(k, query)}
                </span>
              ))}
            </div>
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
          <button
            type="button"
            onClick={() => setAnswerOpen((v) => !v)}
            className="text-left w-full px-3 py-2 border border-zinc-700 rounded bg-zinc-900/60 hover:bg-zinc-800/80 transition-colors"
          >
            <span className="text-zinc-100 text-[13px] font-semibold">
              {answerOpen ? "모범답안 숨기기" : "모범답안 보기 (스포일러)"}
            </span>
          </button>

          {answerOpen && (
            <div className="border border-zinc-700 rounded bg-[#131313] p-3">
              <p className="text-zinc-200 text-[13px] font-semibold mb-2">모범답안</p>
              <ul className="space-y-[6px]">
                {selected.item.modelAnswer.map((line, i) => (
                  <li key={i} className="flex gap-2 items-baseline">
                    <span className="text-zinc-600 text-[12px] shrink-0">•</span>
                    <span className="text-zinc-200 text-[13px] leading-[1.65] font-mono">
                      {highlight(line, query)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selected.item.followUps.length > 0 && (
            <div className="space-y-2">
              <p className="text-zinc-200 text-[13px] font-semibold">꼬리질문</p>
              {selected.item.followUps.map((f, idx) => {
                const opened = !!openFollowUps[idx];
                return (
                  <div key={`${selected.item.id}-fu-${idx}`} className="border border-zinc-700 rounded">
                    <div className="px-3 py-2 bg-zinc-900/50">
                      <p className="text-zinc-100 text-[13px] leading-[1.6]">
                        F{idx + 1}. {highlight(f.question, query)}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFollowUps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="mt-2 text-[12px] text-zinc-300 border border-zinc-600 rounded px-2 py-[2px] hover:text-white hover:border-zinc-400 transition-colors"
                      >
                        {opened ? "답변 숨기기" : "답변 보기 (스포일러)"}
                      </button>
                    </div>
                    {opened && (
                      <div className="px-3 py-2 border-t border-zinc-700 bg-[#111111]">
                        <ul className="space-y-[6px]">
                          {f.modelAnswer.map((line, i) => (
                            <li key={i} className="flex gap-2 items-baseline">
                              <span className="text-zinc-600 text-[12px] shrink-0">•</span>
                              <span className="text-zinc-200 text-[13px] leading-[1.65] font-mono">
                                {highlight(line, query)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InterviewQuestions({ query }: { query: string }) {
  const [selected, setSelected] = useState<{
    section: HotQuestionSection;
    item: HotQuestion;
  } | null>(null);

  const filtered = useMemo(
    () =>
      hotQuestionSections.filter((sec) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          sec.title.toLowerCase().includes(q) ||
          sec.items.some(
            (item) =>
              item.question.toLowerCase().includes(q) ||
              item.oneLiner.toLowerCase().includes(q) ||
              item.keywords.some((k) => k.toLowerCase().includes(q)) ||
              item.modelAnswer.some((a) => a.toLowerCase().includes(q)) ||
              item.followUps.some(
                (f) =>
                  f.question.toLowerCase().includes(q) ||
                  f.modelAnswer.some((a) => a.toLowerCase().includes(q))
              )
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
          <QuestionSectionBlock
            key={sec.id}
            sec={sec}
            query={query}
            onOpen={(section, item) => setSelected({ section, item })}
          />
        ))}
      </div>
      <QuestionModal
        key={selected ? selected.item.id : "empty"}
        selected={selected}
        query={query}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
