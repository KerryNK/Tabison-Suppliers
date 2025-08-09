import React, { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || '';

    async function fetchData() {
      try {
        const response = await fetch(`${apiBase}/api/endpoint`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Data:', data);
        setData(data);
      } catch (error) {
        console.error('Fetch failed:', error);
        setError(error.message);
      }
    }

    fetchData();
  }, []); // Empty dependencies array: runs once on mount

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {/* Render your data here */}
      {JSON.stringify(data)}
    </div>
  );
}

export default MyComponent;
