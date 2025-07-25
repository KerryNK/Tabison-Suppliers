import React, { useState, useEffect, useMemo } from 'react';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  // 'name', 'rating', etc.
  const [sortKey, setSortKey] = useState('name');
  // 'asc' or 'desc'
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // In a real app, you would fetch this from your API
    // For server-side sorting, your API call would look like:
    // fetch(`/api/suppliers?sortBy=${sortKey}&order=${sortOrder}`)
    const fetchSuppliers = async () => {
      setLoading(true);
      const mockData = [
        { id: 1, name: 'C Supplies', rating: 4.5 },
        { id: 2, name: 'A Supplies', rating: 3.8 },
        { id: 3, name: 'B Supplies', rating: 4.9 },
      ];
      setSuppliers(mockData);
      setLoading(false);
    };

    fetchSuppliers();
  }, []); // For server-side, add [sortKey, sortOrder] to the dependency array

  // For client-side sorting
  const sortedSuppliers = useMemo(() => {
    const sorted = [...suppliers].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortKey] > b[sortKey]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [suppliers, sortKey, sortOrder]);

  if (loading) return <p>Loading suppliers...</p>;

  return (
    <div>
      <h2>Suppliers</h2>
      <div>
        <label>Sort by: </label>
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>
      <ul>
        {sortedSuppliers.map(supplier => (
          <li key={supplier.id}>{supplier.name} - Rating: {supplier.rating}</li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList;