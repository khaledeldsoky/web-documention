"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="error-page" role="alert">
      <div className="error-icon error-icon--warn" aria-hidden="true">!</div>
      <h1 className="error-title">Something went wrong</h1>
      <p className="error-desc">
        An unexpected error occurred while loading this page.
      </p>
      {error.digest && (
        <p className="error-digest">Error ID: {error.digest}</p>
      )}
      <button className="error-action" onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
