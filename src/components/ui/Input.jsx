/**
 * Input — campo de texto estilizado con label y mensaje de error opcional
 * Props: label, error, className, ...rest (se pasan al <input>)
 */
export default function Input({ label, error, className = "", ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="field-label">{label}</label>}
      <input
        className={`w-full ${error ? "border-red-500/60 focus:border-red-500" : ""} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
