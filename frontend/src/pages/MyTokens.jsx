import React, { useState } from 'react';

const MyTokens = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'history'

  // Mock data for tokens
  const activeTokens = [
    {
      id: 'TKN001',
      organization: 'City Medical Center',
      service: 'OPD',
      queuePosition: 3,
      estimatedWait: '15 mins',
      issuedAt: '2023-06-15 10:30 AM',
      status: 'waiting'
    },
    {
      id: 'TKN002',
      organization: 'Government Office',
      service: 'Permits',
      queuePosition: 12,
      estimatedWait: '45 mins',
      issuedAt: '2023-06-15 11:15 AM',
      status: 'waiting'
    }
  ];

  const tokenHistory = [
    {
      id: 'TKN003',
      organization: 'University Canteen',
      service: 'Lunch',
      servedAt: '2023-06-14 1:30 PM',
      status: 'completed',
      feedbackGiven: true
    },
    {
      id: 'TKN004',
      organization: 'City Bank',
      service: 'General Banking',
      servedAt: '2023-06-14 10:45 AM',
      status: 'completed',
      feedbackGiven: false
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'serving': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Tokens</h1>
      
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`py-4 px-6 text-center ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('active')}
            >
              Active Tokens
            </button>
            <button
              className={`py-4 px-6 text-center ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('history')}
            >
              Token History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'active' ? (
            <div>
              {activeTokens.length > 0 ? (
                <div className="space-y-4">
                  {activeTokens.map(token => (
                    <div key={token.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-800 mr-3">{token.id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token.status)}`}>
                              {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-700 font-medium">{token.organization}</p>
                          <p className="text-gray-600">{token.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Issued at: {token.issuedAt}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">Queue Position: <span className="font-semibold">#{token.queuePosition}</span></p>
                          <p className="text-gray-600">Estimated Wait: <span className="font-semibold">{token.estimatedWait}</span></p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                          Track Queue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🎫</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Active Tokens</h3>
                  <p className="text-gray-500 mb-4">You don't have any active tokens at the moment.</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Join Queue
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {tokenHistory.length > 0 ? (
                <div className="space-y-4">
                  {tokenHistory.map(token => (
                    <div key={token.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-800 mr-3">{token.id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token.status)}`}>
                              {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-700 font-medium">{token.organization}</p>
                          <p className="text-gray-600">{token.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Served at: {token.servedAt}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <p className="text-gray-600">Status: Completed</p>
                        {!token.feedbackGiven && (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                            Give Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Token History</h3>
                  <p className="text-gray-500">Your token history will appear here after you complete services.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTokens;