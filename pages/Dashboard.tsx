import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import { Role, User, Event } from '../types';
import { Plus, PartyPopper, CalendarDays, Filter, Cake, BarChart3, Users, UserPlus, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { SECTORS } from '../constants';

type FeedItem = 
  | { type: 'EVENT'; data: Event; sortDate: number }
  | { type: 'BIRTHDAY'; data: User; sortDate: number };

const StatCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
        <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10`}>
            <Icon size={24} className={colorClass.replace('bg-', 'text-').replace('100', '600')} />
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        </div>
    </div>
);

const SectionHeader = ({ title, icon: Icon, action }: { title: string, icon: any, action?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                <Icon size={18} />
             </div>
             {title}
        </h2>
        {action}
    </div>
);

export const Dashboard: React.FC = () => {
  const { user, getVisibleEvents, setView, users } = useApp();
  const visibleEvents = getVisibleEvents();
  
  const [showEvents, setShowEvents] = useState(true);
  const [showBirthdays, setShowBirthdays] = useState(true);

  if (!user) return null;

  const totalMembers = users.length;
  const unassignedMembers = users.filter(u => u.sectorIds.length === 0).length;
  const nextEvent = visibleEvents.find(e => new Date(e.date) > new Date());
  
  // Membros pendentes que o líder pode ver (aqueles sem setor)
  const pendingUsers = users.filter(u => u.sectorIds.length === 0);

  const feedItems: FeedItem[] = [];
  if (showEvents) {
    visibleEvents.forEach(e => {
      feedItems.push({ type: 'EVENT', data: e, sortDate: new Date(e.date).getTime() });
    });
  }

  if (showBirthdays) {
    const today = new Date();
    users.forEach(u => {
      const bDate = new Date(u.birthDate);
      bDate.setFullYear(today.getFullYear());
      if (bDate < new Date(new Date().setHours(0,0,0,0))) bDate.setFullYear(today.getFullYear() + 1);
      feedItems.push({ type: 'BIRTHDAY', data: u, sortDate: bDate.getTime() });
    });
  }

  const sortedFeed = feedItems.sort((a, b) => a.sortDate - b.sortDate);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase backdrop-blur-sm">Peniel Church Brazil</span>
            {user.role === Role.LEADER && <span className="bg-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><ShieldCheck size={10} /> Líder</span>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {user.name}!</h1>
          <p className="text-blue-100 mt-1 max-w-md">Que a paz de Cristo esteja com você hoje. Aqui está o resumo da nossa comunidade.</p>
        </div>
        
        {user.role === Role.LEADER && (
            <Button onClick={() => setView('CREATE_EVENT')} className="bg-white text-blue-700 hover:bg-blue-50 relative z-10 border-none px-6 py-3 font-bold rounded-2xl">
              <Plus size={20} className="mr-2" /> Agendar Evento
            </Button>
        )}
        
        <div className="absolute -right-10 -bottom-10 opacity-10">
            <ShieldCheck size={280} />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard icon={Users} label="Total de Membros" value={totalMembers} colorClass="bg-blue-100" />
         <StatCard icon={UserPlus} label="Novos Membros" value={unassignedMembers} colorClass="bg-orange-100" />
         <StatCard icon={CalendarDays} label="Eventos Ativos" value={visibleEvents.length} colorClass="bg-indigo-100" />
         <StatCard icon={Clock} label="Próximo Culto" value={nextEvent ? new Date(nextEvent.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : '--/--'} colorClass="bg-emerald-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-slate-400 px-2 font-bold text-xs uppercase tracking-widest">
                      <Filter size={14} /> Filtros
                  </div>
                  <label className="flex items-center cursor-pointer gap-2 select-none bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all hover:bg-blue-100">
                      <input type="checkbox" checked={showEvents} onChange={e => setShowEvents(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
                      <span className="text-blue-800 text-sm font-bold flex items-center gap-2"><CalendarDays size={16} /> Eventos</span>
                  </label>
                  <label className="flex items-center cursor-pointer gap-2 select-none bg-pink-50 px-4 py-2 rounded-xl border border-pink-100 transition-all hover:bg-pink-100">
                      <input type="checkbox" checked={showBirthdays} onChange={e => setShowBirthdays(e.target.checked)} className="w-4 h-4 accent-pink-600 rounded" />
                      <span className="text-pink-800 text-sm font-bold flex items-center gap-2"><PartyPopper size={16} /> Aniversários</span>
                  </label>
              </div>

              <div className="space-y-4">
                <SectionHeader title="Linha do Tempo Peniel" icon={Clock} />
                {sortedFeed.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Não há atividades programadas para exibir.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedFeed.map((item, index) => {
                       if (item.type === 'EVENT') return <EventCard key={`e-${item.data.id}`} event={item.data} />;
                       const u = item.data;
                       const date = new Date(item.sortDate);
                       const isToday = new Date().toDateString() === date.toDateString();
                       return (
                           <div key={`b-${u.id}-${index}`} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${isToday ? 'bg-gradient-to-r from-pink-50 to-white border-pink-200 shadow-md ring-1 ring-pink-100' : 'bg-white border-slate-100'}`}>
                               <div className="bg-pink-100 text-pink-500 p-4 rounded-2xl">
                                   <Cake size={24} />
                               </div>
                               <div className="flex-1">
                                   <p className="text-base font-bold text-slate-800">{u.name}</p>
                                   <p className="text-xs text-slate-500 font-medium">{isToday ? 'Aniversário HOJE! Parabéns! 🎉' : `Aniversário em ${date.toLocaleDateString('pt-BR', {day: 'numeric', month: 'long'})}`}</p>
                               </div>
                               {isToday && <span className="text-[10px] font-black bg-pink-500 text-white px-3 py-1.5 rounded-full animate-bounce">FESTA</span>}
                           </div>
                       )
                    })}
                  </div>
                )}
              </div>
          </div>

          <div className="space-y-6">
              {user.role === Role.LEADER && (
                  <div className="bg-white rounded-3xl border border-orange-100 shadow-xl overflow-hidden">
                      <div className="bg-orange-50 p-6 border-b border-orange-100 flex justify-between items-center">
                          <h3 className="font-bold text-orange-800 flex items-center gap-2">
                              <UserPlus size={20} /> Aprovações Pendentes
                          </h3>
                          <span className="bg-orange-200 text-orange-800 text-[10px] font-black px-2 py-1 rounded-lg">{pendingUsers.length}</span>
                      </div>
                      <div className="p-4">
                          {pendingUsers.length === 0 ? (
                              <p className="text-center text-sm text-slate-400 py-6 font-medium">Todos os membros foram designados.</p>
                          ) : (
                              <div className="space-y-2">
                                  {pendingUsers.slice(0, 5).map(p => (
                                      <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                          <div className="flex items-center gap-3 overflow-hidden">
                                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-black shrink-0">
                                                  {p.name.charAt(0)}
                                              </div>
                                              <div className="truncate">
                                                  <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Membro Geral</p>
                                              </div>
                                          </div>
                                          <button onClick={() => setView('MEMBERS')} className="p-2 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                              <ArrowRight size={18} />
                                          </button>
                                      </div>
                                  ))}
                                  {pendingUsers.length > 5 && (
                                      <button onClick={() => setView('MEMBERS')} className="w-full text-center text-xs text-blue-600 font-bold py-3 hover:underline">
                                          Ver todos os {pendingUsers.length} pendentes
                                      </button>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
              )}

              <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6">
                  <SectionHeader title="Estatísticas Peniel" icon={BarChart3} />
                  <div className="h-48 flex items-end gap-3 justify-between px-2 pt-4">
                       {SECTORS.map(s => {
                           const count = users.filter(u => u.sectorIds.includes(s.id)).length;
                           const height = Math.max((count / users.length) * 100, 10) || 10;
                           return (
                               <div key={s.id} className="flex flex-col items-center gap-2 group w-full">
                                   <div className="w-full bg-slate-50 rounded-xl relative overflow-hidden h-36 flex items-end border border-slate-100">
                                        <div 
                                            className={`w-full ${s.color.split(' ')[0]} opacity-80 group-hover:opacity-100 transition-all rounded-t-lg`}
                                            style={{ height: `${height}%` }}
                                        ></div>
                                   </div>
                                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center" title={s.name}>{s.name.substring(0, 5)}</span>
                               </div>
                           )
                       })}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};