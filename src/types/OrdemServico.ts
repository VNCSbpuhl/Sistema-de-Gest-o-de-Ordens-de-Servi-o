export interface OrdemServico {
  id: number;
  data: string;
  nome_cliente: string;
  nome_aparelho: string;
  numero_serie: string;
  motivo_reparo: string;
  servico_realizado: string;
  valor_servico: number;
  finalizado: boolean;
}

