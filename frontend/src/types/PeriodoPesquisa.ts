export type StatusPeriodoPesquisa =
  | "NAO_INICIADA"
  | "EM_ANDAMENTO"
  | "ENCERRADA"
  | "SEM_PERIODO";

export type PeriodoPesquisa = {
  disponivel: boolean;
  status: StatusPeriodoPesquisa;
  msg: string;
};
