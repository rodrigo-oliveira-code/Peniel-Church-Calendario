
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Event, ViewState } from '../types';
import { MOCK_USERS, MOCK_EVENTS, SECTORS } from '../constants';

interface AppContextType {
  user: User | null;
  users: User[];
  events: Event[];
  view: ViewState;
  eventToEditId: string | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (newUser: User) => void;
  setView: (view: ViewState) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  startEditingEvent: (eventId: string) => void;
  notifySectorMembers: (sectorId: string, eventTitle: string) => void;
  getVisibleEvents: () => Event[];
  updateUser: (updatedUser: User) => void;
  addUser: (newUser: User) => void;
  deleteUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fix: Use React.FC to explicitly define the component type and handle children props correctly
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [eventToEditId, setEventToEditId] = useState<string | null>(null);

  const login = (email: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      setView('DASHBOARD');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setView('LOGIN');
    setEventToEditId(null);
  };

  const register = (newUser: User) => {
    setUsers([...users, newUser]);
    setUser(newUser);
    setView('DASHBOARD');
  };

  const addUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    // If the currently logged in user updated themselves, update state
    if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
    setView('DASHBOARD');
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setView('DASHBOARD');
    setEventToEditId(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const startEditingEvent = (eventId: string) => {
    setEventToEditId(eventId);
    setView('EDIT_EVENT');
  };

  const notifySectorMembers = (sectorId: string, eventTitle: string) => {
    // Simulating Email sending
    if (sectorId === 'global') {
      console.log(`[SIMULAÇÃO DE EMAIL] Enviando email para TODOS os ${users.length} usuários sobre: "${eventTitle}"`);
      alert(`Simulação: Disparo de e-mail realizado para toda a igreja sobre o evento "${eventTitle}"!`);
    } else {
      const sectorName = SECTORS.find(s => s.id === sectorId)?.name;
      const recipients = users.filter(u => u.sectorIds.includes(sectorId));
      console.log(`[SIMULAÇÃO DE EMAIL] Enviando email para ${recipients.length} membros do setor ${sectorName} sobre: "${eventTitle}"`);
      alert(`Simulação: Disparo de e-mail realizado para ${recipients.length} membros de ${sectorName} sobre o evento "${eventTitle}"!`);
    }
  };

  const getVisibleEvents = (): Event[] => {
    if (!user) return [];
    
    // Sort by date closest to today
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sorted.filter(event => {
      // 1. Everyone sees global events
      if (event.sectorId === 'global') return true;
      // 2. Members/Leaders see events for their specific sectors
      if (user.sectorIds.includes(event.sectorId)) return true;
      
      return false;
    });
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      users,
      events, 
      view, 
      eventToEditId,
      login, 
      logout, 
      register, 
      setView, 
      addEvent,
      updateEvent,
      deleteEvent,
      startEditingEvent,
      notifySectorMembers,
      getVisibleEvents,
      updateUser,
      addUser,
      deleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
