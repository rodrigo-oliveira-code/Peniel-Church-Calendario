import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { ArrowLeft, Cake, Gift } from 'lucide-react';
import { SECTORS } from '../constants';
import { generateBirthdayMessage } from '../services/geminiService';

export const Birthdays: React.FC = () => {
  const { users, setView } = useApp();
  const [message, setMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sort users by upcoming birthday
  const sortedUsers = [...users].sort((a, b) => {
    const today = new Date();
    const dateA = new Date(a.birthDate);
    const dateB = new Date(b.birthDate);
    
    // Set year to current year to compare just month/day
    dateA.setFullYear(today.getFullYear());
    dateB.setFullYear(today.getFullYear());

    if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
    if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);

    return dateA.getTime() - dateB.getTime();
  });

  const handleGenerateMessage = async (name: string, id: string) => {
      setLoadingId(id);
      const msg = await generateBirthdayMessage(name);
      setMessage(`${name}: "${msg}"`);
      setLoadingId(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setView('DASHBOARD')} className="pl-0 hover:bg-transparent hover:text-blue-600">
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Cake className="mr-2 text-pink-500"/> Aniversariantes
        </h1>
      </div>

      {message && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg flex justify-between items-center animate-fadeIn">
              <p className="text-purple-800 italic">{message}</p>
              <button onClick={() => setMessage(null)} className="text-purple-400 hover:text-purple-600">x</button>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedUsers.map(u => {
            const bday = new Date(u.birthDate);
            const displayDate = bday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
            
            return (
                <div key={u.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-800">{u.name}</h3>
                        <p className="text-sm text-slate-500">{displayDate}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                            {u.sectorIds.map(sid => {
                                const s = SECTORS.find(sec => sec.id === sid);
                                return s ? (
                                    <span key={sid} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                        {s.name}
                                    </span>
                                ) : null
                            })}
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="text-pink-500 hover:bg-pink-50 hover:text-pink-600"
                        onClick={() => handleGenerateMessage(u.name, u.id)}
                        isLoading={loadingId === u.id}
                        title="Gerar mensagem"
                    >
                        <Gift size={18} />
                    </Button>
                </div>
            );
        })}
      </div>
    </div>
  );
};