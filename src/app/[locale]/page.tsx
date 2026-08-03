"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import Topbar from "@/components/layout/Topbar";

const courses = [
  "k8s-airgap-ha",
  "linux-admin",
  "openshift-upi-v414",
  "storage-iscsi-3lun",
  "github-actions",
  "bash-basics",
] as const;

const categoryColors: Record<string, string> = {
  "CI/CD": "var(--accent)",
  Linux: "var(--accent-green)",
  OpenShift: "var(--accent-red)",
  Scripting: "var(--accent3)",
  Kubernetes: "var(--accent2)",
  Storage: "var(--accent3)",
};

const categoryIcons: Record<string, string> = {
  "CI/CD": "⚡",
  Linux: "🐧",
  OpenShift: "红",
  Scripting: ">_",
  Kubernetes: "⎈",
  Storage: "💾",
};

export default function LandingPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const toggleLang = () => {
    const path = window.location.pathname;
    const target = locale === "ar" ? "/en" : "/ar";
    window.location.href = path.replace(`/${locale}`, target);
  };

  const tags = Array.from(
    new Set(courses.map((slug) => t.raw(`courses.${slug}`).tag))
  );

  const filtered = courses.filter((slug) => {
    const course = t.raw(`courses.${slug}`);
    const matchesQuery =
      !query.trim() ||
      `${course.title} ${course.desc} ${course.tag}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesTag = !activeTag || course.tag === activeTag;
    return matchesQuery && matchesTag;
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="landing-page">
      <Topbar title="A Piece of Science" />

      <section className="landing-cover">
        <span className="landing-eyebrow">A Piece of Science</span>
        <h1 className="landing-title">
          A <span className="landing-title-accent">Piece</span> of Science
        </h1>
        <p className="landing-sub">
          Practical guides for the curious engineer
        </p>

        <div className="landing-search">
          <span className="landing-search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={searchRef}
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("nav.search")}
            aria-label={t("nav.search")}
            autoComplete="off"
            className="landing-search-input"
          />
          <kbd className="landing-search-kbd" aria-hidden="true">
            ⌘K
          </kbd>
          {query && (
            <button
              className="landing-search-clear"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="landing-tags" role="group" aria-label="Filter by category">
          <button
            className={`landing-tag${activeTag === null ? " active" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`landing-tag${activeTag === tag ? " active" : ""}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="landing-courses" aria-label="Available courses">
        {filtered.length > 0 ? (
          <div className="landing-grid">
            {filtered.map((slug) => {
              const course = t.raw(`courses.${slug}`);
              const color = categoryColors[course.tag] || "var(--accent)";
              const icon = categoryIcons[course.tag] || "📖";
              return (
                <a
                  key={slug}
                  className="course-card"
                  href={`/${locale}/courses/${slug}`}
                  style={{ "--card-accent": color } as React.CSSProperties}
                >
                  <div className="course-card-top">
                    <span className="course-card-icon" aria-hidden="true">
                      {icon}
                    </span>
                    <span className="course-card-tag">{course.tag}</span>
                  </div>
                  <h2 className="course-card-title">{course.title}</h2>
                  <p className="course-card-desc">{course.desc}</p>
                  <div className="course-card-meta">
                    <span>{course.chapters}</span>
                    <span className="course-card-dot" aria-hidden="true">·</span>
                    <span>{course.level}</span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="landing-empty" role="status" aria-live="polite">
            <span className="landing-empty-icon" aria-hidden="true">🔍</span>
            <p className="landing-empty-text">
              No courses match your search.
            </p>
            <button
              className="landing-empty-reset"
              onClick={() => {
                setQuery("");
                setActiveTag(null);
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <footer className="landing-footer" role="contentinfo">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo">PS</span>
            <span className="landing-footer-text">{t("nav.footer")}</span>
          </div>
          <div className="landing-footer-actions">
            <button
              className="theme-toggle"
              aria-label={
                mounted
                  ? theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                  : "Toggle theme"
              }
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              {mounted ? (theme === "dark" ? "☀️" : "🌙") : "🌙"}
            </button>
            <button
              className="theme-toggle"
              aria-label={
                locale === "ar"
                  ? "Switch to English"
                  : "التبديل إلى العربية"
              }
              onClick={toggleLang}
            >
              {locale === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
