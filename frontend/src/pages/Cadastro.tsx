import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};
const inputClass =
  "mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const inputClassReadOnly =
  "mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-[#e0e3e6] px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const labelClass = "block text-sm font-medium text-slate-700";

export default function Cadastro() {
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const [buscandoCep, setBuscandoCep] = useState(false);

  async function buscarCep(cepInformado: string) {
    const cep = cepInformado.replace(/\D/g, "");

    // Se o usuário não digitou 8 números
    if (cep.length !== 8) {
      setErr("Informe um CEP válido com 8 dígitos.");

      setLogradouro("");
      setBairro("");
      setCidade("");
      setUf("");

      return;
    }

    try {
      setErr("");
      setBuscandoCep(true);

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new Error("Erro ao consultar o CEP.");
      }

      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setLogradouro("");
        setBairro("");
        setCidade("");
        setUf("");

        throw new Error("CEP não encontrado.");
      }

      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setUf(data.uf);
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Erro ao consultar o CEP.");
      }
    } finally {
      setBuscandoCep(false);
    }
  }

  async function submit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    setErr("");
    setSending(true);
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries());

    try {
      console.log(JSON.stringify(body));
      console.log(import.meta.env.VITE_API_URL + "/pesquisas");
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/pesquisas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Erro ao cadastrar pesquisa.");
      }

      nav("/ambienteburnout/listar");
    } catch (x: any) {
      setErr(x.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Nova pesquisa
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Cadastro para Pesquisa de Ambiente e Burnout
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Preencha os dados da instituição, do responsável e o período da
          pesquisa.
        </p>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {err && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {err}
          </div>
        )}

        <section>
          <h2 className="border-b border-slate-200 pb-3 text-lg font-semibold text-slate-900">
            Instituição
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className={labelClass}>
              Razão social
              <input className={inputClass} name="razao_social" required />
            </label>
            <label className={labelClass}>
              Nome fantasia
              <input className={inputClass} name="nome_fantasia" />
            </label>
            <label className={labelClass}>
              CNPJ
              <input className={inputClass} name="cnpj" maxLength={18} />
            </label>
            <label className={labelClass}>
              CEP
              <input
                className={inputClass}
                name="cep"
                maxLength={9}
                placeholder="00000-000"
                onBlur={(e) => {
                  buscarCep(e.target.value);
                }}
              />
              {buscandoCep && (
                <span className="mt-1 block text-xs text-slate-500">
                  Consultando CEP...
                </span>
              )}
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              Endereço
              <input
                className={inputClassReadOnly}
                name="logradouro"
                value={logradouro}
                readOnly
              />
            </label>
            <label className={labelClass}>
              Número
              <input className={inputClass} name="nro" />
            </label>
            <label className={labelClass}>
              Complemento
              <input className={inputClass} name="complemento" />
            </label>
            <label className={labelClass}>
              Bairro
              <input
                className={inputClassReadOnly}
                name="bairro"
                value={bairro}
                readOnly
              />
            </label>
            <label className={labelClass}>
              Cidade
              <input
                className={inputClassReadOnly}
                name="cidade"
                value={cidade}
                readOnly
              />
            </label>
            <label className={labelClass}>
              UF
              <input
                className={inputClassReadOnly}
                name="uf"
                maxLength={2}
                value={uf}
                readOnly
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="border-b border-slate-200 pb-3 text-lg font-semibold text-slate-900">
            Responsável pela pesquisa
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className={labelClass}>
              Nome
              <input className={inputClass} name="nm_responsavel" required />
            </label>
            <label className={labelClass}>
              E-mail
              <input
                className={inputClass}
                type="email"
                name="email_responsavel"
                required
              />
            </label>
            <div className="grid grid-cols-[90px_1fr] gap-3">
              <label className={labelClass}>
                DDD
                <input
                  className={inputClass}
                  name="ddd_responsavel"
                  maxLength={2}
                  required
                />
              </label>
              <label className={labelClass}>
                Telefone
                <input
                  className={inputClass}
                  name="fone_responsavel"
                  required
                />
              </label>
            </div>
            <label className={labelClass}>
              Cargo
              <input className={inputClass} name="cargo_responsavel" />
            </label>
            <label className={labelClass}>
              Número de funcionários
              <input
                className={inputClass}
                type="number"
                min="0"
                name="nro_funcionarios"
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="border-b border-slate-200 pb-3 text-lg font-semibold text-slate-900">
            Período
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className={labelClass}>
              Início
              <input
                className={inputClass}
                type="date"
                name="dt_inicio_pesquisa"
                required
              />
            </label>
            <label className={labelClass}>
              Fechamento
              <input
                className={inputClass}
                type="date"
                name="dt_fechamento_pesquisa"
                required
              />
            </label>
          </div>
        </section>

        <div className="flex justify-end border-t border-slate-200 pt-6">
          <button
            disabled={sending}
            className="inline-flex min-w-44 cursor-pointer items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Cadastrando..." : "Cadastrar pesquisa"}
          </button>
        </div>
      </div>
    </form>
  );
}
