import { useState } from "react";
import api from "../services/api";
import { subscribeToPush } from "../features/push/pushClient";
import PageHeader from "../components/ui/PageHeader";
import Card, { CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Settings() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState("");

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 4000);
  };

  const enable = async () => {
    setLoading("push");
    setMsg("");
    try {
      await subscribeToPush(api);
      showMsg("✅ Notificaciones activadas.");
    } catch (e) {
      showMsg(`❌ ${e?.message || "Error al activar notificaciones."}`);
    } finally {
      setLoading("");
    }
  };

  const isError = msg.startsWith("❌");

  return (
    <div className="fade-up">
      <PageHeader
        title="Ajustes"
        subtitle="Configura tu experiencia en TakosuList"
      />

      <div className="max-w-lg space-y-4">
        {/* Web Push card */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <p className="text-sm text-[var(--color-muted)] mb-5 leading-relaxed">
            Activa las notificaciones para recibir alertas cuando alguien responda
            a tus comentarios.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={enable}
              disabled={loading === "push"}
              className="flex-1"
            >
              {loading === "push" ? "Activando…" : "Activar notificaciones"}
            </Button>

            <Button
              variant="ghost"
              onClick={test}
              disabled={loading === "test"}
              className="flex-1"
            >
              {loading === "test" ? "Enviando…" : "Enviar notificación de prueba"}
            </Button>
          </div>
        </Card>

        {/* Feedback message */}
        {msg && (
          <div
            className={`text-sm rounded-xl px-4 py-3 border fade-up ${
              isError
                ? "text-red-400 bg-red-500/10 border-red-500/20"
                : "text-green-400 bg-green-500/10 border-green-500/20"
            }`}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}