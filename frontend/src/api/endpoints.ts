import api from './index';
import type { DashboardStats, PPPSecret, PPPActive, Customer, Package, Odp, Invoice, Payment, Cashflow, TrafficData, PaginatedResponse } from '@/types';

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard'),
  getTraffic: () => api.get<TrafficData[]>('/dashboard/traffic'),
};

export const mikrotikApi = {
  getSecrets: () => api.get<PPPSecret[]>('/mikrotik/secrets'),
  getActiveUsers: () => api.get<PPPActive[]>('/mikrotik/active'),
  getTraffic: () => api.get<TrafficData[]>('/mikrotik/traffic'),
  sync: () => api.post('/mikrotik/sync'),
  getSettings: () => api.get('/mikrotik/settings'),
  updateSettings: (data: any) => api.put('/mikrotik/settings', data),
};

export const customerApi = {
  getCustomers: (params?: any) => api.get<PaginatedResponse<Customer>>('/customers', { params }),
  getCustomer: (id: number) => api.get<Customer>(`/customers/${id}`),
  createCustomer: (data: Partial<Customer>) => api.post<Customer>('/customers', data),
  updateCustomer: (id: number, data: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, data),
  deleteCustomer: (id: number) => api.delete(`/customers/${id}`),
  getMonitoringCustomers: () => api.get<Customer[]>('/monitoring/customers'),
};

export const packageApi = {
  getPackages: () => api.get<Package[]>('/packages'),
  getPackage: (id: number) => api.get<Package>(`/packages/${id}`),
  createPackage: (data: Partial<Package>) => api.post<Package>('/packages', data),
  updatePackage: (id: number, data: Partial<Package>) => api.put<Package>(`/packages/${id}`, data),
  deletePackage: (id: number) => api.delete(`/packages/${id}`),
};

export const odpApi = {
  getOdps: () => api.get<Odp[]>('/odps'),
  getOdp: (id: number) => api.get<Odp>(`/odps/${id}`),
  createOdp: (data: Partial<Odp>) => api.post<Odp>('/odps', data),
  updateOdp: (id: number, data: Partial<Odp>) => api.put<Odp>(`/odps/${id}`, data),
  deleteOdp: (id: number) => api.delete(`/odps/${id}`),
};

export const financeApi = {
  getInvoices: (params?: any) => api.get<PaginatedResponse<Invoice>>('/invoices', { params }),
  getInvoice: (id: number) => api.get<Invoice>(`/invoices/${id}`),
  createInvoice: (data: Partial<Invoice>) => api.post<Invoice>('/invoices', data),
  updateInvoice: (id: number, data: Partial<Invoice>) => api.put<Invoice>(`/invoices/${id}`, data),
  deleteInvoice: (id: number) => api.delete(`/invoices/${id}`),
  
  getPayments: (params?: any) => api.get<PaginatedResponse<Payment>>('/payments', { params }),
  getPayment: (id: number) => api.get<Payment>(`/payments/${id}`),
  createPayment: (data: Partial<Payment>) => api.post<Payment>('/payments', data),
  
  getCashflows: (params?: any) => api.get<PaginatedResponse<Cashflow>>('/cashflows', { params }),
  getCashflow: (id: number) => api.get<Cashflow>(`/cashflows/${id}`),
  createCashflow: (data: Partial<Cashflow>) => api.post<Cashflow>('/cashflows', data),
};
