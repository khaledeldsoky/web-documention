"use client";

import { useParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  onToggleSidebar?: () => void;
  onToggleDrawer?: () => void;
  title?: string;
  backHref?: string;
};

export default function Topbar({ onToggleSidebar, onToggleDrawer, title, backHref }: Props) {
  const t = useTranslations("topbar");
  const { theme, setTheme } = useTheme();
  const params = useParams();
  const locale = params.locale as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleLang = () => {
    const path = window.location.pathname;
    const target = locale === "ar" ? "/en" : "/ar";
    window.location.href = path.replace(`/${locale}`, target);
  };

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <button
            className="topbar-hamburger"
            id="hamburger"
            onClick={onToggleDrawer}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <a className="topbar-brand" href={`/${locale}`}>
            {title || "Technical Guides"}
          </a>
          {backHref && (
            <button
              className="topbar-back"
              onClick={() => window.history.back()}
            >
              {locale === "ar" ? "← " : "← "}{t("back") || "Back"}
            </button>
          )}
        </div>
        <div className="topbar-right">
          <button
            id="lang-toggle"
            className="theme-toggle"
            onClick={toggleLang}
          >
            {locale === "ar" ? "English" : "العربية"}
          </button>
          <button
            id="theme-toggle"
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted ? (theme === "dark" ? "🌙" : "☀️") : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
