import { useState } from 'react';

const UsersList = ({ users, loading, onRefresh }) => {
  const [expandedUser, setExpandedUser] = useState(null);

  const toggleUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">No users available</p>
          <p className="text-sm">Add a user to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* User Header */}
              <div
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleUser(user.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">👤</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        User ID: {user.userId}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-semibold text-green-600">
                          Balance: ${user.balance}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {user.bookings.length} booking{user.bookings.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-2xl">
                      {expandedUser === user.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bookings List (Expanded) */}
              {expandedUser === user.id && (
                <div className="p-4 bg-white">
                  {user.bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700 mb-2">Booking History:</h4>
                      {user.bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Room</p>
                              <p className="font-semibold text-gray-800">Room {booking.roomId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Price</p>
                              <p className="font-semibold text-green-600">${booking.totalPrice}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Check-in</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Check-out</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(booking.checkOut).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <p className="text-xs text-gray-500">Snapshot at booking time:</p>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-xs text-gray-600">
                                User Balance: ${booking.userBalanceAtBooking}
                              </span>
                              <span className="text-xs text-gray-600">
                                Room Type: {booking.roomTypeAtBooking}
                              </span>
                              <span className="text-xs text-gray-600">
                                Price: ${booking.roomPriceAtBooking}/night
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Booked on: {new Date(booking.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;