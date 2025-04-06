import { Route, Routes } from "react-router";
import { Consultas } from "./pages/Consultas";
import { Layout } from "./components/Layout";
import { Medico } from "./pages/Medico";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Consultas />} />
        <Route path="medico" element={<Medico />} />
      </Route>
    </Routes>
  );
}
