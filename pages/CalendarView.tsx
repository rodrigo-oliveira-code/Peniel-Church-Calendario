import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus, Trash2, Edit, X, AlignLeft } from 'lucide-react';
import { SECTORS } from '../constants';
import { Event, Role } from '../types';
import { Button } from '../components/Button';

export const CalendarView: React.FC = () => {
  const { getVisibleEvents, user, setView, startEditingEvent, deleteEvent } = useApp();
  const visibleEvents = getVisibleEvents();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    return visibleEvents.filter(e => {
        const eDate = new Date(e.date);
        return eDate.getDate() === day && eDate.getMonth() === month && eDate.getFullYear() === year;
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleDelete = () => {
    if (selectedEvent && window.confirm('Tem certeza que deseja excluir este evento permanentemente?')) {
        deleteEvent(selectedEvent.id);
        setSelectedEvent(null);
    }
  };

  const handleEdit = () => {
    if (selectedEvent) {
        startEditingEvent(selectedEvent.id);
    }
  };

  // Generate grid array
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 capitalize flex items-center gap-2">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        
        <div className="flex items-center gap-4">
             <div className="flex bg-slate-100 rounded-lg p-1">
                <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
                    <ChevronLeft size={20} />
                </button>
                <div className="w-px bg-slate-200 mx-1 my-2"></div>
                <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
                    <ChevronRight size={20} />
                </button>
            </div>
            {user?.role === Role.LEADER && (
                <Button onClick={() => setView('CREATE_EVENT')} className="whitespace-nowrap shadow-md shadow-blue-100">
                    <Plus size={18} className="mr-2" /> Novo Evento
                </Button>
            )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((d, i) => (
                <div key={d} className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:block">
                    {d}
                </div>
            ))}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, i) => (
                <div key={d} className="p-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider md:hidden">
                    {d}
                </div>
            ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-50 gap-px border-b border-slate-200">
            {totalSlots.map((day, index) => {
                if (day === null) {
                    return <div key={`blank-${index}`} className="min-h-[100px] md:min-h-[140px] bg-slate-50/50"></div>;
                }

                const dayEvents = getEventsForDay(day);
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                return (
                    <div key={day} className={`min-h-[100px] md:min-h-[140px] bg-white p-2 relative group transition-colors hover:bg-blue-50/10`}>
                        <div className="flex justify-between items-start mb-2">
                             <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-700'}`}>
                                {day}
                             </span>
                        </div>
                        
                        <div className="space-y-1.5 overflow-y-auto max-h-[80px] md:max-h-[100px] no-scrollbar">
                            {dayEvents.map(ev => {
                                const sector = SECTORS.find(s => s.id === ev.sectorId);
                                const time = new Date(ev.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' });
                                
                                return (
                                    <div 
                                        key={ev.id} 
                                        onClick={() => setSelectedEvent(ev)}
                                        className="text-xs p-1.5 rounded-md border-l-[3px] bg-slate-50 hover:bg-white shadow-sm hover:shadow-md transition-all cursor-pointer select-none group/event"
                                        style={{ borderLeftColor: sector ? sector.color.split(' ')[0].replace('bg-', '') : '#334155' }}
                                    >
                                        <div className="font-semibold text-slate-800 truncate leading-tight">{ev.title}</div>
                                        <div className="flex items-center gap-1 text-slate-500 mt-1 text-[10px]">
                                            <Clock size={10} /> {time}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn transform scale-100 transition-all">
                <div className="relative">
                    <div className={`h-24 w-full flex items-end p-6 ${
                        selectedEvent.sectorId === 'global' 
                        ? 'bg-slate-800' 
                        : SECTORS.find(s => s.id === selectedEvent.sectorId)?.color.split(' ')[0] || 'bg-gray-200'
                    }`}>
                         <h3 className="text-2xl font-bold text-white shadow-sm">{selectedEvent.title}</h3>
                    </div>
                    <button 
                        onClick={() => setSelectedEvent(null)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-1.5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider mb-4">
                        {selectedEvent.sectorId === 'global' ? 'Geral' : SECTORS.find(s => s.id === selectedEvent.sectorId)?.name}
                    </span>
                    
                    <div className="space-y-5 mb-8">
                        <div className="flex items-start gap-4">
                             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <Clock size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-slate-800">
                                    {new Date(selectedEvent.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {new Date(selectedEvent.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                             </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                             <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
                                <MapPin size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-slate-800">Localização</p>
                                <p className="text-sm text-slate-500">{selectedEvent.location}</p>
                             </div>
                        </div>

                        <div className="flex items-start gap-4">
                             <div className="p-2 bg-slate-50 text-slate-600 rounded-lg shrink-0">
                                <AlignLeft size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-slate-800">Sobre</p>
                                <p className="text-sm text-slate-500 leading-relaxed">{selectedEvent.description}</p>
                             </div>
                        </div>
                    </div>

                    {user?.role === Role.LEADER && (
                        <div className="flex gap-3 border-t border-slate-100 pt-5">
                            <Button variant="secondary" onClick={handleEdit} className="flex-1">
                                <Edit size={16} className="mr-2" /> Editar
                            </Button>
                            <Button variant="danger" onClick={handleDelete} className="flex-1">
                                <Trash2 size={16} className="mr-2" /> Excluir
                            </Button>
                        </div>
                    )}
                </div>
             </div>
        </div>
      )}
    </div>
  );
};