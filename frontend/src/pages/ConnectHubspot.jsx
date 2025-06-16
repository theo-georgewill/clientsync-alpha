import React from 'react';

const ConnectHubspot = () => {
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Connect HubSpot</h1>
          <p className="card-text">
            Click below to authorize your HubSpot account.
          </p>
          <a href="/api/hubspot/connect" className="btn btn-primary">
            Connect to HubSpot
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConnectHubspot;
