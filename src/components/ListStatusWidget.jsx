import Card, { CardHeader, CardTitle } from "./ui/Card";
import Select from "./ui/Select";
import Button from "./ui/Button";

const STATUS_OPTIONS = [
  { value: "pendiente", label: "📋 Pendiente" },
  { value: "viendo", label: "▶️ Viendo" },
  { value: "completado", label: "✅ Completado" },
];

/**
 * ListStatusWidget — selector de estado + botón guardar
 * Props: status, onChange, onSave
 */
export default function ListStatusWidget({ status, onChange, onSave }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📚 Mi Lista</CardTitle>
      </CardHeader>

      <Select
        label="Estado"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className="mb-4"
      />

      <Button variant="outline" size="sm" onClick={onSave} className="w-full">
        Guardar en lista
      </Button>
    </Card>
  );
}
