import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Users, Calendar, Bell, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import Members from './components/Members';
import Events from './components/Events';
import Announcements from './components/Announcements';

function App() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-800">Club Manager</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/members"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-600"
                  >
                    <Users className="w-5 h-5 mr-1" />
                    Members
                  </Link>
                  <Link
                    to="/events"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-600"
                  >
                    <Calendar className="w-5 h-5 mr-1" />
                    Events
                  </Link>
                  <Link
                    to="/announcements"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-600"
                  >
                    <Bell className="w-5 h-5 mr-1" />
                    Announcements
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/members" element={<Members />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/" element={<Members />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;