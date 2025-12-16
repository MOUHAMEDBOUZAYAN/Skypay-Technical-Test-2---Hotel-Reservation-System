const API_URL = 'http://localhost:3001';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API calls
export const authAPI = {
  register: async (email, password, nom, prenom, telephone, role = 'user') => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nom, prenom, telephone, role })
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Room API calls
export const roomAPI = {
  createOrUpdate: async (roomNumber, type, pricePerNight) => {
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ roomNumber, type, pricePerNight })
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/rooms/bookings`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// User API calls
export const userAPI = {
  createOrUpdate: async (userId, balance) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, balance })
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Booking API calls
export const bookingAPI = {
  create: async (userId, roomNumber, checkIn, checkOut) => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, roomNumber, checkIn, checkOut })
    });
    return response.json();
  }
};
