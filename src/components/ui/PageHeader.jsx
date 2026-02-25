/**
 * PageHeader — encabezado de página con título, subtítulo y slot derecho opcional
 */
export default function PageHeader({ title, subtitle, icon, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-500/15 border border-cyan-500/20 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/10">
            {icon}
          </div>
        )}
        <div>
          <h1
            className="text-2xl font-extrabold text-[var(--color-text)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--color-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
