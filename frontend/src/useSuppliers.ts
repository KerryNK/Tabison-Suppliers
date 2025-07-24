import { useQuery } from '@tanstack/react-query';
import { get } from '../api/client';
import { Supplier } from '../types';

interface SuppliersResponse {
  suppliers: Supplier[];
}

const fetchSuppliers = async (): Promise<Supplier[]> => {
  const data = await get<SuppliersResponse>('/suppliers');
  return data.suppliers || [];
}

export const useSuppliers = () => {
  return useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });
};