import { Sweet } from '@/types';

export const CATEGORIES = [
  'All',
  'Milk-based',
  'Chocolate',
  'Candy',
  'Traditional',
  'Cookies',
  'Pastry',
];

export const MOCK_SWEETS: Sweet[] = [
  { id: '1', name: 'Gulab Jamun', category: 'Milk-based', price: 200, quantity: 15, image: '🍩' },
  { id: '2', name: 'Rasgulla', category: 'Milk-based', price: 180, quantity: 20, image: '⚪' },
  { id: '3', name: 'Chocolate Truffle', category: 'Chocolate', price: 350, quantity: 8, image: '🍫' },
  { id: '4', name: 'Dark Chocolate Bar', category: 'Chocolate', price: 250, quantity: 0, image: '🍫' },
  { id: '5', name: 'Jelly Beans', category: 'Candy', price: 100, quantity: 50, image: '🍬' },
  { id: '6', name: 'Lollipop Mix', category: 'Candy', price: 80, quantity: 100, image: '🍭' },
  { id: '7', name: 'Kaju Katli', category: 'Traditional', price: 500, quantity: 12, image: '💎' },
  { id: '8', name: 'Mysore Pak', category: 'Traditional', price: 400, quantity: 5, image: '🟨' },
  { id: '9', name: 'Chocolate Chip Cookies', category: 'Cookies', price: 150, quantity: 30, image: '🍪' },
  { id: '10', name: 'Butter Cookies', category: 'Cookies', price: 120, quantity: 25, image: '🍪' },
  { id: '11', name: 'Croissant', category: 'Pastry', price: 180, quantity: 10, image: '🥐' },
  { id: '12', name: 'Danish Pastry', category: 'Pastry', price: 200, quantity: 8, image: '🥮' },
  { id: '13', name: 'Barfi', category: 'Traditional', price: 300, quantity: 18, image: '🟫' },
  { id: '14', name: 'Peda', category: 'Milk-based', price: 220, quantity: 22, image: '🟡' },
  { id: '15', name: 'Gummy Bears', category: 'Candy', price: 90, quantity: 0, image: '🐻' },
  { id: '16', name: 'White Chocolate', category: 'Chocolate', price: 280, quantity: 15, image: '🤍' },
];
