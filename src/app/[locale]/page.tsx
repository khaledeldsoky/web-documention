"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

const courses = [
  "bash-basics",
  "github-actions",
  "k8s-airgap-baremetal",
  "k8s-airgap-vsphere",
  "linux-admin",
  "openshift-upi-v414",
] as const;

export default function LandingPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [query, setQuery] = useState("");

  const coverT = t.raw("cover");
  const titleHtml = coverT.title;

  const filtered = courses.filter((slug) => {
    if (!query.trim()) return true;
    const course = t.raw(`courses.${slug}`);
    const text = `${course.title} ${course.desc} ${course.tag}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <>
      <div className="cover" style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 780, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--accent2)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
          Technical Guides
        </div>
        <h1 style={{ fontSize: "2.6rem", fontWeight: 700, lineHeight: 1.25, marginBottom: 12, color: "var(--text)" }}>
          Complete <span className="hl" style={{ color: "var(--accent2)" }}>Technical</span> Guides
        </h1>
        <p className="sub" style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text-dim)", marginBottom: 28, lineHeight: 1.7 }}>
          Practical, step-by-step guides — from CI/CD fundamentals to server administration
        </p>
        <div className="search-wrap" style={{ maxWidth: 520, margin: "0 auto 40px" }}>
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("nav.search")}
            style={{
              width: "100%",
              padding: "12px 18px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              direction: locale === "ar" ? "rtl" : "ltr",
              textAlign: locale === "ar" ? "right" : "left",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div
        className="course-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 18,
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 24px 60px",
        }}
      >
        {filtered.map((slug) => {
          const course = t.raw(`courses.${slug}`);
          return (
            <a
              key={slug}
              className="course-card"
              href={`/${locale}/courses/${slug}`}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "22px 22px 20px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--surface2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--accent2)", marginBottom: 8 }}>
                {course.tag}
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text)", marginBottom: 6, lineHeight: 1.4 }}>
                {course.title}
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                {course.desc}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", gap: 14 }}>
                <span>{course.chapters}</span>
                <span>{course.level}</span>
              </div>
            </a>
          );
        })}
      </div>

      <footer
        className="site-footer"
        style={{
          textAlign: "center",
          padding: "20px 24px 36px",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border)",
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
          <button
            className="theme-toggle"
            onClick={() => {
              const html = document.documentElement;
              html.classList.toggle("light");
              localStorage.setItem(
                "claude-guide-theme",
                html.classList.contains("light") ? "light" : "dark"
              );
            }}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 16,
              color: "var(--text-dim)",
            }}
          >
            🌙
          </button>
          <button
            className="theme-toggle"
            onClick={() => {
              const path = window.location.pathname;
              const target = locale === "ar" ? "/en" : "/ar";
              window.location.href = path.replace(`/${locale}`, target);
            }}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 16,
              color: "var(--text-dim)",
            }}
          >
            {locale === "ar" ? "English" : "العربية"}
          </button>
        </div>
        <p style={{ marginTop: 10 }}>{t("nav.footer")}</p>
      </footer>
    </>
  );
}
