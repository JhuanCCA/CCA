
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, BarChart3, Clock } from 'lucide-react';
import { BiddingRecord, StatusDisputa } from '../types';
import { DEFAULT_BIDDING_RECORD, calculateDaysBetween } from '../utils';

interface BiddingFormProps {
  biddings?: BiddingRecord[];
  onSave: (record: BiddingRecord) => void;
}

const InputField = ({ label, name, type = "text", value, onChange, required = false, disabled = false, placeholder = "" }: any) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-400 text-sm font-medium text-slate-800`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false, placeholder = "Selecione..." }: any) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-sm font-medium text-slate-800 appearance-none"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const BiddingForm: React.FC<BiddingFormProps> = ({ biddings = [], onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BiddingRecord>(DEFAULT_BIDDING_RECORD);

  useEffect(() => {
    if (id) {
      const existing = biddings.find(b => b.id === id);
      if (existing) setFormData(existing);
    }
  }, [id, biddings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === 'number') newValue = parseFloat(value) || 0;
    else if (type === 'checkbox') newValue = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Cálculos Financeiros
      updated.valorSaving = updated.valorReferencia - updated.valorDisputa;
      updated.savingPercent = updated.valorReferencia > 0 ? (updated.valorSaving / updated.valorReferencia) * 100 : 0;
      
      // Cálculos de Itens
      updated.percentItensFracassados = updated.itensSolicitados > 0 ? (updated.itensFracassados / updated.itensSolicitados) * 100 : 0;
      
      // Lead Times (gg, hh, ii, jj, kk, mm)
      updated.diasInicioLicitacao = calculateDaysBetween(updated.inicioSuprimentos, updated.dataDisputa);
      updated.diasInicioCCAPublicacao = calculateDaysBetween(updated.inicioCCA, updated.publicacao);
      updated.diasPublicacaoDisputa = calculateDaysBetween(updated.publicacao, updated.dataDisputa);
      updated.leadTimeOrquestra = calculateDaysBetween(updated.inicioSuprimentos, updated.publicacao);
      updated.inicioSuprimentosFinal = calculateDaysBetween(updated.inicioSuprimentos, updated.resultadoFinal);
      updated.ccaFinal = calculateDaysBetween(updated.inicioCCA, updated.resultadoFinal);
      
      // REGRA CRÍTICA: Lead Time Indicador (Resultado Final - Início CCA)
      updated.leadTimeIndicador = calculateDaysBetween(updated.inicioCCA, updated.resultadoFinal);

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    navigate('/list');
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {id ? 'Atualizar Licitação' : 'Cadastro de Licitação'}
            </h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Lançamento de Dados Operacionais</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all font-bold"
        >
          <Save size={20} />
          <span>Confirmar Registro</span>
        </button>
      </div>

      <form className="space-y-10">
        {/* Seção 1: Identificação */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={18} /></div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">I. Identificação do Processo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SelectField 
              label="Entidade" 
              name="entidade" 
              value={formData.entidade} 
              onChange={handleChange} 
              required 
              placeholder="Selecione a Entidade"
              options={["SESI", "SENAI", "SESI SENAI"]} 
            />
            <InputField label="Nº Disputa" name="numDisputa" value={formData.numDisputa} onChange={handleChange} required />
            <InputField label="Nº Processo" name="numProcesso" value={formData.numProcesso} onChange={handleChange} required />
            <InputField label="Data Disputa" name="dataDisputa" type="date" value={formData.dataDisputa} onChange={handleChange} />
            <InputField label="Mês" name="mes" value={formData.mes} onChange={handleChange} />
            <InputField label="Ano" name="ano" type="number" value={formData.ano} onChange={handleChange} />
            <div className="md:col-span-3">
              <InputField label="Objeto" name="objeto" value={formData.objeto} onChange={handleChange} required placeholder="Descrição detalhada do item ou serviço..." />
            </div>
            <InputField label="Categoria" name="categoria" value={formData.categoria} onChange={handleChange} />
            <InputField label="Resp. Técnico" name="responsavelTecnico" value={formData.responsavelTecnico} onChange={handleChange} />
            <InputField label="Gestor Imediato" name="gestorImediato" value={formData.gestorImediate} onChange={handleChange} />
          </div>
        </div>

        {/* Seção 2: Configurações */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Clock size={18} /></div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">II. Configurações & Meta</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <InputField label="Regulamento" name="regulamento" value={formData.regulamento} onChange={handleChange} />
            <InputField label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} />
            <InputField label="Meta (Dias)" name="metaDias" type="number" value={formData.metaDias} onChange={handleChange} />
            <SelectField 
              label="Status Disputa" 
              name="statusDisputa" 
              value={formData.statusDisputa} 
              onChange={handleChange}
              options={Object.values(StatusDisputa)} 
            />
            <div className="md:col-span-4 flex items-center space-x-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="registroPreco" 
                  checked={formData.registroPreco} 
                  onChange={handleChange}
                  className="w-6 h-6 text-blue-600 border-slate-300 rounded-lg focus:ring-blue-500 transition-all" 
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">Registro de Preço?</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="minuta" 
                  checked={formData.minuta} 
                  onChange={handleChange}
                  className="w-6 h-6 text-blue-600 border-slate-300 rounded-lg focus:ring-blue-500 transition-all" 
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">Possui Minuta?</span>
              </label>
            </div>
          </div>
        </div>

        {/* Seção 3: Performance e Itens */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><BarChart3 size={18} /></div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">III. Indicadores & Valores</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <InputField label="Participantes" name="participantes" type="number" value={formData.participantes} onChange={handleChange} />
            <InputField label="Valor Ref. (R$)" name="valorReferencia" type="number" value={formData.valorReferencia} onChange={handleChange} />
            <InputField label="Valor Disp. (R$)" name="valorDisputa" type="number" value={formData.valorDisputa} onChange={handleChange} />
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
               <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">SAVING CALCULADO (R$)</label>
               <span className="text-lg font-black text-blue-700">R$ {formData.valorSaving.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <InputField label="Saving (%)" name="savingPercent" value={formData.savingPercent.toFixed(2) + '%'} disabled />
            <InputField label="Itens Solicitados" name="itensSolicitados" type="number" value={formData.itensSolicitados} onChange={handleChange} />
            <InputField label="Itens Licitados" name="itensLicitados" type="number" value={formData.itensLicitados} onChange={handleChange} />
            <InputField label="Itens Fracassados" name="itensFracassados" type="number" value={formData.itensFracassados} onChange={handleChange} />
            
            <InputField label="% Fracassados" name="percentItensFracassados" value={formData.percentItensFracassados.toFixed(2) + '%'} disabled />
            <div className="md:col-span-3">
              <InputField label="Status de Sucesso" name="statusSucesso" value={formData.statusSucesso} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Seção 4: Datas Críticas */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock size={18} /></div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">IV. Cronograma & Lead Time</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <InputField label="Início Suprimentos" name="inicioSuprimentos" type="date" value={formData.inicioSuprimentos} onChange={handleChange} />
            <InputField label="Início CCA" name="inicioCCA" type="date" value={formData.inicioCCA} onChange={handleChange} />
            <InputField label="Publicação" name="publicacao" type="date" value={formData.publicacao} onChange={handleChange} />
            <InputField label="Resultado Final" name="resultadoFinal" type="date" value={formData.resultadoFinal} onChange={handleChange} />
            
            {/* Lead Time Display */}
            <div className="md:col-span-4 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Lead Time Indicador</span>
                <div className="text-3xl font-black mt-1">{formData.leadTimeIndicador} <span className="text-sm font-normal">Dias</span></div>
                <p className="text-[10px] mt-2 opacity-60">(CCA > Resultado Final)</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Início > Disputa</span>
                <div className="text-xl font-black text-slate-700 mt-1">{formData.diasInicioLicitacao} Dias</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CCA > Pub.</span>
                <div className="text-xl font-black text-slate-700 mt-1">{formData.diasInicioCCAPublicacao} Dias</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pub. > Disputa</span>
                <div className="text-xl font-black text-slate-700 mt-1">{formData.diasPublicacaoDisputa} Dias</div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 5: Finalização */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><BarChart3 size={18} /></div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">V. Observações Finais</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight">Observações Gerais</label>
              <textarea 
                name="observacao" 
                rows={4}
                value={formData.observacao}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm font-medium"
              />
            </div>
            <InputField label="Motivo do Cancelamento" name="motivoCancelamento" value={formData.motivoCancelamento} onChange={handleChange} placeholder="Preencher somente se STATUS = CANCELADA" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BiddingForm;
