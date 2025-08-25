import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import NotificationToast from '../components/NotificationToast';
import LoadingOverlay from '../components/LoadingOverlay';
import { useApp } from '../context/AppContext';

const MainLayout: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {state.loading && <LoadingOverlay />}
          <Outlet />
        </main>
      </div>

      <Footer />
      
      {/* Notification Stack */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {state.notifications.map((notification) => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default MainLayout;
