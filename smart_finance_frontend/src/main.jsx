import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Auth from './Register and Login/app.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import FinancialHealth from './financialHealth/financialHealth.jsx';
import ConsultationList from './consultation/consultationList.jsx';
import BookingConsultation from './consultation/bookingConsultation.jsx';
import Education from './education/educationPage.jsx';
import Profile from './profile/userProfile.jsx';
import './index.css';

const G = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/" replace />;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <G>
                <Dashboard />
              </G>
            }
          />
          <Route
            path="/financial-health"
            element={
              <G>
                <FinancialHealth />
              </G>
            }
          />
          <Route
            path="/consultation"
            element={
              <G>
                <ConsultationList />
              </G>
            }
          />
          <Route
            path="/consultation/booking/:id"
            element={
              <G>
                <BookingConsultation />
              </G>
            }
          />
          <Route
            path="/education"
            element={
              <G>
                <Education />
              </G>
            }
          />
          <Route
            path="/profile"
            element={
              <G>
                <Profile />
              </G>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
);
