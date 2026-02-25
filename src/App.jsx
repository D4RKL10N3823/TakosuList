import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import { useNetworkStatus } from "./offline/useNetworkStatus";

function OfflineBanner() {
  const online = useNetworkStatus();
  if (online) return null;

  return (
    <div className="bg-orange-600 text-white text-[10px] py-1 text-center font-bold tracking-widest uppercase">
      Modo Offline — Navegando desde el caché local
    </div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <OfflineBanner />

      <NavBar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-border)] py-5 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-1.5">
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="font-semibold text-[var(--color-text)]"
            >
              TakosuList
            </span>
            <span>· Tu tracker de anime favorito</span>
          </div>

          <div className="flex gap-4">
            <a href="/app">Inicio</a>
            <a href="/app/mylist">Mi lista</a>
          </div>
        </div>
      </footer>
    </div>
  );
}