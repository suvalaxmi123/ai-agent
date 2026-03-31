export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Loading agent configurations...</p>
      <div className="loading-skeleton">
        <div className="skeleton-line skeleton-line-1"></div>
        <div className="skeleton-line skeleton-line-2"></div>
        <div className="skeleton-line skeleton-line-3"></div>
      </div>
    </div>
  )
}
