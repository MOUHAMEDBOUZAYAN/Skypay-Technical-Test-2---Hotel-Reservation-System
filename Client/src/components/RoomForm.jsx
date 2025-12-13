import { useState } from 'react';
import { roomAPI } from '../services/api';

const RoomForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'standard',
    pricePerNight: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await roomAPI.createOrUpdate(
        parseInt(formData.roomNumber),
        formData.type,
        parseInt(formData.pricePerNight)
      );

      if (response.success) {
        setFormData({ roomNumber: '', type: 'standard', pricePerNight: '' });
        if (onSuccess) onSuccess('Room saved successfully!');
      } else {
        if (onError) onError(response.error || 'Failed to save room');
      }
    } catch (error) {
      if (onError) onError('An error occurred while saving room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add / Update Room</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Number:
          </label>
          <input
            type="number"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type:
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="standard">Standard</option>
            <option value="junior">Junior</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Per Night:
          </label>
          <input
            type="number"
            value={formData.pricePerNight}
            onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Room'}
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
