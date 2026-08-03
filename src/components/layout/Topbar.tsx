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
  drawerOpen?: boolean;
};

export default function Topbar({ onToggleSidebar, onToggleDrawer, title, backHref, drawerOpen }: Props) {
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
    <nav className="topbar" role="navigation" aria-label="Main navigation">
      <div className="topbar-inner">
        <div className="topbar-left">
          {onToggleDrawer && (
            <button
              className="topbar-hamburger"
              id="hamburger"
              onClick={onToggleDrawer}
              aria-label="Toggle navigation"
              aria-expanded={drawerOpen}
              aria-controls="topbar-drawer"
            >
              ☰
            </button>
          )}
          {backHref && (
            <button
              className="topbar-back"
              onClick={() => window.history.back()}
              aria-label={t("back") || "Go back"}
            >
              ← {t("back") || "Back"}
            </button>
          )}
          <a className="topbar-brand" href={`/${locale}`}>
            {title || "A Piece of Science"}
          </a>
        </div>
        <div className="topbar-right">
          <button
            id="lang-toggle"
            className="theme-toggle"
            onClick={toggleLang}
            aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            {locale === "ar" ? "English" : "العربية"}
          </button>
          <button
            id="theme-toggle"
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
          >
            {mounted ? (theme === "dark" ? "🌙" : "☀️") : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
