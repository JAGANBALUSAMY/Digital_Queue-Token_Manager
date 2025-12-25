import React from 'react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Welcome to Q-Ease
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The smart virtual queue system that helps you avoid physical waiting lines. 
          Join queues across multiple organizations and get real-time updates on your turn.
        </p>
        
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Join Queue
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Find Organization
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold mb-2">Virtual Tokens</h3>
          <p className="text-gray-600">
            Generate virtual tokens instantly without standing in line. 
            No more physical waiting.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-4">⏰</div>
          <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
          <p className="text-gray-600">
            Track your position in the queue and get estimated wait times.
            Never miss your turn.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
          <p className="text-gray-600">
            Receive SMS, voice, and in-app alerts as your turn approaches.
            Stay informed on the go.
          </p>
        </div>
      </section>

      <section className="mt-16 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">1</div>
            <h3 className="font-semibold">Find Organization</h3>
            <p className="text-sm text-gray-600 mt-1">Browse verified organizations by code, name, or location</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">2</div>
            <h3 className="font-semibold">Select Service</h3>
            <p className="text-sm text-gray-600 mt-1">Choose the service queue you need</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">3</div>
            <h3 className="font-semibold">Get Token</h3>
            <p className="text-sm text-gray-600 mt-1">Generate your virtual token instantly</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">4</div>
            <h3 className="font-semibold">Wait Comfortably</h3>
            <p className="text-sm text-gray-600 mt-1">Track your position and receive timely notifications</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;