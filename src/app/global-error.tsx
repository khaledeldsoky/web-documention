"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" dir="ltr">
      <body style={{ background: "#0a0d12", color: "#dce6f5", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: "40px 24px", maxWidth: 480 }}>
          <div style={{ fontSize: "3rem", fontWeight: 700, color: "#e85555", marginBottom: 16 }}>!</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#8899b5", marginBottom: 24, lineHeight: 1.7 }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              background: "none",
              border: "1px solid #222c40",
              color: "#dce6f5",
              padding: "8px 20px",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
