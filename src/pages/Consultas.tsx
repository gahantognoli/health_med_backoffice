import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { AlertDialog } from "radix-ui";
import { Loading } from "../components/Loading";

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
      .get<Consulta[]>(
        `/api/Consulta/ObterConsultasPendentesMedico/${medicoId}`
      )
      .then((response) => {
        setConsultas(response.data);
        setLoading(false);
      });
  }, []);

  async function handleAceitarConsulta(consultaId: string) {
    try {
      await api.patch(`/api/Consulta/Aceitar/${consultaId}`);
      setConsultas((prev) =>
        prev.map((consulta) =>
          consulta.id === consultaId
            ? { ...consulta, status: "Aceita" }
            : consulta
        )
      );
    } catch (error) {
      console.error("Erro ao aceitar consulta:", error);
    }
  }

  async function handleRecusarConsulta(consultaId: string) {
    try {
      await api.patch(`/api/Consulta/Recusar/${consultaId}`);
      setConsultas((prev) =>
        prev.map((consulta) =>
          consulta.id === consultaId
            ? { ...consulta, status: "Recusada" }
            : consulta
        )
      );
    } catch (error) {
      console.error("Erro ao recusar consulta:", error);
    }
  }

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
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={consulta.status != "Aguardando aceite"}
                      >
                        Aceitar
                      </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                      <AlertDialog.Title className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md">
                        Aceitar Consulta
                      </AlertDialog.Title>
                      <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md">
                        <p>Você deseja aceitar a consulta?</p>
                        <div className="flex justify-end mt-4">
                          <AlertDialog.Cancel asChild>
                            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer">
                              Cancelar
                            </button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                              onClick={() => handleAceitarConsulta(consulta.id)}
                            >
                              Aceitar
                            </button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={consulta.status != "Aguardando aceite"}
                      >
                        Recusar
                      </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                      <AlertDialog.Title className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md">
                        Aceitar Consulta
                      </AlertDialog.Title>
                      <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md">
                        <p>Você deseja recusar a consulta?</p>
                        <div className="flex justify-end mt-4">
                          <AlertDialog.Cancel asChild>
                            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer">
                              Cancelar
                            </button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                              onClick={() => handleRecusarConsulta(consulta.id)}
                            >
                              Recusar
                            </button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
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
    <Loading />
  );
}
