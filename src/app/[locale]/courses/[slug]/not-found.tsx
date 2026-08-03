"use client";

import { useParams } from "next/navigation";

export default function CourseNotFound() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="error-page" role="alert">
      <div className="error-icon" aria-hidden="true">404</div>
      <h1 className="error-title">Course Not Found</h1>
      <p className="error-desc">
        The course you are looking for does not exist or has not been published yet.
      </p>
      <a href={`/${locale}`} className="error-action">
        ← Back to All Courses
      </a>
    </div>
  );
}
