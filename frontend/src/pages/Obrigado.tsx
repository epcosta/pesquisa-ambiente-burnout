import { Link } from "react-router-dom";

export function Obrigado() {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
      <h1 className="mt-5 text-3xl font-bold text-slate-900">Obrigado!</h1>
      <p className="mt-3 text-slate-600">As respostas foram enviadas com sucesso.</p>
      <Link to="/" className="mt-7 inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
        Voltar ao início
      </Link>
    </section>
  );
}
