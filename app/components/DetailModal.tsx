"use client";

import { useEffect, type ReactNode } from "react";

type DetailModalProps = {
  isOpen: boolean;
  title: ReactNode;
  sectionTitle: ReactNode;
  description: ReactNode;
  details: ReactNode[];
  code?: ReactNode;
  badge?: ReactNode;
  accentClass?: string;
  onClose: () => void;
};

export default function DetailModal({
  isOpen,
  title,
  sectionTitle,
  description,
  details,
  code,
  badge,
  accentClass = "text-zinc-300",
  onClose,
}: DetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      aria-label="상세 설명 팝업"
    >
      <div className="mx-auto w-full max-w-5xl max-h-full overflow-hidden rounded-lg border border-zinc-700 bg-[#0f0f0f] shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-700 px-4 py-3">
          <div className="min-w-0">
            <p className={`text-[12px] ${accentClass}`}>{sectionTitle}</p>
            <div className="mt-0.5 flex items-center gap-2 flex-wrap">
              <h3 className="text-[16px] text-zinc-100 font-semibold break-all">{title}</h3>
              {badge}
            </div>
            <p className="text-[13px] text-zinc-300 mt-1 leading-[1.6]">{description}</p>
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
          <ul className="space-y-[6px]">
            {details.map((detail, i) => (
              <li key={i} className="flex gap-2 items-baseline">
                <span className="text-zinc-600 text-[12px] shrink-0">•</span>
                <span className="text-zinc-200 text-[13px] leading-[1.65] font-mono">
                  {detail}
                </span>
              </li>
            ))}
          </ul>

          {code && (
            <pre className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-[12px] text-green-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {code}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
