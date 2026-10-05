export type StatusPeriodoPesquisa =
  | "NAO_INICIADA"
  | "EM_ANDAMENTO"
  | "ENCERRADA"
  | "SEM_PERIODO";

type PeriodoPesquisa = {
  dt_inicio_pesquisa: Date | null;
  dt_fechamento_pesquisa: Date | null;
};

export type ResultadoPeriodoPesquisa = {
  disponivel: boolean;
  status: StatusPeriodoPesquisa;
  msg: string;
};

export function verificarPeriodoPesquisa(
  pesquisa: PeriodoPesquisa,
): ResultadoPeriodoPesquisa {
  if (!pesquisa.dt_inicio_pesquisa || !pesquisa.dt_fechamento_pesquisa) {
    return {
      disponivel: false,
      status: "SEM_PERIODO",
      msg: "O período desta pesquisa não foi definido.",
    };
  }

  const agora = new Date();

  const inicio = new Date(pesquisa.dt_inicio_pesquisa);

  const fim = new Date(pesquisa.dt_fechamento_pesquisa);

  inicio.setHours(0, 0, 0, 0);
  fim.setHours(23, 59, 59, 999);

  if (agora < inicio) {
    return {
      disponivel: false,
      status: "NAO_INICIADA",
      msg: "Esta pesquisa ainda não foi iniciada.",
    };
  }

  if (agora > fim) {
    return {
      disponivel: false,
      status: "ENCERRADA",
      msg: "Esta pesquisa já foi concluída.",
    };
  }

  return {
    disponivel: true,
    status: "EM_ANDAMENTO",
    msg: "Pesquisa disponível.",
  };
}
