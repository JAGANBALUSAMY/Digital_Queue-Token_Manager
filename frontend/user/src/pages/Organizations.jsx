import React, { useState } from 'react';
import './Organizations.css';

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
    <div className="organizations-page">
      <div className="organizations-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Find Organizations</h1>
          <p className="page-subtitle">
            Browse verified organizations and join their virtual queues instantly
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="search-section">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by organization name or code..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select
            className="domain-filter"
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

        {/* Organizations Grid */}
        <div className="organizations-grid">
          {filteredOrganizations.map(org => (
            <div key={org.id} className="org-card">
              <div className="card-header">
                <h3 className="org-name">{org.name}</h3>
                <span className="domain-badge">{org.domain}</span>
              </div>
              
              <div className="org-details">
                <div className="detail-item">
                  <span className="detail-label">Code:</span>
                  <span className="detail-value">{org.code}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{org.location}</span>
                </div>
              </div>
              
              <div className="org-rating">
                <span className="star-icon">★</span>
                <span className="rating-value">{org.rating}</span>
                <span className="rating-max">/ 5.0</span>
              </div>
              
              <div className="org-services">
                <span className="services-label">Services:</span>
                <div className="services-tags">
                  {org.services.map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="join-queue-btn">
                Join Queue
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrganizations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No organizations found</h3>
            <p className="empty-message">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;