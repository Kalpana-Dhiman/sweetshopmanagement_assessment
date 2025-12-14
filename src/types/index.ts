export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Purchase {
  id: string;
  sweetId: string;
  quantity: number;
  total: number;
  createdAt: string;
}

export interface SearchFilters {
  name: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}
