export default function Loading() {
  return (
    <div className="loading-page" aria-busy="true" aria-label="Loading courses">
      <span className="sr-only">Loading...</span>

      <div className="skeleton-cover">
        <div className="skeleton skeleton-breadcrumb" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
        <div className="skeleton skeleton-search" />
        <div className="skeleton-tags">
          <div className="skeleton skeleton-tag-pill" />
          <div className="skeleton skeleton-tag-pill" />
          <div className="skeleton skeleton-tag-pill" />
          <div className="skeleton skeleton-tag-pill" />
        </div>
      </div>

      <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card" aria-hidden="true">
            <div className="skeleton-card-top">
              <div className="skeleton skeleton-icon" />
              <div className="skeleton skeleton-tag" />
            </div>
            <div className="skeleton skeleton-card-title" />
            <div className="skeleton skeleton-card-desc" />
            <div className="skeleton skeleton-card-desc short" />
            <div className="skeleton-card-footer">
              <div className="skeleton skeleton-meta" />
              <div className="skeleton skeleton-meta" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
