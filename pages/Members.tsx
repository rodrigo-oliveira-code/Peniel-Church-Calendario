import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, User } from '../types';
import { SECTORS } from '../constants';
import { Search, User as UserIcon, Shield, Phone, Mail, Pencil, X, Save, CheckSquare, Square, Trash2, Plus, AlertCircle, Ban, Filter } from 'lucide-react';
import { Button } from '../components/Button';

const EMPTY_USER: User = {
  id: '',
  name: '',
  email: '',
  phone: '',
  gender: 'M',
  role: Role.MEMBER,
  sectorIds: [],
  birthDate: ''
};

export const Members: React.FC = () => {
  const { users, user: currentUser, updateUser, addUser, deleteUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // SEGURANÇA: Apenas líderes acessam esta tela
  if (!currentUser || currentUser.role !== Role.LEADER) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
              <div className="bg-red-50 p-6 rounded-full mb-4">
                  <Ban size={48} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Acesso Negado</h2>
              <p className="text-slate-500 max-w-md">
                  Somente líderes registrados podem acessar a gestão de membros e departamentos.
              </p>
          </div>
      );
  }
  
  // REGRA DE VISIBILIDADE: 
  // O Líder vê quem está nos seus setores OU quem não tem setor nenhum (Geral/Pendente)
  const relevantUsers = users.filter(u => {
      if (u.id === currentUser.id) return true;
      if (u.sectorIds.length === 0) return true; // Mostra novos cadastros pendentes
      
      // Verifica se compartilham algum setor
      return u.sectorIds.some(sectorId => currentUser.sectorIds.includes(sectorId));
  });

  const filteredUsers = relevantUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => setEditingUser({ ...EMPTY_USER });
  const handleEditClick = (userToEdit: User) => setEditingUser({...userToEdit});

  const handleDeleteClick = (userId: string, userName: string) => {
    if (window.confirm(`Excluir o membro ${userName}? Esta ação é irreversível.`)) {
        deleteUser(userId);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (editingUser.id) {
        updateUser(editingUser);
    } else {
        addUser({ ...editingUser, id: crypto.randomUUID() });
    }
    setEditingUser(null);
  };

  const toggleEditSector = (sectorId: string) => {
    if (!editingUser) return;
    setEditingUser(prev => {
        if (!prev) return null;
        const exists = prev.sectorIds.includes(sectorId);
        return {
            ...prev,
            sectorIds: exists 
                ? prev.sectorIds.filter(id => id !== sectorId)
                : [...prev.sectorIds, sectorId]
        }
    })
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Equipe & Membros</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1">
                <Filter size={14} /> Filtrado por seus grupos e membros pendentes.
            </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar nome ou e-mail..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <Button onClick={handleAddNew} className="bg-blue-700">
                <Plus size={18} className="mr-2" />
                Cadastrar
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <UserIcon size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">Nenhum membro encontrado nestes critérios.</p>
            </div>
        ) : filteredUsers.map(u => {
          const isPending = u.sectorIds.length === 0;
          return (
            <div key={u.id} className={`bg-white p-5 rounded-2xl shadow-sm border hover:shadow-lg transition-all relative group ${isPending ? 'border-orange-200 ring-1 ring-orange-50' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${isPending ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {isPending ? <AlertCircle size={24} /> : <UserIcon size={24} />}
                </div>
                <div className="flex gap-1">
                   {u.role === Role.LEADER && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">
                        <Shield size={10} /> LÍDER
                      </span>
                   )}
                    <button 
                        onClick={() => handleEditClick(u)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Gerenciar / Aprovar"
                    >
                        <Pencil size={16} />
                    </button>
                    {currentUser?.id !== u.id && (
                        <button 
                            onClick={() => handleDeleteClick(u.id, u.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1">{u.name}</h3>
              
              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={12} />
                  <span>{u.email}</span>
                </div>
                {u.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} />
                    <span>{u.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Setores Designados</p>
                    {isPending && <span className="text-[9px] bg-orange-600 text-white font-bold px-1.5 py-0.5 rounded uppercase animate-pulse">Pendente</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {isPending ? (
                      <span className="text-xs text-orange-600 italic font-medium">Aguardando alocação por um líder</span>
                  ) : u.sectorIds.map(sid => {
                      const sector = SECTORS.find(s => s.id === sid);
                      if (!sector) return null;
                      return (
                          <span key={sid} className={`text-[10px] font-bold px-2 py-1 rounded-md ${sector.color.replace('border', '')} bg-opacity-20`}>
                              {sector.name}
                          </span>
                      );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Gerenciar Membro</h2>
                        <p className="text-xs text-slate-500">Alocação de setores e perfil</p>
                    </div>
                    <button onClick={() => setEditingUser(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-8 overflow-y-auto max-h-[75vh]">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
                                <input
                                    type="email"
                                    required
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <label className="block text-sm font-bold text-slate-800 mb-3">Aprovação de Setores</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {SECTORS.map(sector => {
                                    const isSelected = editingUser.sectorIds.includes(sector.id);
                                    const isManagedByMe = currentUser.sectorIds.includes(sector.id);
                                    
                                    return (
                                        <div 
                                            key={sector.id}
                                            onClick={() => toggleEditSector(sector.id)}
                                            className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 transition-all border-2 ${
                                                isSelected 
                                                ? 'bg-white border-blue-500 shadow-sm' 
                                                : 'bg-slate-100 border-transparent hover:bg-white hover:border-slate-200'
                                            }`}
                                        >
                                            {isSelected ? <CheckSquare size={18} className="text-blue-600"/> : <Square size={18} className="text-slate-300"/>}
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{sector.name}</span>
                                                {isManagedByMe && <span className="text-[9px] text-emerald-600 font-bold uppercase">Seu Grupo</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nível de Permissão</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200">
                                    <input 
                                        type="radio" 
                                        checked={editingUser.role === Role.MEMBER}
                                        onChange={() => setEditingUser({...editingUser, role: Role.MEMBER})}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm font-medium">Participante</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200">
                                    <input 
                                        type="radio" 
                                        checked={editingUser.role === Role.LEADER}
                                        onChange={() => setEditingUser({...editingUser, role: Role.LEADER})}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm font-medium">Liderança</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => setEditingUser(null)} className="rounded-xl">
                            Descartar
                        </Button>
                        <Button type="submit" className="rounded-xl px-8 bg-blue-700">
                            <Save size={18} className="mr-2"/>
                            Efetivar Cadastro
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};