/**
 * Card — contenedor estilizado con soporte para hover y header/footer
 * Props: className, hoverable, children
 */
export default function Card({ children, className = "", hoverable = true }) {
  return (
    <div className={`card ${hoverable ? "" : "hover:border-[var(--color-border)] hover:shadow-none"} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-base font-bold text-white ${className}`}>{children}</h3>
  );
}
