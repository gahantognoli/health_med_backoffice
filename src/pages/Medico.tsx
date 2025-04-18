import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";
import { AlertDialog, Dialog } from "radix-ui";
import { useRef } from "react";
import { parseJwt } from "../lib/utils";

interface Medico {
  id: string;
  nome: string;
  email: string;
  crm: string;
  valorConsulta: number;
  especialidade: {
    id: string;
    nome: string;
  };
  disponibilidade: [
    {
      diaSemana: number;
      diaSemanaDesc: string;
      horaInicio: number;
      horaFim: number;
    }
  ];
}

interface Disponibilidade {
  diaSemana: number;
  horaInicio: number;
  horaFim: number;
}

export function Medico() {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [exluindo, setExcluindo] = useState(false);
  const [atualizandoDisponibilidade, setAtualizandoDisponibilidade] =
    useState(false);

  const [nome, setNome] = useState("");
  const [valorConsulta, setValorConsulta] = useState(0);
  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>([]);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = parseJwt(token!);
    const medicoId = user.customId;
    api.get(`med/medico/${medicoId}`).then((response) => {
      setMedico(response.data);
      setNome(response.data.nome);
      setValorConsulta(response.data.valorConsulta);
      setDisponibilidade(response.data.disponibilidade);
      setLoading(false);
    });
  }, []);

  async function handleAtualizarMedico(e: React.MouseEvent) {
    try {
      e.preventDefault();
      setAtualizando(true);
      await api.patch(`med/medico/${medico?.id}`, {
        nome: nome,
        valorConsulta: valorConsulta,
      });
    } catch (error) {
      console.error("Error updating medico:", error);
    } finally {
      setAtualizando(false);
    }
  }

  async function handleExcluirMedico(e: React.MouseEvent) {
    try {
      e.preventDefault();
      setExcluindo(true);
      await api.delete(`med/medico/${medico?.id}`);
    } catch (error) {
      console.error("Error deleting medico:", error);
    } finally {
      setExcluindo(false);
    }
  }

  async function handleAtualizarDisponibilidade(e: React.MouseEvent) {
    try {
      e.preventDefault();
      setAtualizandoDisponibilidade(true);
      await api.patch(
        `med/Medico/AtualizarDisponibilidade/${medico?.id}`,
        disponibilidade.filter((d) => d.horaInicio !== 0 && d.horaFim !== 0)
      );
      closeButtonRef.current?.click();
    } catch (error) {
      console.error("Error updating availability:", error);
    } finally {
      setAtualizandoDisponibilidade(false);
    }
  }

  return !loading ? (
    <div className="flex flex-col gap-4 p-4 w-1/2 mx-auto bg-gray-100 h-screen">
      <h1 className="text-2xl text-center font-bold">Dados do Médico</h1>
      <div className="flex flex-row flex-wrap gap-4">
        <div className="flex flex-col gap-2 flex-1/3">
          <label className="text-gray-700 font-semibold">Nome</label>
          <input
            type="text"
            value={nome}
            className="input bg-white border-2 rounded p-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="Nome"
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1/3">
          <label className="text-gray-700 font-semibold">
            Valor da Consulta
          </label>
          <input
            type="text"
            value={valorConsulta}
            className="input bg-white border-2 rounded p-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="Valor da Consulta"
            onChange={(e) => setValorConsulta(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1/3">
          <label className="text-gray-700 font-semibold">CRM</label>
          <input
            type="text"
            value={medico?.crm}
            className="input bg-white border-2 rounded p-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="CRM"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2 flex-1/3">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            type="text"
            value={medico?.email}
            className="input bg-white border-2 rounded p-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="Email"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2 flex-1/3">
          <label className="text-gray-700 font-semibold">Especialidade</label>
          <input
            type="text"
            value={medico?.especialidade.nome}
            className="input bg-white border-2 rounded p-2 flex-1/3 disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="Especialidade"
            disabled
          />
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="bg-green-500 text-white rounded-md px-4 py-2 flex-1/2 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              disabled={loading}
            >
              Disponibilidade
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                Disponibilidade
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-gray-600">
                Aqui você pode gerenciar a disponibilidade do médico.
              </Dialog.Description>

              <div className="grid grid-cols-1 gap-4 mt-6">
                {Array.from({ length: 7 }).map((_, index) => {
                  const diasSemana = [
                    "Domingo",
                    "Segunda",
                    "Terça",
                    "Quarta",
                    "Quinta",
                    "Sexta",
                    "Sábado",
                  ];
                  const diaSemana = diasSemana[index];
                  const disponibilidadeDia = disponibilidade.find(
                    (d) => d.diaSemana === index
                  );
                  const disponivel = !!disponibilidadeDia;

                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          id={`check-${index}`}
                          type="checkbox"
                          checked={disponivel}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDisponibilidade((prev) => [
                                ...prev,
                                { diaSemana: index, horaInicio: 0, horaFim: 0 },
                              ]);
                            } else {
                              setDisponibilidade((prev) =>
                                prev.filter((d) => d.diaSemana !== index)
                              );
                            }
                          }}
                          className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`check-${index}`}
                          className="text-gray-800 font-medium"
                        >
                          {diaSemana}
                        </label>
                      </div>

                      {disponivel && (
                        <div className="flex items-center gap-4 ml-1">
                          <div>
                            <label className="text-sm text-gray-600">
                              Início
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={23}
                              value={disponibilidadeDia?.horaInicio || ""}
                              onChange={(e) => {
                                const newHoraInicio = Number(e.target.value);
                                if (newHoraInicio < 0 || newHoraInicio > 23)
                                  return;
                                setDisponibilidade((prev) =>
                                  prev.map((d) =>
                                    d.diaSemana === index
                                      ? {
                                          ...d,
                                          horaInicio: Number(newHoraInicio),
                                        }
                                      : d
                                  )
                                );
                              }}
                              className="block mt-1 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-gray-600">Fim</label>
                            <input
                              type="number"
                              min={0}
                              max={23}
                              value={disponibilidadeDia?.horaFim || ""}
                              onChange={(e) => {
                                const newHoraFim = Number(e.target.value);
                                if (newHoraFim < 0 || newHoraFim > 23) return;
                                setDisponibilidade((prev) =>
                                  prev.map((d) =>
                                    d.diaSemana === index
                                      ? { ...d, horaFim: Number(newHoraFim) }
                                      : d
                                  )
                                );
                              }}
                              className="block mt-1 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Dialog.Close asChild>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition cursor-pointer"
                    ref={closeButtonRef}
                  >
                    Fechar
                  </button>
                </Dialog.Close>
                <button
                  className="bg-blue-500 text-white rounded-md px-4 py-2 ml-2 cursor-pointer"
                  disabled={atualizandoDisponibilidade}
                  onClick={(e) => handleAtualizarDisponibilidade(e)}
                >
                  Salvar
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <button
          type="button"
          className="btn bg-blue-500 text-white rounded p-2 flex-1/2 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => handleAtualizarMedico(e)}
          disabled={atualizando}
        >
          Atualizar
        </button>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              className="btn bg-red-500 text-white rounded p-2 flex-1/2 hover:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Excluir
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md p-6 bg-white rounded shadow-md transform -translate-x-1/2 -translate-y-1/2">
              <AlertDialog.Title className="text-lg font-bold">
                Excluir Médico
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-4 text-gray-700">
                Você tem certeza que deseja excluir este médico? Esta ação não
                pode ser desfeita.
              </AlertDialog.Description>
              <div className="flex justify-end mt-4">
                <AlertDialog.Cancel asChild>
                  <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer">
                    Cancelar
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    type="button"
                    className="btn bg-blue-500 text-white rounded p-2 cursor-pointer"
                    onClick={(e) => handleExcluirMedico(e)}
                    disabled={exluindo}
                  >
                    Confirmar
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
