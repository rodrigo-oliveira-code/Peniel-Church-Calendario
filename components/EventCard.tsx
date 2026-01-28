import React from 'react';
import { Calendar, MapPin, Repeat, Edit, Trash2 } from 'lucide-react';
import { Event, Role } from '../types';
import { SECTORS } from '../constants';
import { useApp } from '../context/AppContext';
import { Button } from './Button';

interface EventCardProps {
  event: Event;
}

const RecurrenceLabel = {
  'NONE': null,
  'WEEKLY': 'Semanal',
  'BIWEEKLY': 'Quinzenal',
  'MONTHLY': 'Mensal'
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user, deleteEvent, startEditingEvent } = useApp();
  
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('pt-BR', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'long' 
  });
  const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const sector = event.sectorId === 'global' 
    ? { name: 'Geral / Toda Igreja', color: 'bg-slate-800 text-white' }
    : SECTORS.find(s => s.id === event.sectorId) || { name: 'Desconhecido', color: 'bg-gray-100 text-gray-800' };

  // Can edit if leader
  const canEdit = user?.role === Role.LEADER;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sector.color} truncate max-w-[60%]`}>
          {sector.name}
        </span>
        <span className="text-sm text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded whitespace-nowrap">
          {formattedDate} • {formattedTime}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-grow">{event.description}</p>
      
      <div className="space-y-3 mt-auto">
        <div className="flex items-center text-sm text-slate-500 gap-4">
            <div className="flex items-center gap-1.5">
            <MapPin size={16} />
            <span className="truncate">{event.location}</span>
            </div>
        </div>

        {event.recurrence !== 'NONE' && (
             <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                <Repeat size={12} />
                <span>{RecurrenceLabel[event.recurrence]}</span>
             </div>
        )}

        {canEdit && (
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                 <button 
                    onClick={() => deleteEvent(event.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Excluir"
                >
                    <Trash2 size={16} />
                 </button>
                 <button 
                    onClick={() => startEditingEvent(event.id)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                >
                    <Edit size={16} />
                 </button>
            </div>
        )}
      </div>
    </div>
  );
};