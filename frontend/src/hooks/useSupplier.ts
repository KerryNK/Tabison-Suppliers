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

export const useSupplier = (id: string | undefined) => {
  const [data, setData] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchSupplier = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        
        const response = await axios.get<Supplier>(`${API_BASE_URL}/suppliers/${id}`);
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

    fetchSupplier();
  }, [id, API_BASE_URL]);

  return { data, isLoading, isError, error };
};
