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
  description?: string;
  verified?: boolean;
  categories?: string[];
}

export const useSuppliers = () => {
  const [data, setData] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        
        const response = await axios.get<Supplier[]>(`${API_BASE_URL}/suppliers`);
        setData(response.data);
      } catch (err) {
        setIsError(true);
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [API_BASE_URL]);

  return { data, isLoading, isError, error };
};

// Legacy export for backward compatibility
const useSuppliers_default = () => {
  const { data: suppliers, isLoading: loading, isError, error } = useSuppliers();
  return { suppliers, loading, error };
};

export default useSuppliers_default;
