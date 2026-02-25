/**
 * Textarea — área de texto estilizada con label opcional
 * Props: label, className, ...rest
 */
export default function Textarea({ label, className = "", ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="field-label">{label}</label>}
      <textarea
        className={`resize-none w-full ${className}`}
        {...rest}
      />
    </div>
  );
}
