import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/users/register", { username, password });
      nav("/app/login");
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setMsg(serverMsg || "No se pudo registrar (revise datos o servidor).");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center fade-up">
      <div className="w-full max-w-sm">

        {/* Header branding */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-black text-gradient"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TakosuList
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1.5">
            Únete a la comunidad de anime
          </p>
        </div>

        <div className="card">
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Nombre de usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tunombredeusuario"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />

            {msg && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {msg}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full mt-1">
              Crear cuenta
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-muted)] mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link to="/app/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            Iniciar sesión
          </Link>
        </p>

      </div>
    </div>
  );
}