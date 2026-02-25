/**
 * Badge — etiqueta de estado
 * variant: purple | pink | green | yellow | gray
 */
const STATUS_MAP = {
  pendiente: "yellow",
  viendo: "purple",
  completado: "green",
};

const COLOR_MAP = {
  purple: "badge-purple",
  pink: "badge-pink",
  green: "badge-green",
  yellow: "badge-yellow",
  gray: "bg-white/5 text-[var(--color-muted)] border border-white/10",
};

export default function Badge({ children, variant, className = "" }) {
  // Si el texto coincide con un estado conocido, usar su color asignado
  const resolvedVariant =
    variant || STATUS_MAP[String(children).toLowerCase()] || "gray";
  const colorClass = COLOR_MAP[resolvedVariant] || COLOR_MAP.gray;

  return (
    <span className={`badge ${colorClass} ${className}`}>{children}</span>
  );
}
