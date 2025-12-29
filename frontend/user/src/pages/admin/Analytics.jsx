import React, { useState } from 'react';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d

  // Mock data for analytics
  const analyticsData = {
    totalTokens: 1248,
    avgWaitTime: '15 mins',
    satisfaction: 4.2,
    peakHours: [
      { hour: '9:00 AM', tokens: 45 },
      { hour: '10:00 AM', tokens: 68 },
      { hour: '11:00 AM', tokens: 72 },
      { hour: '12:00 PM', tokens: 55 },
      { hour: '1:00 PM', tokens: 48 },
      { hour: '2:00 PM', tokens: 62 },
      { hour: '3:00 PM', tokens: 58 },
      { hour: '4:00 PM', tokens: 42 }
    ],
    queuePerformance: [
      { name: 'OPD', avgWait: '12 mins', served: 320, satisfaction: 4.3 },
      { name: 'Pharmacy', avgWait: '8 mins', served: 450, satisfaction: 4.5 },
      { name: 'Billing', avgWait: '20 mins', served: 180, satisfaction: 3.8 },
      { name: 'Enquiry', avgWait: '5 mins', served: 298, satisfaction: 4.6 }
    ]
  };

  const chartData = analyticsData.peakHours;

  // Calculate max value for chart scaling
  const maxValue = Math.max(...chartData.map(item => item.tokens));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Tokens Generated</h3>
          <p className="text-3xl font-bold text-gray-800">{analyticsData.totalTokens}</p>
          <p className="text-green-500 text-sm mt-1">↑ 12% from last period</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Average Wait Time</h3>
          <p className="text-3xl font-bold text-gray-800">{analyticsData.avgWaitTime}</p>
          <p className="text-red-500 text-sm mt-1">↑ 3% from last period</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Satisfaction Score</h3>
          <p className="text-3xl font-bold text-gray-800">{analyticsData.satisfaction}/5.0</p>
          <p className="text-green-500 text-sm mt-1">↑ 0.3 from last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Peak Hours</h2>
          <div className="h-64 flex items-end space-x-2 justify-center border-b-2 border-l-2 border-gray-200 pb-4 pl-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-blue-500 rounded-t hover:bg-blue-600 transition"
                  style={{ height: `${(item.tokens / maxValue) * 200}px` }}
                ></div>
                <span className="text-xs mt-2 text-gray-600 transform -rotate-45 origin-left">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Queue Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Queue Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Wait</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Served</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.queuePerformance.map((queue, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{queue.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.avgWait}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.served}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm">{queue.satisfaction}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Token Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Regular Tokens</span>
                <span className="text-sm font-medium text-gray-700">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Priority Tokens</span>
                <span className="text-sm font-medium text-gray-700">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Walk-in Tokens</span>
                <span className="text-sm font-medium text-gray-700">7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '7%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Service Efficiency</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">On-time Service Rate</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">No-show Rate</span>
              <span className="font-medium">8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Queue Length</span>
              <span className="font-medium">12 people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peak Hour Utilization</span>
              <span className="font-medium">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;