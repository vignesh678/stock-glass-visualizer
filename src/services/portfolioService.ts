
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface PurchasedStock {
  _id?: string;
  stockId: number;
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  targetPrice: number | null;
  currentPrice: number;
  purchaseDate?: Date;
  notificationSent?: boolean;
}

export const portfolioService = {
  async addStock(stockData: Omit<PurchasedStock, '_id' | 'purchaseDate' | 'notificationSent'>): Promise<PurchasedStock> {
    const response = await api.post('/portfolio', stockData);
    return response.data;
  },

  async getPortfolio(): Promise<PurchasedStock[]> {
    const response = await api.get('/portfolio');
    return response.data;
  },

  async updateStock(id: string, updateData: Partial<PurchasedStock>): Promise<PurchasedStock> {
    const response = await api.put(`/portfolio/${id}`, updateData);
    return response.data;
  },

  async deleteStock(id: string): Promise<void> {
    await api.delete(`/portfolio/${id}`);
  },

  async sendEmailNotification(email: string, subject: string, message: string): Promise<void> {
    await api.post('/notify/email', { email, subject, message });
  }
};
