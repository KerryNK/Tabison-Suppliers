import { useState, useEffect } from 'react';
import axios from 'axios';

interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  address: string;
  products: string[];
}

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get<Supplier[]>(`${API_BASE_URL}/suppliers`);
        setSuppliers(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [API_BASE_URL]);

  return { suppliers, loading, error };
};

export default useSuppliers;
