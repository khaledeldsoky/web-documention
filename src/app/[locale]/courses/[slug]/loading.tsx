export default function CourseLoading() {
  return (
    <div className="loading-page" aria-busy="true" aria-label="Loading course">
      <span className="sr-only">Loading course content...</span>

      <div className="skeleton-docs">
        <div className="skeleton-sidebar-wrap" aria-hidden="true">
          <div className="skeleton skeleton-sidebar-head" />
          <div className="skeleton skeleton-nav-item" />
          <div className="skeleton skeleton-nav-item short" />
          <div className="skeleton skeleton-nav-item" />
          <div className="skeleton skeleton-nav-item short" />
          <div className="skeleton skeleton-nav-item" />
          <div className="skeleton skeleton-nav-item short" />
          <div className="skeleton skeleton-nav-item" />
          <div className="skeleton skeleton-nav-item short" />
        </div>

        <div className="skeleton-main" aria-hidden="true">
          <div className="skeleton skeleton-breadcrumb" />
          <div className="skeleton skeleton-title wide" />
          <div className="skeleton skeleton-subtitle" />

          <div className="skeleton-section">
            <div className="skeleton skeleton-section-header" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text short" />
            <div className="skeleton skeleton-code-block" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text short" />
          </div>

          <div className="skeleton-section">
            <div className="skeleton skeleton-section-header" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text short" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-code-block" />
          </div>
        </div>
      </div>
    </div>
  );
}
