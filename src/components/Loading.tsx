import { Circle } from "phosphor-react";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Circle className="animate-spin" size={32} color="#000" weight="bold" />
      <h1 className="text-2xl font-bold mt-4">Carregando...</h1>
    </div>
  );
}
