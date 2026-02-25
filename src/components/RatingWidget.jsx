import { useState } from "react";
import Card, { CardHeader, CardTitle } from "./ui/Card";
import Button from "./ui/Button";

/**
 * RatingWidget — selector de puntuación 1-10 con estrellas
 * Props: score, onChange, onSave
 */
const LABELS = ["", "Terrible", "Malo", "Pobre", "Regular", "Mediocre", "Bien", "Bueno", "Muy bueno", "Excelente", "Obra maestra"];

export default function RatingWidget({ score, onChange, onSave }) {
  const [hovered, setHovered] = useState(0);

  const display = hovered || score;

  return (
    <Card>
      <CardHeader>
        <CardTitle>⭐ Calificar</CardTitle>
        {display > 0 && (
          <span className="text-xs font-semibold text-yellow-400">
            {display}/10 · {LABELS[display]}
          </span>
        )}
      </CardHeader>

      {/* Star grid 1-10 */}
      <div className="flex flex-wrap gap-1 mb-4">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all border ${
              n <= display
                ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-400 shadow-sm shadow-yellow-400/20"
                : "bg-white/5 border-white/10 text-[var(--color-muted)] hover:border-yellow-400/30 hover:text-yellow-400"
            }`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <Button variant="primary" size="sm" onClick={onSave} className="w-full">
        Guardar calificación
      </Button>
    </Card>
  );
}
