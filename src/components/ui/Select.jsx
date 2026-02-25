/**
 * Select — desplegable estilizado con label opcional
 * Props: label, options ([{ value, label }]), className, ...rest
 */
export default function Select({ label, options, className = "", children, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        <select className={`w-full appearance-none pr-8 ${className}`} {...rest}>
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        {/* Custom arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[var(--color-muted)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
