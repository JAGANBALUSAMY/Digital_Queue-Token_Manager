import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Welcome to Q-Ease
          </h1>
          <p className="hero-subtitle">
            The smart virtual queue system that helps you avoid physical waiting lines. 
            Join queues across multiple organizations and get real-time updates on your turn.
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary">
              Join Queue
            </button>
            <button className="btn btn-secondary">
              Find Organization
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3 className="feature-title">Virtual Tokens</h3>
            <p className="feature-description">
              Generate virtual tokens instantly without standing in line. 
              No more physical waiting.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3 className="feature-title">Real-time Updates</h3>
            <p className="feature-description">
              Track your position in the queue and get estimated wait times.
              Never miss your turn.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3 className="feature-title">Smart Notifications</h3>
            <p className="feature-description">
              Receive SMS, voice, and in-app alerts as your turn approaches.
              Stay informed on the go.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="section-heading">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Find Organization</h3>
              <p className="step-description">
                Browse verified organizations by code, name, or location
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Select Service</h3>
              <p className="step-description">
                Choose the service queue you need
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Get Token</h3>
              <p className="step-description">
                Generate your virtual token instantly
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Wait Comfortably</h3>
              <p className="step-description">
                Track your position and receive timely notifications
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;