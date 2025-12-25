import React, { useState } from 'react';

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Mock data for organizations
  const organizations = [
    {
      id: 1,
      name: 'City Medical Center',
      code: 'CMC123',
      domain: 'Healthcare',
      location: 'Downtown',
      services: ['OPD', 'Pharmacy', 'Billing'],
      rating: 4.5
    },
    {
      id: 2,
      name: 'Government Office',
      code: 'GOV456',
      domain: 'Government',
      location: 'Central',
      services: ['Permits', 'Applications', 'Inquiries'],
      rating: 4.2
    },
    {
      id: 3,
      name: 'University Canteen',
      code: 'UC789',
      domain: 'Food Service',
      location: 'Campus',
      services: ['Breakfast', 'Lunch', 'Dinner'],
      rating: 4.7
    }
  ];

  const domains = ['all', 'Healthcare', 'Government', 'Food Service', 'Education', 'Banking', 'Retail'];

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          org.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'all' || org.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Find Organizations</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by organization name or code..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            {domains.map(domain => (
              <option key={domain} value={domain}>
                {domain === 'all' ? 'All Domains' : domain}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map(org => (
          <div key={org.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{org.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{org.domain}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="font-medium">Code:</span> {org.code}
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <span className="font-medium">Location:</span> {org.location}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium">{org.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">/ 5.0</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {org.services.map((service, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Join Queue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Organizations;