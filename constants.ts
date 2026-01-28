import { Sector, User, Event, Role } from './types';

export const SECTORS: Sector[] = [
  { id: '1', name: 'Louvor & Adoração', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: '2', name: 'Jovens', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: '3', name: 'Infantil', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: '4', name: 'Diaconia', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: '5', name: 'Missões', color: 'bg-orange-100 text-orange-800 border-orange-200' },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Pr. Carlos',
    email: 'carlos@igreja.com',
    phone: '11999999999',
    gender: 'M',
    role: Role.LEADER,
    sectorIds: ['1', '2', '3', '4', '5'],
    birthDate: '1980-05-15'
  },
  {
    id: 'u2',
    name: 'Ana Silva',
    email: 'ana@igreja.com',
    phone: '11988888888',
    gender: 'F',
    role: Role.MEMBER,
    sectorIds: ['1'],
    birthDate: '1995-10-20'
  },
  {
    id: 'u3',
    name: 'João Souza',
    email: 'joao@igreja.com',
    phone: '11977777777',
    gender: 'M',
    role: Role.LEADER,
    sectorIds: ['2'],
    birthDate: '2000-01-10'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Culto de Celebração',
    description: 'Nosso culto principal de domingo com toda a família.',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    location: 'Santuário Principal',
    sectorId: 'global',
    createdBy: 'u1',
    recurrence: 'WEEKLY'
  },
  {
    id: 'e2',
    title: 'Ensaio Geral',
    description: 'Preparação para o domingo.',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    location: 'Sala de Música',
    sectorId: '1',
    createdBy: 'u2',
    recurrence: 'WEEKLY'
  },
  {
    id: 'e3',
    title: 'Noite de Jogos',
    description: 'Momentos de comunhão e diversão.',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    location: 'Salão Social',
    sectorId: '2',
    createdBy: 'u3',
    recurrence: 'MONTHLY'
  }
];