import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center bg-gray-800 text-white">
        <img src="src\assets\logo.png" />
        <nav className="flex items-center justify-between p-4">
          <Link to="/" className="text-lg font-semibold">
            Consultas
          </Link>
        </nav>
      </div>
      <main className="p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
