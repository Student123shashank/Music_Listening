export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export const NAV_ITEMS = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/music', icon: 'music', label: 'Music' },
  { path: '/favorites', icon: 'heart', label: 'Favorites' },
  { path: '/history', icon: 'history', label: 'History' }
]

export const SUBSCRIPTION_PLANS = [
  { id: '1-month', name: '1 Month', price: 9.99 },
  { id: '3-months', name: '3 Months', price: 24.99 },
  { id: '1-year', name: '1 Year', price: 89.99 }
]