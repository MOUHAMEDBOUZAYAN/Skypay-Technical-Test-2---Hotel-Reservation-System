import { useState } from 'react';
import { userAPI } from '../services/api';

const UserForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    userId: '',
    balance: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.createOrUpdate(
        parseInt(formData.userId),
        parseInt(formData.balance)
      );

      if (response.success) {
        setFormData({ userId: '', balance: '' });
        if (onSuccess) onSuccess('User saved successfully!');
      } else {
        if (onError) onError(response.error || 'Failed to save user');
      }
    } catch (error) {
      if (onError) onError('An error occurred while saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add / Update User</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID:
          </label>
          <input
            type="number"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balance:
          </label>
          <input
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
