import { Route, Routes } from "react-router";
import { Consultas } from "./pages/Consultas";
import { Layout } from "./components/Layout";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Consultas />} />
      </Route>
    </Routes>
  );
}
