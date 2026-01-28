
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login, Register } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { CreateEvent } from './pages/CreateEvent';
import { Birthdays } from './pages/Birthdays';
import { Members } from './pages/Members';
import { CalendarView } from './pages/CalendarView';

// Fix: Remove React.FC to avoid issues with required children in some environments
const AppContent = () => {
  const { view } = useApp();

  let content;
  switch (view) {
    case 'LOGIN':
      content = <Login />;
      break;
    case 'REGISTER':
      content = <Register />;
      break;
    case 'DASHBOARD':
      content = <Dashboard />;
      break;
    case 'CALENDAR':
      content = <CalendarView />;
      break;
    case 'MEMBERS':
      content = <Members />;
      break;
    case 'CREATE_EVENT':
      content = <CreateEvent />;
      break;
    case 'EDIT_EVENT':
      content = <CreateEvent />;
      break;
    case 'BIRTHDAYS':
      content = <Birthdays />;
      break;
    default:
      content = <Login />;
  }

  return <Layout>{content}</Layout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
