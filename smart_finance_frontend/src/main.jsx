import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import App from './Register and Login/app.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import ConsultationList from './consultation/consultationList.jsx';
import BookingConsultation from './consultation/bookingConsultation.jsx';
import FinancialHealth from './financialHealth/financialHealth.jsx';
import EducationPage from './education/educationPage.jsx';
import UserProfile from './profile/userProfile.jsx';
import './index.css';

const Guard = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/dashboard"
            element={
              <Guard>
                <Dashboard />
              </Guard>
            }
          />
          <Route
            path="/consultation"
            element={
              <Guard>
                <ConsultationList />
              </Guard>
            }
          />
          <Route
            path="/consultation/booking/:id"
            element={
              <Guard>
                <BookingConsultation />
              </Guard>
            }
          />
          <Route
            path="/financial-health"
            element={
              <Guard>
                <FinancialHealth />
              </Guard>
            }
          />
          <Route
            path="/education"
            element={
              <Guard>
                <EducationPage />
              </Guard>
            }
          />
          <Route
            path="/profile"
            element={
              <Guard>
                <UserProfile />
              </Guard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
);
