import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Circle } from "phosphor-react";

interface Consulta {
  id: string;
  horario: Date;
  hora: string;
  status: string;
  paciente: {
    id: string;
    nome: string;
    email: string;
  };
}

export function Consultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const medicoId = "0db1b9ba-2d36-4ee9-8839-c6af317c8cfb"; // Todo: Obter o ID do médico logado
    api
      .get<Consulta[]>(`/api/Consulta/ObterConsultasPendentesMedico/${medicoId}`)
      .then((response) => {
        setConsultas(response.data);
        setLoading(false);
      });
  }, []);

  return !loading ? (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-2xl font-bold mb-3">Consultas</h1>
      {consultas.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Paciente</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Hora</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((consulta) => (
              <tr key={consulta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{consulta.paciente.nome}</td>
                <td className="px-4 py-2">
                  {new Date(consulta.horario).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(consulta.horario).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2">{consulta.status}</td>
                <td className="flex gap-2 px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={consulta.status != "Aguardando aceite"}
                  >
                    Aceitar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={consulta.status != "Aguardando aceite"}
                  >
                    Recusar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma consulta encontrada.</p>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <Circle className="animate-spin" size={32} color="#000" weight="bold" />
      <h1 className="text-2xl font-bold mt-4">Carregando...</h1>
    </div>
  );
}
