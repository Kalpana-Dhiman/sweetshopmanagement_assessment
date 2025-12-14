import { useState, useEffect, useMemo } from 'react';
import { Sweet, SearchFilters } from '@/types';
import { MOCK_SWEETS } from '@/data/mockSweets';

export const useSweets = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  });

  useEffect(() => {
    // Simulate API fetch
    const fetchSweets = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setSweets(MOCK_SWEETS);
      setLoading(false);
    };
    fetchSweets();
  }, []);

  const filteredSweets = useMemo(() => {
    return sweets.filter(sweet => {
      const matchesName = sweet.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesCategory = !filters.category || filters.category === 'All' || sweet.category === filters.category;
      const matchesMinPrice = filters.minPrice === null || sweet.price >= filters.minPrice;
      const matchesMaxPrice = filters.maxPrice === null || sweet.price <= filters.maxPrice;
      return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [sweets, filters]);

  const purchaseSweet = async (sweetId: string, quantity: number = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSweets(prev => prev.map(sweet => {
      if (sweet.id === sweetId) {
        if (sweet.quantity < quantity) {
          throw new Error('Insufficient stock');
        }
        return { ...sweet, quantity: sweet.quantity - quantity };
      }
      return sweet;
    }));

    return { success: true, message: 'Purchase successful!' };
  };

  const addSweet = async (sweet: Omit<Sweet, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newSweet: Sweet = { ...sweet, id: `${Date.now()}` };
    setSweets(prev => [...prev, newSweet]);
    return newSweet;
  };

  const updateSweet = async (id: string, updates: Partial<Sweet>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setSweets(prev => prev.map(sweet => 
      sweet.id === id ? { ...sweet, ...updates } : sweet
    ));
  };

  const deleteSweet = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setSweets(prev => prev.filter(sweet => sweet.id !== id));
  };

  const restockSweet = async (id: string, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setSweets(prev => prev.map(sweet => 
      sweet.id === id ? { ...sweet, quantity: sweet.quantity + quantity } : sweet
    ));
  };

  return {
    sweets: filteredSweets,
    allSweets: sweets,
    loading,
    filters,
    setFilters,
    purchaseSweet,
    addSweet,
    updateSweet,
    deleteSweet,
    restockSweet,
  };
};
