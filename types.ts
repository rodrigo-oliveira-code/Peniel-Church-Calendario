export enum Role {
  LEADER = 'LEADER',
  MEMBER = 'MEMBER'
}

export type RecurrenceType = 'NONE' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface Sector {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'M' | 'F'; // New field
  role: Role;
  sectorIds: string[];
  birthDate: string; // YYYY-MM-DD
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO String
  location: string;
  sectorId: string | 'global';
  createdBy: string;
  recurrence: RecurrenceType;
}

export type ViewState = 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'CALENDAR' | 'MEMBERS' | 'BIRTHDAYS' | 'CREATE_EVENT' | 'EDIT_EVENT';