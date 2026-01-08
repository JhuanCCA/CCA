
import { BiddingRecord, StatusDisputa } from './types';

export const calculateDaysBetween = (date1: string, date2: string): number => {
  if (!date1 || !date2) return 0;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const exportToCSV = (data: BiddingRecord[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = (row as any)[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const DEFAULT_BIDDING_RECORD: BiddingRecord = {
  id: '',
  entidade: '',
  numDisputa: '',
  numProcesso: '',
  dataDisputa: '',
  mes: '',
  ano: new Date().getFullYear().toString(),
  objeto: '',
  categoria: '',
  responsavelTecnico: '',
  gestorImediato: '',
  regulamento: '',
  registroPreco: false,
  minuta: false,
  tipo: '',
  metaDias: 25,
  statusDisputa: StatusDisputa.PUBLICADA,
  participantes: 0,
  valorReferencia: 0,
  valorDisputa: 0,
  valorSaving: 0,
  savingPercent: 0,
  itensSolicitados: 0,
  itensLicitados: 0,
  itensFracassados: 0,
  percentItensFracassados: 0,
  statusSucesso: '',
  observacao: '',
  motivoCancelamento: '',
  inicioSuprimentos: '',
  inicioCCA: '',
  publicacao: '',
  resultadoFinal: '',
  diasInicioLicitacao: 0,
  diasInicioCCAPublicacao: 0,
  diasPublicacaoDisputa: 0,
  leadTimeOrquestra: 0,
  inicioSuprimentosFinal: 0,
  leadTimeIndicador: 0,
  ccaFinal: 0,
};
