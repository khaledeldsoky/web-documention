"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function NotFound() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="error-page" role="alert">
      <div className="error-icon" aria-hidden="true">404</div>
      <h1 className="error-title">Page Not Found</h1>
      <p className="error-desc">
        The page you are looking for does not exist or has been moved.
      </p>
      <a href={`/${locale}`} className="error-action">
        ← Back to Home
      </a>
    </div>
  );
}
