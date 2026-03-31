"use client";

import { useEffect, useState } from "react";

export function FloatingBar() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const nearBottom = scrollY + windowH > docH - 120;
      setVisible(scrollY > 400 && !nearBottom);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={`floating-bar ${visible ? "visible" : ""}`}>
      <div className="max-w-[680px] mx-auto px-6 h-[52px] flex items-center justify-between">
        <button className="btn-ghost" title="Compartir" onClick={copyLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16,6 12,2 8,6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span className="text-xs">{copied ? "Copiado!" : "Compartir"}</span>
        </button>
        <button className="btn-ghost" onClick={scrollToTop} title="Volver arriba">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18,15 12,9 6,15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
