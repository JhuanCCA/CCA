
import React, { useMemo } from 'react';
import { BiddingRecord, StatusDisputa } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../utils';

interface DashboardProps {
  biddings: BiddingRecord[];
}

const StatCard = ({ title, value, subtitle, color }: { title: string, value: string | number, subtitle?: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
    <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ biddings }) => {
  const stats = useMemo(() => {
    const total = biddings.length;
    const completed = biddings.filter(b => b.statusDisputa === StatusDisputa.CONCLUIDA).length;
    const totalSaving = biddings.reduce((acc, b) => acc + (b.valorSaving || 0), 0);
    const avgLeadTime = biddings.length > 0 
      ? biddings.reduce((acc, b) => acc + (b.leadTimeIndicador || 0), 0) / biddings.length 
      : 0;

    const statusData = Object.values(StatusDisputa).map(status => ({
      name: status,
      value: biddings.filter(b => b.statusDisputa === status).length
    })).filter(s => s.value > 0);

    return { total, completed, totalSaving, avgLeadTime, statusData };
  }, [biddings]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Licitações" value={stats.total} color="text-blue-600" subtitle="Cadastradas no sistema" />
        <StatCard title="Concluídas" value={stats.completed} color="text-green-600" subtitle={`${((stats.completed/stats.total || 0)*100).toFixed(1)}% do total`} />
        <StatCard title="Economia (Saving)" value={formatCurrency(stats.totalSaving)} color="text-blue-700" subtitle="Total acumulado" />
        <StatCard title="Lead Time Médio" value={`${stats.avgLeadTime.toFixed(1)} dias`} color="text-purple-600" subtitle="Média global (CCA > Final)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h4 className="text-lg font-semibold mb-6 text-gray-700">Status das Disputas</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.statusData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h4 className="text-lg font-semibold mb-6 text-gray-700">Volume por Entidade (Top 5)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={
              Object.entries(biddings.reduce((acc: any, curr) => {
                acc[curr.entidade] = (acc[curr.entidade] || 0) + 1;
                return acc;
              }, {}))
                .sort((a: any, b: any) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, value]) => ({ name, value }))
            }>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
