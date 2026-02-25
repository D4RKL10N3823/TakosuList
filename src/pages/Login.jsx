import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { setToken } from "../services/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await api.post("/api/users/login", { username, password });
      const token = data.token || data.accessToken;
      if (!token) throw new Error("No se recibió token");
      setToken(token);
      nav("/app");
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setMsg(serverMsg || "Credenciales inválidas o error de servidor.");
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
            Inicia sesión en tu cuenta
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
              placeholder="••••••••"
              required
            />

            {msg && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {msg}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full mt-1">
              Iniciar sesión
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-muted)] mt-5">
          ¿Sin cuenta?{" "}
          <Link to="/app/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            Regístrate gratis
          </Link>
        </p>

      </div>
    </div>
  );
}