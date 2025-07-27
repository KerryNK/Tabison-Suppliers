import * as React from "react";

// Simple test component to isolate React issues
const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Tabison Suppliers</h1>
      <p>Application is loading...</p>
      <p>If you see this message, React is working correctly.</p>
    </div>
  );
};

export default App;
