"use client";

import { useState } from "react";
import Dictionary from "./Dictionary";
import Interview from "./Interview";
import Patterns from "./Patterns";

type Tab = "reference" | "interview" | "patterns";

const TABS: { id: Tab; label: string; activeClass: string }[] = [
  {
    id: "reference",
    label: "레퍼런스",
    activeClass: "bg-yellow-400/20 text-yellow-300 border-yellow-500/40",
  },
  {
    id: "patterns",
    label: "디자인 패턴",
    activeClass: "bg-blue-400/20 text-blue-300 border-blue-500/40",
  },
  {
    id: "interview",
    label: "CS / 면접",
    activeClass: "bg-red-400/20 text-red-300 border-red-500/40",
  },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("reference");
  const [query, setQuery] = useState("");

  const handleTabChange = (next: Tab) => {
    setTab(next);
    setQuery("");
  };

  return (
    <>
      {/* 헤더: 타이틀 + 탭 + 검색 */}
      <div className="mb-3 border-b border-zinc-700 pb-2 flex items-center gap-3 flex-wrap">
        <h1 className="text-lg font-bold text-yellow-400 tracking-widest uppercase shrink-0">
          C# Quick Reference
        </h1>

        {/* 탭 버튼 */}
        <div className="flex gap-1 shrink-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-2.5 py-0.5 rounded text-[12px] font-medium transition-colors border ${
                tab === t.id
                  ? t.activeClass
                  : "text-zinc-500 border-zinc-700 hover:text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs select-none">
            /
          </span>
          <input
            key={tab}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색..."
            className="w-full bg-[#1a1a1a] border border-zinc-700 rounded pl-5 pr-6 py-1 text-[12px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20 transition-colors"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-[10px]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {tab === "reference" && <Dictionary query={query} />}
      {tab === "patterns"  && <Patterns  query={query} />}
      {tab === "interview" && <Interview query={query} />}
    </>
  );
}
