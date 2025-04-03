import { useEffect, useState } from "react";

export function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <button
        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
      >
        Alternar Tema
      </button>
    </div>
  );
}
