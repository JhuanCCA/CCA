
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileSpreadsheet, 
  Database, 
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { BiddingRecord } from './types';
import { exportToCSV, generateId } from './utils';
import Dashboard from './components/Dashboard';
import BiddingForm from './components/BiddingForm';
import BiddingTable from './components/BiddingTable';

// Logo oficial SESI SENAI (Fallback de alta qualidade)
const SESI_SENAI_LOGO = "https://www.portaldaindustria.com.br/media/filer_public/30/0b/300b9a9d-168a-4b95-888e-67013898651a/logo_sesi_senai.png";

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg translate-x-1 border border-blue-500/30' 
        : 'text-blue-100/70 hover:bg-blue-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-semibold">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [biddings, setBiddings] = useState<BiddingRecord[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simulação de Banco de Dados em Nuvem (Persistência via LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem('licit_pro_db');
    if (saved) {
      try {
        setBiddings(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar base de dados:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('licit_pro_db', JSON.stringify(biddings));
  }, [biddings]);

  const handleAddBidding = (record: BiddingRecord) => {
    const newRecord = { ...record, id: generateId() };
    setBiddings(prev => [newRecord, ...prev]);
  };

  const handleUpdateBidding = (record: BiddingRecord) => {
    setBiddings(prev => prev.map(b => b.id === record.id ? record : b));
  };

  const handleDeleteBidding = (id: string) => {
    if (confirm("Deseja remover permanentemente este registro da base de dados?")) {
      setBiddings(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleBackup = () => {
    exportToCSV(biddings, `LICIT_PRO_BACKUP_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex bg-slate-50 overflow-hidden font-sans">
        {/* Mobile Toggle */}
        <button 
          className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-blue-900 text-white rounded-full shadow-xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Corporativa */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#1e3a8a] text-white transform transition-transform duration-300 ease-in-out border-r border-blue-900 shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header Sidebar - Branding solicitado na imagem */}
            <div className="p-10 bg-white flex flex-col items-center justify-center space-y-4 border-b border-gray-100">
              <img 
                src={SESI_SENAI_LOGO} 
                alt="Logo SESI SENAI" 
                className="max-w-[190px] h-auto object-contain mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).classList.add('hidden');
                }}
              />
              <div className="text-center">
                <h1 className="text-3xl font-[900] text-[#1e3a8a] tracking-tight leading-none mb-1">LICIT PRO</h1>
                <p className="text-[11px] text-blue-500 font-extrabold uppercase tracking-[0.15em]">Gestão de Licitações</p>
              </div>
            </div>

            <nav className="flex-1 p-6 space-y-3 mt-6">
              <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={window.location.hash === '#/' || window.location.hash === ''} />
              <SidebarItem to="/new" icon={PlusCircle} label="Novo Lançamento" active={window.location.hash === '#/new'} />
              <SidebarItem to="/list" icon={FileSpreadsheet} label="Base de Dados" active={window.location.hash === '#/list'} />
            </nav>

            {/* Ações de Sistema e Backup */}
            <div className="p-6 space-y-4 bg-[#172554]">
              <button 
                onClick={handleBackup}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all font-bold shadow-xl border border-blue-400/20 active:scale-95"
              >
                <Database size={18} />
                <span>Realizar Backup</span>
              </button>
              <div className="flex items-center justify-center space-x-2 text-[10px] text-blue-300/80 font-bold tracking-widest uppercase">
                <ShieldCheck size={12} />
                <span>Base de Dados Protegida</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Painel do Analista</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Controle Operacional Interno</p>
            </div>
            
            <div className="flex items-center space-x-8">
              {/* Ajuste conforme solicitado na imagem: Setor Contratação e Alienação */}
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">Contratação e Alienação</p>
                <div className="flex items-center justify-end space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-[10px] text-green-600 font-black uppercase">Base Online</p>
                </div>
              </div>
              
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 font-black shadow-inner group hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <span className="text-sm">LP</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard biddings={biddings} />} />
                <Route path="/new" element={<BiddingForm onSave={handleAddBidding} />} />
                <Route path="/edit/:id" element={<BiddingForm biddings={biddings} onSave={handleUpdateBidding} />} />
                <Route path="/list" element={<BiddingTable biddings={biddings} onDelete={handleDeleteBidding} />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
