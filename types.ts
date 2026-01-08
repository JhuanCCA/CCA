
export enum StatusDisputa {
  CANCELADA = 'CANCELADA',
  FRACASSADA = 'FRACASSADA',
  DESERTA = 'DESERTA',
  PUBLICADA = 'PUBLICADA',
  SUSPENSA = 'SUSPENSA',
  CONCLUIDA = 'CONCLUÍDA'
}

export interface BiddingRecord {
  id: string;
  entidade: string;
  numDisputa: string;
  numProcesso: string;
  dataDisputa: string;
  mes: string;
  ano: string;
  objeto: string;
  categoria: string;
  responsavelTecnico: string;
  gestorImediato: string;
  regulamento: string;
  registroPreco: boolean;
  minuta: boolean;
  tipo: string;
  metaDias: number;
  statusDisputa: StatusDisputa;
  participantes: number;
  valorReferencia: number;
  valorDisputa: number;
  valorSaving: number; // calculated
  savingPercent: number; // calculated
  itensSolicitados: number;
  itensLicitados: number;
  itensFracassados: number;
  percentItensFracassados: number; // calculated
  statusSucesso: string;
  observacao: string;
  motivoCancelamento: string;
  inicioSuprimentos: string;
  inicioCCA: string;
  publicacao: string;
  resultadoFinal: string;
  
  // Lead times / Diff days
  diasInicioLicitacao: number; // gg
  diasInicioCCAPublicacao: number; // hh
  diasPublicacaoDisputa: number; // ii
  leadTimeOrquestra: number; // jj
  inicioSuprimentosFinal: number; // kk
  leadTimeIndicador: number; // ll (Resultado Final - Inicio CCA)
  ccaFinal: number; // mm
}

export type BiddingFormData = Omit<BiddingRecord, 'id' | 'valorSaving' | 'savingPercent' | 'percentItensFracassados' | 'leadTimeIndicador'>;
