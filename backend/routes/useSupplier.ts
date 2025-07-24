import { useQuery } from '@tanstack/react-query';
import { useApi } from '../api/client';
import { Supplier } from '../types';

export const useSupplier = (id?: string) => {
  const api = useApi();

  const fetchSupplierById = async (): Promise<Supplier> => {
    if (!id) throw new Error("Supplier ID is required.");
    const data = await api.get(`/suppliers/${id}`);
    if (!data) {
      throw new Error('Supplier not found');
    }
    return data;
  };

  return useQuery<Supplier, Error>({
    queryKey: ['supplier', id],
    queryFn: fetchSupplierById,
    enabled: !!id, // Ensures the query does not run without an ID
  });
};