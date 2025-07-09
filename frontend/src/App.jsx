import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Topbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">
              <AppRoutes />
            </main>
          </div>
          <PlayerBar />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;