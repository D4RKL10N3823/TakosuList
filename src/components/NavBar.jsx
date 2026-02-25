import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken } from "../services/auth";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const isAuth = !!getToken();

  const logout = () => { clearToken(); nav("/app/login"); };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-semibold transition-colors ${
      isActive(path)
        ? "text-cyan-400"
        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
    }`;

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--color-border)]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/app"
          className="flex items-center gap-2.5 no-underline hover:opacity-90 transition-opacity"
        >
          <span
            className="font-bold text-base tracking-tight text-gradient"
            style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}
          >
            TakosuList
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/app" className={linkClass("/app")}>Inicio</Link>
          {isAuth && <Link to="/app/list" className={linkClass("/app/list")}>Mi lista</Link>}
          {isAuth && <Link to="/app/settings" className={linkClass("/app/settings")}>Ajustes</Link>}
        </div>

        {/* Auth actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuth ? (
            <button
              onClick={logout}
              className="btn btn-ghost text-sm px-4 py-1.5"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/app/login" className="btn btn-ghost text-sm px-4 py-1.5">Iniciar sesión</Link>
              <Link to="/app/register" className="btn btn-primary text-sm px-4 py-1.5">Registrarse</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-[var(--color-muted)] hover:text-white transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 pt-2 flex flex-col gap-3 border-t border-[var(--color-border)]">
          <Link to="/app" className={linkClass("/app")} onClick={() => setMenuOpen(false)}>Inicio</Link>
          {isAuth && <Link to="/app/list" className={linkClass("/app/list")} onClick={() => setMenuOpen(false)}>Mi lista</Link>}
          {isAuth && <Link to="/app/settings" className={linkClass("/app/settings")} onClick={() => setMenuOpen(false)}>Ajustes</Link>}
          {isAuth
            ? <button onClick={() => { logout(); setMenuOpen(false); }} className="btn btn-ghost text-left text-sm w-fit">Cerrar sesión</button>
            : <>
                <Link to="/app/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost text-sm w-fit">Iniciar sesión</Link>
                <Link to="/app/register" onClick={() => setMenuOpen(false)} className="btn btn-primary text-sm w-fit">Registrarse</Link>
              </>
          }
        </div>
      )}
    </header>
  );
}