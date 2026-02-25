/**
 * Button — variantes: primary | outline | ghost | danger
 * Props: variant, size (sm|md|lg), className, ...rest
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      className={`btn btn-${variant} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
