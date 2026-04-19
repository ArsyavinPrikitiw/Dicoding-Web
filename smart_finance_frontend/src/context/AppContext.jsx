import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [dashboard, setDashboard] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [lastHealthCheck, setLastHealthCheck] = useState(null);
  const [loading, setLoading] = useState({
    dashboard: false,
    health: false,
    bookings: false,
    consultants: false,
  });

  const token = () => localStorage.getItem('token');

  const authHeader = () => ({
    Authorization: `Bearer ${token()}`,
    'Content-Type': 'application/json',
  });

  const fetchDashboard = useCallback(async () => {
    if (!token()) return;
    setLoading((p) => ({ ...p, dashboard: true }));
    try {
      const res = await fetch(`${API_URL}/dashboard`, {
        headers: authHeader(),
      });
      const data = await res.json();
      if (data.status === 'success') setDashboard(data.data);
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading((p) => ({ ...p, dashboard: false }));
    }
  }, []);

  const fetchHealthHistory = useCallback(async () => {
    if (!token()) return;
    setLoading((p) => ({ ...p, health: true }));
    try {
      const res = await fetch(`${API_URL}/health-check/history?limit=20`, {
        headers: authHeader(),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setHealthHistory(data.data.history);
        if (data.data.history.length > 0)
          setLastHealthCheck(data.data.history[0]);
      }
    } catch (e) {
      console.error('Health history error:', e);
    } finally {
      setLoading((p) => ({ ...p, health: false }));
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!token()) return;
    setLoading((p) => ({ ...p, bookings: true }));
    try {
      const res = await fetch(`${API_URL}/bookings`, { headers: authHeader() });
      const data = await res.json();
      if (data.status === 'success') setBookings(data.data.bookings);
    } catch (e) {
      console.error('Bookings fetch error:', e);
    } finally {
      setLoading((p) => ({ ...p, bookings: false }));
    }
  }, []);

  const fetchConsultants = useCallback(async () => {
    setLoading((p) => ({ ...p, consultants: true }));
    try {
      const res = await fetch(`${API_URL}/consultants`);
      const data = await res.json();
      if (data.status === 'success') setConsultants(data.data.consultants);
    } catch (e) {
      console.error('Consultants fetch error:', e);
    } finally {
      setLoading((p) => ({ ...p, consultants: false }));
    }
  }, []);

  const fetchMe = useCallback(async () => {
    if (!token()) return;
    try {
      const res = await fetch(`${API_URL}/auth/me`, { headers: authHeader() });
      const data = await res.json();
      if (data.status === 'success') {
        setUser(data.data.user);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
    } catch (e) {
      console.error('Me fetch error:', e);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchDashboard(),
      fetchHealthHistory(),
      fetchBookings(),
      fetchConsultants(),
      fetchMe(),
    ]);
  }, [
    fetchDashboard,
    fetchHealthHistory,
    fetchBookings,
    fetchConsultants,
    fetchMe,
  ]);

  const submitHealthCheck = useCallback(
    async (form) => {
      const res = await fetch(`${API_URL}/health-check`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLastHealthCheck(data.data.result);
        await Promise.all([fetchHealthHistory(), fetchDashboard()]);
      }
      return data;
    },
    [fetchHealthHistory, fetchDashboard],
  );

  const submitBooking = useCallback(
    async (bookingData) => {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data.status === 'success') {
        await Promise.all([fetchBookings(), fetchDashboard()]);
      }
      return data;
    },
    [fetchBookings, fetchDashboard],
  );

  const cancelBooking = useCallback(
    async (id) => {
      const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: authHeader(),
      });
      const data = await res.json();
      if (data.status === 'success') {
        await Promise.all([fetchBookings(), fetchDashboard()]);
      }
      return data;
    },
    [fetchBookings, fetchDashboard],
  );

  const updateProfile = useCallback(async (form) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PATCH',
      headers: authHeader(),
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.status === 'success') {
      setUser(data.data.user);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }, []);

  const changePassword = useCallback(async (form) => {
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PATCH',
      headers: authHeader(),
      body: JSON.stringify(form),
    });
    return res.json();
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        const tk = data.data?.token || data.token;
        const usr = data.data?.user || data.user;
        localStorage.setItem('token', tk);
        localStorage.setItem('user', JSON.stringify(usr));
        setUser(usr);
        await refreshAll();
      }
      return data;
    },
    [refreshAll],
  );

  const register = useCallback(async (form) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    return res.json();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDashboard(null);
    setHealthHistory([]);
    setBookings([]);
    setLastHealthCheck(null);
  }, []);

  useEffect(() => {
    if (token()) {
      refreshAll();
    }
  }, []);

  const value = {
    user,
    dashboard,
    healthHistory,
    bookings,
    consultants,
    lastHealthCheck,
    loading,
    login,
    register,
    logout,
    fetchDashboard,
    fetchHealthHistory,
    fetchBookings,
    fetchConsultants,
    fetchMe,
    refreshAll,
    submitHealthCheck,
    submitBooking,
    cancelBooking,
    updateProfile,
    changePassword,
    API_URL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
