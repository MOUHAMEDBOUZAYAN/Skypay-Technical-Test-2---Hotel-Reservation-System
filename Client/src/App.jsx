import { useState, useEffect } from 'react';
import RoomForm from './components/RoomForm';
import UserForm from './components/UserForm';
import BookingForm from './components/BookingForm';
import RoomsList from './components/RoomsList';
import UsersList from './components/UsersList';
import Notification from './components/Notification';
import Login from './components/Login';
import Register from './components/Register';
import { roomAPI, userAPI } from './services/api';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  const { isAuthenticated, user, token, logout, loading: authLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch rooms and users on mount (only if authenticated)
  useEffect(() => {
    if (user && token) {
      fetchRooms();
      fetchUsers();
    }
  }, [user, token]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await roomAPI.getAll();
      if (response.success) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAll();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSuccess = (message) => {
    showNotification(message, 'success');
    fetchRooms();
    fetchUsers();
  };

  const handleError = (message) => {
    showNotification(message, 'error');
  };

  // Show login/register if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                🏨 Hotel Reservation System
              </h1>
              <p className="text-gray-600 mt-2">Manage rooms, users, and bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Connecté en tant que</p>
                <p className="font-semibold text-gray-800">{user?.email}</p>
                <span className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role === 'admin' ? '👑 Admin' : '👤 Utilisateur'}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'rooms'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏠 Rooms
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'booking'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Book Room
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {user?.role === 'admin' && (
              <div className="lg:col-span-1">
                <RoomForm onSuccess={handleSuccess} onError={handleError} />
              </div>
            )}
            <div className={user?.role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-full'}>
              <RoomsList rooms={rooms} loading={loading} onRefresh={fetchRooms} />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {user?.role === 'admin' && (
              <div className="lg:col-span-1">
                <UserForm onSuccess={handleSuccess} onError={handleError} />
              </div>
            )}
            <div className={user?.role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-full'}>
              <UsersList users={users} loading={loading} onRefresh={fetchUsers} />
            </div>
          </div>
        )}

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BookingForm onSuccess={handleSuccess} onError={handleError} />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Rooms & Users</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Rooms:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {rooms.map((room) => (
                        <div key={room.id} className="p-3 bg-blue-50 rounded-md border border-blue-200">
                          <p className="font-medium">Room {room.roomNumber}</p>
                          <p className="text-sm text-gray-600">{room.type} - ${room.pricePerNight}/night</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Users:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {users.map((user) => (
                        <div key={user.id} className="p-3 bg-green-50 rounded-md border border-green-200">
                          <p className="font-medium">User ID: {user.userId}</p>
                          <p className="text-sm text-gray-600">Balance: ${user.balance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-600">
          <p>© 2024 Hotel Reservation System - Built with React + Express + Prisma</p>
        </div>
      </footer>
    </div>
  );
}

export default App;