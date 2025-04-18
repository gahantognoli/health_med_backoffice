import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";

interface Especialidade {
  id: string;
  nome: string;
}

export function Cadastro() {
  const [loading, setLoading] = useState(true);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [email, setEmail] = useState("");
  const [especialidadeId, setEspecialidadeId] = useState("");
  const [senha, setSenha] = useState("");
  const [valorConsulta, setValorConsulta] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<Especialidade[]>(`/med/Especialidade`).then((response) => {
      setEspecialidades(response.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nome ||
      !crm ||
      !email ||
      !especialidadeId ||
      !senha ||
      !valorConsulta
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/med/Medico", {
        nome,
        crm,
        email,
        especialidadeId,
        valorConsulta,
        senha,
      });

      setNome("");
      setCrm("");
      setEmail("");
      setEspecialidadeId("");
      setValorConsulta(0);
      setSenha("");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar médico. Verifique os dados e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return !loading ? (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Médico</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            className="border border-gray-300 p-2 rounded w-full"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="crm" className="block text-gray-700">
            CRM
          </label>
          <input
            type="text"
            id="crm"
            className="border border-gray-300 p-2 rounded w-full"
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="especialidade" className="block text-gray-700">
            Especialidade
          </label>
          <select
            id="especialidade"
            className="border border-gray-300 p-2 rounded w-full"
            value={especialidadeId}
            onChange={(e) => setEspecialidadeId(e.target.value)}
          >
            <option value="">Selecione uma especialidade</option>
            {especialidades.map((especialidade) => (
              <option key={especialidade.id} value={especialidade.id}>
                {especialidade.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="valorConsulta" className="block text-gray-700">
            Valor da Consulta
          </label>
          <input
            type="number"
            id="valorConsulta"
            className="border border-gray-300 p-2 rounded w-full"
            value={valorConsulta}
            onChange={(e) => {
              const valor = e.target.value.replace(",", ".");
              const valorNumerico = parseFloat(valor);
              if (valorNumerico > 0) {
                setValorConsulta(valorNumerico);
              } else {
                setValorConsulta(0);
              }
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="senha" className="block text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            className="border border-gray-300 p-2 rounded w-full"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 cursor-pointer w-full"
            disabled={submitting}
          >
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>
          <button
            type="button"
            className="bg-red-500 text-white p-2 rounded cursor-pointer w-full ml-2"
            onClick={() => {
              setNome("");
              setCrm("");
              setEmail("");
              setEspecialidadeId("");
              setValorConsulta(0);
              setSenha("");
              window.location.href = "/login";
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  ) : (
    <Loading />
  );
}
