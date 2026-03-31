import SessionTimer from '../common/SessionTimer'

interface HeaderProps {
  onReload: () => void
  loading: boolean
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function Header({ onReload, loading, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1l1 7H8l1-7H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z"/>
              <circle cx="9" cy="7" r="1" fill="#8b5cf6"/>
              <circle cx="15" cy="7" r="1" fill="#06b6d4"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1>AI Agent Builder</h1>
            <p className="tagline">Design your custom AI personality</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <SessionTimer />
        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>
          )}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button
          className="reload-btn"
          onClick={onReload}
          disabled={loading}
          title="Reload configuration data"
        >
          <svg
            className={loading ? 'spin' : ''}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          {loading ? 'Loading...' : 'Reload'}
        </button>
      </div>
    </header>
  )
}
