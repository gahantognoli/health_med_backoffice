import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { api } from "../lib/axios";

export function Login() {
  const [crm, setCrm] = useState("");
  const [senha, setSenha] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!crm || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await api.post("/auth/login", {
        usuario: crm,
        senha,
        tipoUsuario: 1,
      });

      const { accessToken } = response.data.data;

      localStorage.setItem("token", accessToken);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Credenciais inválidas. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      <img
        src={logo}
        alt="Logo"
        className="w-32 h-32 mb-4 mt-16"
      />
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <div className="mb-4">
          <label htmlFor="crm" className="block text-gray-700">CRM</label>
          <input
            type="text"
            id="crm"
            className="border border-gray-300 p-2 rounded w-full"
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="senha" className="block text-gray-700">Senha</label>
          <input
            type="password"
            id="senha"
            className="border border-gray-300 p-2 rounded w-full"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <div className="mt-4">
        <p className="text-gray-600">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-blue-500">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
