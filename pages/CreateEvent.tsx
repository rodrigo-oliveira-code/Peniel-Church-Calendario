import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SECTORS } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeft, Sparkles, Mail, AlertTriangle } from 'lucide-react';
import { generateEventDescription } from '../services/geminiService';
import { RecurrenceType } from '../types';

export const CreateEvent: React.FC = () => {
  const { user, addEvent, updateEvent, setView, eventToEditId, events, notifySectorMembers } = useApp();
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const isEditing = !!eventToEditId;
  const existingEvent = isEditing ? events.find(e => e.id === eventToEditId) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    sectorId: user?.sectorIds[0] || 'global',
    recurrence: 'NONE' as RecurrenceType
  });

  const [sendEmail, setSendEmail] = useState(true);

  useEffect(() => {
    if (existingEvent) {
      const dateObj = new Date(existingEvent.date);
      setFormData({
        title: existingEvent.title,
        description: existingEvent.description,
        date: dateObj.toISOString().split('T')[0],
        time: dateObj.toTimeString().slice(0, 5),
        location: existingEvent.location,
        sectorId: existingEvent.sectorId,
        recurrence: existingEvent.recurrence
      });
    }
  }, [existingEvent]);

  if (!user || user.role !== 'LEADER') {
    return <div>Acesso negado. Apenas líderes podem criar eventos.</div>;
  }

  // Filter sectors user can manage (global + their sectors)
  const availableSectors = [
    { id: 'global', name: 'Geral (Toda Igreja)' },
    ...SECTORS.filter(s => user.sectorIds.includes(s.id))
  ];

  const handleAiGenerate = async () => {
    if (!formData.title) return;
    setLoadingAi(true);
    const sectorName = availableSectors.find(s => s.id === formData.sectorId)?.name || 'Geral';
    const desc = await generateEventDescription(formData.title, sectorName);
    setFormData(prev => ({ ...prev, description: desc }));
    setLoadingAi(false);
  };

  const checkForConflict = (newDate: Date): boolean => {
    // Check if any event starts within 1 hour of this new event
    // Ignoring the event currently being edited
    const conflict = events.find(e => {
        if (isEditing && e.id === eventToEditId) return false;

        const existingDate = new Date(e.date);
        
        // Exact match check (simplest for now, can be expanded to range)
        // We compare the ISO string up to minutes
        const t1 = existingDate.toISOString().slice(0, 16); // "2023-10-10T10:00"
        const t2 = newDate.toISOString().slice(0, 16);

        return t1 === t2;
    });

    return !!conflict;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    // Conflict Validation
    if (checkForConflict(dateTime)) {
        setErrorMsg("Já existe um evento cadastrado nesta data e horário! Por favor, escolha outro horário.");
        window.scrollTo(0, 0);
        return;
    }

    const eventPayload = {
      id: isEditing ? existingEvent!.id : crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      date: dateTime.toISOString(),
      location: formData.location,
      sectorId: formData.sectorId,
      createdBy: existingEvent ? existingEvent.createdBy : user.id,
      recurrence: formData.recurrence
    };

    if (isEditing) {
      updateEvent(eventPayload);
    } else {
      addEvent(eventPayload);
    }

    if (sendEmail) {
      notifySectorMembers(formData.sectorId, formData.title);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => setView('DASHBOARD')} className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600">
        <ArrowLeft size={18} className="mr-2" />
        Voltar
      </Button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          {isEditing ? 'Editar Evento' : 'Agendar Novo Evento'}
        </h1>

        {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                <p className="font-medium">{errorMsg}</p>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Setor Responsável</label>
              <select 
                value={formData.sectorId}
                onChange={e => setFormData({...formData, sectorId: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                {availableSectors.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Título do Evento</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Culto da Vitória"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Descrição</label>
              <button 
                type="button"
                onClick={handleAiGenerate}
                disabled={!formData.title || loadingAi}
                className="text-xs text-purple-600 font-semibold flex items-center hover:text-purple-700 disabled:opacity-50"
              >
                <Sparkles size={14} className="mr-1" />
                {loadingAi ? 'Gerando...' : 'Gerar com IA'}
              </button>
            </div>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Descreva o que vai acontecer no evento..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Data</label>
              <input 
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Hora</label>
              <input 
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
             <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Recorrência</label>
              <select 
                value={formData.recurrence}
                onChange={e => setFormData({...formData, recurrence: e.target.value as RecurrenceType})}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="NONE">Único</option>
                <option value="WEEKLY">Semanal</option>
                <option value="BIWEEKLY">Quinzenal</option>
                <option value="MONTHLY">Mensal</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Local</label>
            <input 
              type="text"
              required
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ex: Templo Principal"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
             <input 
              type="checkbox" 
              id="sendEmail" 
              checked={sendEmail} 
              onChange={e => setSendEmail(e.target.checked)} 
              className="w-5 h-5 accent-blue-600"
            />
             <label htmlFor="sendEmail" className="text-sm text-blue-800 cursor-pointer select-none flex items-center">
                <Mail size={16} className="mr-2"/>
                Enviar email de notificação para membros do setor
             </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <Button type="button" variant="secondary" onClick={() => setView('DASHBOARD')}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Agendar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};