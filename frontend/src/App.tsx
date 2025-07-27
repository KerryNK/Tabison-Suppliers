import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

// Test component with useState
const TestComponent: React.FC = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Tabison Suppliers</h1>
      <p>Application is working correctly!</p>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me to test useState
      </button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TestComponent />
    </QueryClientProvider>
  );
};

export default App;
