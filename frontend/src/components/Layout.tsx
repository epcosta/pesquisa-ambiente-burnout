import { Link, NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-700 text-white"
      : "text-slate-200 hover:bg-emerald-700/70 hover:text-white"
  }`;

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="no-print border-b border-emerald-800 bg-emerald-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link to="/" className="text-lg font-bold tracking-tight sm:text-xl">
            Ambiente & Burnout
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Início
            </NavLink>
            <NavLink to="/ambienteburnout/listar" className={navClass}>
              Pesquisas
            </NavLink>
            <NavLink to="/ambienteburnout/inicio/cadastro" className={navClass}>
              Nova pesquisa
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="layout-content mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
