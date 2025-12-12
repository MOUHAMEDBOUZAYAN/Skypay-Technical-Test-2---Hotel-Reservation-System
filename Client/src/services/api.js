const API_URL = 'http://localhost:3001';

// Room API calls
export const roomAPI = {
  createOrUpdate: async (roomNumber, type, pricePerNight) => {
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber, type, pricePerNight })
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/rooms/bookings`);
    return response.json();
  }
};

// User API calls
export const userAPI = {
  createOrUpdate: async (userId, balance) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, balance })
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  }
};

// Booking API calls
export const bookingAPI = {
  create: async (userId, roomNumber, checkIn, checkOut) => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, roomNumber, checkIn, checkOut })
    });
    return response.json();
  }
};
