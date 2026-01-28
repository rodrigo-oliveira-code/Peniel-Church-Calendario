import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, LayoutGrid, Calendar, Users } from 'lucide-react';
import { ViewState } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, view, setView } = useApp();
  const isAuthPage = view === 'LOGIN' || view === 'REGISTER';

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState, icon: any, label: string }) => {
    const isActive = view === target;
    return (
      <button 
        onClick={() => setView(target)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
          isActive 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <Icon size={18} />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAuthPage && user && (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <div className="flex items-center cursor-pointer" onClick={() => setView('DASHBOARD')}>
                  <span className="text-xl font-bold text-slate-900 tracking-tight">Peniel<span className="text-blue-700">Church</span></span>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <NavItem target="DASHBOARD" icon={LayoutGrid} label="Início" />
                  <NavItem target="CALENDAR" icon={Calendar} label="Calendário" />
                  {user.role === 'LEADER' && <NavItem target="MEMBERS" icon={Users} label="Membros" />}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-blue-700 uppercase leading-none">{user.role === 'LEADER' ? 'Liderança' : 'Membro'}</p>
                    <p className="text-sm text-slate-600">{user.name}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden flex justify-around py-2 border-t border-slate-100">
                <NavItem target="DASHBOARD" icon={LayoutGrid} label="Início" />
                <NavItem target="CALENDAR" icon={Calendar} label="Agenda" />
                {user.role === 'LEADER' && <NavItem target="MEMBERS" icon={Users} label="Membros" />}
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};