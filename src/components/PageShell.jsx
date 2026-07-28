export function PageShell({ currentPath, navigate, navItems, children }) {
  return (
    <main className="page-shell">
      <header className="site-header">
        <div className="brand-block">
          <p className="brand-mark">Desa Galih Lunik</p>
          <span className="brand-subtitle">Lampung Selatan, Provinsi Lampung</span>
        </div>
        <nav aria-label="Navigasi utama" className="site-nav">
          {navItems.map((item) => (
            <a
              key={item.path}
              className={currentPath === item.path ? 'is-active' : undefined}
              href={item.path}
              aria-current={currentPath === item.path ? 'page' : undefined}
              onClick={(event) => navigate(event, item.path)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      {children}
    </main>
  )
}