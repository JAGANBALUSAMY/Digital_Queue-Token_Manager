import React from 'react';

const Dashboard = () => {
  // Mock data for dashboard
  const stats = {
    totalOrganizations: 12,
    totalQueues: 45,
    activeTokens: 128,
    todayAppointments: 24,
    avgWaitTime: '12 mins'
  };

  const queues = [
    { id: 1, name: 'OPD', organization: 'City Medical Center', currentToken: 24, totalServed: 12, status: 'active' },
    { id: 2, name: 'Pharmacy', organization: 'City Medical Center', currentToken: 15, totalServed: 8, status: 'active' },
    { id: 3, name: 'Billing', organization: 'City Medical Center', currentToken: 8, totalServed: 5, status: 'paused' },
    { id: 4, name: 'Enquiry', organization: 'Government Office', currentToken: 32, totalServed: 18, status: 'active' }
  ];

  const recentTokens = [
    { id: 'TKN001', organization: 'City Medical Center', service: 'OPD', user: 'John Doe', time: '10:30 AM', status: 'serving' },
    { id: 'TKN002', organization: 'Government Office', service: 'Permits', user: 'Jane Smith', time: '10:45 AM', status: 'waiting' },
    { id: 'TKN003', organization: 'University Canteen', service: 'Lunch', user: 'Robert Johnson', time: '11:00 AM', status: 'waiting' },
    { id: 'TKN004', organization: 'City Bank', service: 'General Banking', user: 'Emily Davis', time: '11:15 AM', status: 'completed' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTokenStatusColor = (status) => {
    switch(status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'serving': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Organizations</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalOrganizations}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Queues</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalQueues}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Active Tokens</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.activeTokens}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Appointments</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.todayAppointments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Avg. Wait Time</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.avgWaitTime}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Queues */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Active Queues</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              + Add Queue
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Served</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queues.map(queue => (
                  <tr key={queue.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{queue.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.organization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{queue.currentToken}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.totalServed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(queue.status)}`}>
                        {queue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Tokens */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Tokens</h2>
          
          <div className="space-y-4">
            {recentTokens.map(token => (
              <div key={token.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-800 mr-3">{token.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTokenStatusColor(token.status)}`}>
                        {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600">{token.service} at {token.organization}</p>
                    <p className="text-gray-500 text-sm">User: {token.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{token.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;