import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Role } from '../types';
import { UserPlus, LogIn, ArrowRight, Heart } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, setView } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      setError('');
    } else {
      setError('Usuário não encontrado. Verifique o e-mail ou faça seu cadastro.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-blue-700 p-8 text-center">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <Heart className="text-white" size={32} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Peniel Church</h1>
            <p className="text-blue-100 text-sm">Brazil - Gestão Eclesiástica Moderna</p>
        </div>

        <div className="p-8">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Acesso do Membro</label>
                <div className="relative">
                    <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Digite seu e-mail cadastrado"
                    />
                </div>
              </div>
              
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                  <span className="font-bold">Ops!</span> {error}
              </div>}

              <Button type="submit" className="w-full justify-center py-3 text-lg shadow-blue-200 bg-blue-700 hover:bg-blue-800">
                Entrar no Sistema
              </Button>
            </form>

            {/* Registration Call to Action */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="text-center">
                <p className="text-slate-600 font-medium mb-3">Novo na Peniel?</p>
                <Button 
                    variant="secondary" 
                    onClick={() => setView('REGISTER')} 
                    className="w-full justify-center border-blue-200 text-blue-700 hover:bg-blue-50 group"
                >
                    <UserPlus size={18} className="mr-2 text-blue-500" />
                    Quero me Auto-Cadastrar
                    <ArrowRight size={16} className="ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-slate-400 mt-3">
                    Seu cadastro passará pela aprovação da liderança.
                </p>
              </div>
            </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">
                Dica: "carlos@igreja.com" (Líder) ou "ana@igreja.com" (Membro)
            </p>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const { register, setView } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'M' as 'M' | 'F',
    role: Role.MEMBER
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Todos os membros começam sem setor (Pendente aprovação da liderança)
    register({
      id: crypto.randomUUID(),
      ...formData,
      sectorIds: [] 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-fadeIn">
        <div className="bg-slate-800 p-6 text-white flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold">Cadastro de Membro</h2>
                <p className="text-slate-400 text-sm">Peniel Church Brazil</p>
            </div>
            <div className="bg-white/10 p-2 rounded-lg">
                <UserPlus size={24} />
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: joao@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                required
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nascimento</label>
                <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gênero</label>
                <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'M'|'F'})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <label className="block text-sm font-bold text-blue-900 mb-2">Interesse de Atuação</label>
             <div className="flex flex-col gap-2">
                <label className="flex items-center cursor-pointer gap-3 p-2 hover:bg-white rounded-lg transition-colors">
                  <input 
                    type="radio" 
                    name="role" 
                    checked={formData.role === Role.MEMBER}
                    onChange={() => setFormData({...formData, role: Role.MEMBER})}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Quero ser Participante</span>
                    <span className="text-xs text-slate-500">Acompanhar cultos e eventos.</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer gap-3 p-2 hover:bg-white rounded-lg transition-colors">
                  <input 
                    type="radio" 
                    name="role" 
                    checked={formData.role === Role.LEADER}
                    onChange={() => setFormData({...formData, role: Role.LEADER})}
                    className="w-4 h-4 accent-blue-600"
                  />
                   <div>
                    <span className="text-sm font-semibold text-slate-800 block">Sou Voluntário / Líder</span>
                    <span className="text-xs text-slate-500">Desejo servir em um ministério.</span>
                  </div>
                </label>
             </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button type="submit" className="w-full justify-center py-3 text-lg bg-blue-700">
                <UserPlus size={18} className="mr-2" />
                Solicitar Cadastro
            </Button>
            
            <button 
                type="button"
                onClick={() => setView('LOGIN')} 
                className="text-slate-500 text-sm hover:text-slate-800 py-2"
            >
                Cancelar e Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};