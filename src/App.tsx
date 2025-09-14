import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { initializeDemoData } from './utils/storage';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SubmitItem from './pages/SubmitItem';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import Admin from './pages/Admin';

function App() {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/submit" element={<SubmitItem />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;