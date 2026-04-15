"use client";

import { useState } from "react";
import Dictionary from "./Dictionary";
import Interview from "./Interview";

type Tab = "reference" | "interview";

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
          <button
            onClick={() => handleTabChange("reference")}
            className={`px-2.5 py-0.5 rounded text-[12px] font-medium transition-colors ${
              tab === "reference"
                ? "bg-yellow-400/20 text-yellow-300 border border-yellow-500/40"
                : "text-zinc-500 border border-zinc-700 hover:text-zinc-300 hover:border-zinc-500"
            }`}
          >
            레퍼런스
          </button>
          <button
            onClick={() => handleTabChange("interview")}
            className={`px-2.5 py-0.5 rounded text-[12px] font-medium transition-colors ${
              tab === "interview"
                ? "bg-red-400/20 text-red-300 border border-red-500/40"
                : "text-zinc-500 border border-zinc-700 hover:text-zinc-300 hover:border-zinc-500"
            }`}
          >
            CS / 면접
          </button>
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
      {tab === "interview" && <Interview query={query} />}
    </>
  );
}
