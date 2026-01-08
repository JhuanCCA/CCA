
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
// Fixed: Added PlusCircle to the imports
import { Search, Edit2, Trash2, Download, Filter, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { BiddingRecord, StatusDisputa } from '../types';
import { formatCurrency, exportToCSV } from '../utils';

interface BiddingTableProps {
  biddings: BiddingRecord[];
  onDelete: (id: string) => void;
}

const StatusBadge = ({ status }: { status: StatusDisputa }) => {
  const styles: Record<StatusDisputa, string> = {
    [StatusDisputa.CANCELADA]: 'bg-red-100 text-red-700 border-red-200',
    [StatusDisputa.FRACASSADA]: 'bg-orange-100 text-orange-700 border-orange-200',
    [StatusDisputa.DESERTA]: 'bg-gray-100 text-gray-700 border-gray-200',
    [StatusDisputa.PUBLICADA]: 'bg-blue-100 text-blue-700 border-blue-200',
    [StatusDisputa.SUSPENSA]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [StatusDisputa.CONCLUIDA]: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

const BiddingTable: React.FC<BiddingTableProps> = ({ biddings, onDelete }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof BiddingRecord>('numDisputa');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredBiddings = useMemo(() => {
    return biddings
      .filter(b => 
        b.entidade.toLowerCase().includes(search.toLowerCase()) ||
        b.numDisputa.toLowerCase().includes(search.toLowerCase()) ||
        b.numProcesso.toLowerCase().includes(search.toLowerCase()) ||
        b.objeto.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [biddings, search, sortField, sortOrder]);

  const handleSort = (field: keyof BiddingRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    exportToCSV(filteredBiddings, `relatorio_licitacoes_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por entidade, disputa ou objeto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            <Download size={18} />
            <span>Exportar CSV</span>
          </button>
          <Link 
            to="/new"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            <PlusCircle size={18} />
            <span>Nova Licitação</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('entidade')}>
                  <div className="flex items-center space-x-1 text-xs font-bold text-gray-500 uppercase">
                    <span>Entidade</span>
                    {sortField === 'entidade' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('numDisputa')}>
                  <div className="flex items-center space-x-1 text-xs font-bold text-gray-500 uppercase">
                    <span>Nº Disputa</span>
                    {sortField === 'numDisputa' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="text-xs font-bold text-gray-500 uppercase">Objeto</div>
                </th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('valorReferencia')}>
                  <div className="flex items-center space-x-1 text-xs font-bold text-gray-500 uppercase">
                    <span>Val. Ref.</span>
                    {sortField === 'valorReferencia' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('statusDisputa')}>
                  <div className="flex items-center space-x-1 text-xs font-bold text-gray-500 uppercase">
                    <span>Status</span>
                    {sortField === 'statusDisputa' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('leadTimeIndicador')}>
                  <div className="flex items-center space-x-1 text-xs font-bold text-gray-500 uppercase">
                    <span>Lead Time</span>
                    {sortField === 'leadTimeIndicador' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="text-xs font-bold text-gray-500 uppercase">Ações</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBiddings.length > 0 ? filteredBiddings.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{b.entidade}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{b.numDisputa}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 truncate max-w-xs">{b.objeto}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(b.valorReferencia)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.statusDisputa} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${b.leadTimeIndicador > b.metaDias ? 'text-red-600' : 'text-green-600'}`}>
                      {b.leadTimeIndicador}d
                    </span>
                    <span className="text-[10px] text-gray-400 block">Meta: {b.metaDias}d</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        to={`/edit/${b.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => onDelete(b.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                    Nenhuma licitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BiddingTable;
