import { Route, Routes } from "react-router";
import { Consultas } from "./pages/Consultas";
import { Layout } from "./components/Layout";
import { Medico } from "./pages/Medico";
import { Cadastro } from "./pages/Cadastro";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Consultas />} />
          <Route path="medico" element={<Medico />} />
        </Route>
      </Route>
    </Routes>
  );
}
