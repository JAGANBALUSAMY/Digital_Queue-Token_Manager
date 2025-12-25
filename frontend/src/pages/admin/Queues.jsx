import React, { useState } from 'react';

const Queues = () => {
  const [queues, setQueues] = useState([
    { id: 1, name: 'OPD', organization: 'City Medical Center', status: 'active', maxTokensPerDay: 100, serviceTime: '10 mins', priorityEnabled: true },
    { id: 2, name: 'Pharmacy', organization: 'City Medical Center', status: 'active', maxTokensPerDay: 150, serviceTime: '5 mins', priorityEnabled: false },
    { id: 3, name: 'Billing', organization: 'City Medical Center', status: 'paused', maxTokensPerDay: 80, serviceTime: '8 mins', priorityEnabled: true },
    { id: 4, name: 'Enquiry', organization: 'Government Office', status: 'active', maxTokensPerDay: 200, serviceTime: '3 mins', priorityEnabled: false }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newQueue, setNewQueue] = useState({
    name: '',
    organization: '',
    maxTokensPerDay: '',
    serviceTime: '',
    priorityEnabled: false
  });

  const toggleQueueStatus = (id) => {
    setQueues(queues.map(queue => 
      queue.id === id 
        ? { ...queue, status: queue.status === 'active' ? 'paused' : 'active' } 
        : queue
    ));
  };

  const handleAddQueue = (e) => {
    e.preventDefault();
    const queueToAdd = {
      id: queues.length + 1,
      ...newQueue,
      maxTokensPerDay: parseInt(newQueue.maxTokensPerDay),
      status: 'active'
    };
    setQueues([...queues, queueToAdd]);
    setNewQueue({
      name: '',
      organization: '',
      maxTokensPerDay: '',
      serviceTime: '',
      priorityEnabled: false
    });
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewQueue({
      ...newQueue,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Queue Management</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Queue
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Queue</h2>
          <form onSubmit={handleAddQueue}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                  Queue Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newQueue.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="organization">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={newQueue.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="maxTokensPerDay">
                  Max Tokens Per Day
                </label>
                <input
                  type="number"
                  id="maxTokensPerDay"
                  name="maxTokensPerDay"
                  value={newQueue.maxTokensPerDay}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="serviceTime">
                  Service Time (minutes)
                </label>
                <input
                  type="number"
                  id="serviceTime"
                  name="serviceTime"
                  value={newQueue.serviceTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="priorityEnabled"
                  name="priorityEnabled"
                  checked={newQueue.priorityEnabled}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="priorityEnabled" className="ml-2 text-gray-700 text-sm">
                  Enable Priority Tokens
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Queue
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Tokens/Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queues.map(queue => (
              <tr key={queue.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{queue.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.organization}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    queue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {queue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.maxTokensPerDay}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.serviceTime} mins</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {queue.priorityEnabled ? 'Enabled' : 'Disabled'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => toggleQueueStatus(queue.id)}
                    className={`mr-3 ${
                      queue.status === 'active' 
                        ? 'text-yellow-600 hover:text-yellow-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {queue.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Queues;