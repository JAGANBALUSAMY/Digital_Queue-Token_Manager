import React, { useState } from 'react';
import './MyTokens.css';

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

  const getStatusClass = (status) => {
    switch(status) {
      case 'waiting': return 'status-waiting';
      case 'serving': return 'status-serving';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  return (
    <div className="my-tokens-page">
      <div className="my-tokens-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">My Tokens</h1>
          <p className="page-subtitle">
            Manage your active tokens and view your queue history
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-container">
          <div className="tab-nav">
            <button
              className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <span className="tab-icon">🎫</span>
              Active Tokens
              {activeTokens.length > 0 && (
                <span className="tab-badge">{activeTokens.length}</span>
              )}
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <span className="tab-icon">📋</span>
              Token History
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'active' ? (
              <div>
                {activeTokens.length > 0 ? (
                  <div className="tokens-grid">
                    {activeTokens.map(token => (
                      <div key={token.id} className="token-card active-token">
                        <div className="token-header">
                          <div className="token-id-section">
                            <h3 className="token-id">{token.id}</h3>
                            <span className={`status-badge ${getStatusClass(token.status)}`}>
                              {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="token-details">
                          <div className="detail-row">
                            <span className="detail-icon">🏥</span>
                            <span className="detail-text org-name">{token.organization}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-icon">🎯</span>
                            <span className="detail-text">{token.service}</span>
                          </div>
                        </div>
                        
                        <div className="queue-info">
                          <div className="queue-stat">
                            <span className="stat-label">Queue Position</span>
                            <span className="stat-value">#{token.queuePosition}</span>
                          </div>
                          <div className="queue-stat">
                            <span className="stat-label">Estimated Wait</span>
                            <span className="stat-value">{token.estimatedWait}</span>
                          </div>
                        </div>
                        
                        <div className="token-footer">
                          <div className="issued-info">
                            <span className="issued-label">Issued at:</span>
                            <span className="issued-time">{token.issuedAt}</span>
                          </div>
                          <button className="track-queue-btn">
                            Track Queue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎫</div>
                    <h3 className="empty-title">No Active Tokens</h3>
                    <p className="empty-message">
                      You don't have any active tokens at the moment.
                    </p>
                    <button className="primary-btn">
                      Join Queue
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {tokenHistory.length > 0 ? (
                  <div className="tokens-grid">
                    {tokenHistory.map(token => (
                      <div key={token.id} className="token-card history-token">
                        <div className="token-header">
                          <div className="token-id-section">
                            <h3 className="token-id">{token.id}</h3>
                            <span className={`status-badge ${getStatusClass(token.status)}`}>
                              {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="token-details">
                          <div className="detail-row">
                            <span className="detail-icon">🏥</span>
                            <span className="detail-text org-name">{token.organization}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-icon">🎯</span>
                            <span className="detail-text">{token.service}</span>
                          </div>
                        </div>
                        
                        <div className="token-footer">
                          <div className="issued-info">
                            <span className="issued-label">Served at:</span>
                            <span className="issued-time">{token.servedAt}</span>
                          </div>
                          {!token.feedbackGiven && (
                            <button className="feedback-btn">
                              Give Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3 className="empty-title">No Token History</h3>
                    <p className="empty-message">
                      Your token history will appear here after you complete services.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTokens;