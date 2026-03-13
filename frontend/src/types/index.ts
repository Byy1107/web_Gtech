// API Types
export interface DashboardStats {
  totalCustomers: number;
  onlineCustomers: number;
  offlineCustomers: number;
  bandwidthUsage: {
    upload: number;
    download: number;
  };
  monthlyRevenue: number;
  unpaidInvoices: number;
}

export interface PPPSecret {
  name: string;
  service: string;
  profile: string;
  callerId?: string;
  disabled: boolean;
}

export interface PPPActive {
  name: string;
  service: string;
  callerId: string;
  address: string;
  uptime: string;
  bytesIn: number;
  bytesOut: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  odpId: number;
  latitude: number;
  longitude: number;
  packageId: number;
  pppSecret: string;
  status: 'active' | 'suspended' | 'terminated';
  createdAt: string;
  updatedAt: string;
  package?: Package;
  odp?: Odp;
}

export interface Package {
  id: number;
  name: string;
  speed: string;
  price: number;
  mikrotikProfile: string;
  createdAt: string;
  updatedAt: string;
}

export interface Odp {
  id: number;
  name: string;
  location: string;
  capacity: number;
  usedPorts: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  customerId: number;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  paidBy: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  invoice?: Invoice;
}

export interface Cashflow {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrafficData {
  timestamp: string;
  upload: number;
  download: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// UI Types
export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'active' | 'suspended' | 'terminated' | 'paid' | 'unpaid' | 'overdue';
  className?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
}

export interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
