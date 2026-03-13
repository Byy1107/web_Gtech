import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import CustomerTable from '@/components/CustomerTable';
import StatusBadge from '@/components/StatusBadge';
import SearchInput from '@/components/SearchInput';
import ModalForm from '@/components/ModalForm';
import { financeApi } from '@/api/endpoints';
import { formatDate, formatCurrency, debounce } from '@/utils';
import type { Invoice, Payment, Cashflow } from '@/types';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'invoices' | 'payments' | 'cashflow'>('invoices');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: invoices, isLoading: invoicesLoading, refetch: refetchInvoices } = useQuery({
    queryKey: ['invoices', currentPage, searchTerm],
    queryFn: () => financeApi.getInvoices({ page: currentPage, search: searchTerm }),
  });

  const { data: payments, isLoading: paymentsLoading, refetch: refetchPayments } = useQuery({
    queryKey: ['payments', currentPage, searchTerm],
    queryFn: () => financeApi.getPayments({ page: currentPage, search: searchTerm }),
  });

  const { data: cashflows, isLoading: cashflowsLoading, refetch: refetchCashflows } = useQuery({
    queryKey: ['cashflows', currentPage, searchTerm],
    queryFn: () => financeApi.getCashflows({ page: currentPage, search: searchTerm }),
  });

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  // Calculate summary stats
  const monthlyRevenue = React.useMemo(() => {
    if (!payments?.data) return 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments.data
      .filter((payment: Payment) => {
        const paymentDate = new Date(payment.paidAt);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
  }, [payments]);

  const paidInvoices = React.useMemo(() => {
    if (!invoices?.data) return 0;
    return invoices.data.filter((invoice: Invoice) => invoice.status === 'paid').length;
  }, [invoices]);

  const unpaidInvoices = React.useMemo(() => {
    if (!invoices?.data) return 0;
    return invoices.data.filter((invoice: Invoice) => invoice.status === 'unpaid').length;
  }, [invoices]);

  const overdueInvoices = React.useMemo(() => {
    if (!invoices?.data) return 0;
    return invoices.data.filter((invoice: Invoice) => invoice.status === 'overdue').length;
  }, [invoices]);

  const invoiceColumns = [
    {
      key: 'id' as keyof Invoice,
      title: 'Invoice #',
      sortable: true,
    },
    {
      key: 'customer' as keyof Invoice,
      title: 'Customer',
      render: (value: any, record: Invoice) => value?.name || 'N/A',
    },
    {
      key: 'amount' as keyof Invoice,
      title: 'Amount',
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'status' as keyof Invoice,
      title: 'Status',
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      key: 'dueDate' as keyof Invoice,
      title: 'Due Date',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'paidAt' as keyof Invoice,
      title: 'Paid Date',
      sortable: true,
      render: (value: string) => value ? formatDate(value) : 'N/A',
    },
  ];

  const paymentColumns = [
    {
      key: 'id' as keyof Payment,
      title: 'Payment #',
      sortable: true,
    },
    {
      key: 'invoice' as keyof Payment,
      title: 'Invoice',
      render: (value: any, record: Payment) => `#${value?.id || 'N/A'}`,
    },
    {
      key: 'amount' as keyof Payment,
      title: 'Amount',
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'method' as keyof Payment,
      title: 'Method',
      sortable: true,
    },
    {
      key: 'paidBy' as keyof Payment,
      title: 'Paid By',
      sortable: true,
    },
    {
      key: 'paidAt' as keyof Payment,
      title: 'Payment Date',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  const cashflowColumns = [
    {
      key: 'id' as keyof Cashflow,
      title: 'ID',
      sortable: true,
    },
    {
      key: 'type' as keyof Cashflow,
      title: 'Type',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          {value === 'income' ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className="capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: 'description' as keyof Cashflow,
      title: 'Description',
      sortable: true,
    },
    {
      key: 'amount' as keyof Cashflow,
      title: 'Amount',
      sortable: true,
      render: (value: number, record: Cashflow) => (
        <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {record.type === 'income' ? '+' : '-'}{formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof Cashflow,
      title: 'Date',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  const currentData = activeTab === 'invoices' ? invoices?.data : 
                     activeTab === 'payments' ? payments?.data : 
                     cashflows?.data;

  const currentColumns = activeTab === 'invoices' ? invoiceColumns : 
                        activeTab === 'payments' ? paymentColumns : 
                        cashflowColumns;

  const currentLoading = activeTab === 'invoices' ? invoicesLoading : 
                        activeTab === 'payments' ? paymentsLoading : 
                        cashflowsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Finance Management</h1>
        <p className="text-muted-foreground">Billing, payments, and cashflow management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-green-600 rounded-full" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid Invoices</p>
              <p className="text-2xl font-bold">{paidInvoices}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-yellow-600 rounded-full" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unpaid</p>
              <p className="text-2xl font-bold">{unpaidInvoices}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold">{overdueInvoices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'invoices', label: 'Invoices', count: invoices?.data?.length || 0 },
            { id: 'payments', label: 'Payments', count: payments?.data?.length || 0 },
            { id: 'cashflow', label: 'Cashflow', count: cashflows?.data?.length || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <SearchInput
          placeholder={`Search ${activeTab}...`}
          onSearch={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold capitalize">{activeTab}</h3>
          <p className="text-sm text-muted-foreground">
            {currentData?.total || 0} total records
          </p>
        </div>
        <CustomerTable
          data={currentData?.data || []}
          columns={currentColumns}
          loading={currentLoading}
          pagination={{
            currentPage: currentData?.current_page || 1,
            totalPages: currentData?.last_page || 1,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
};

export default Finance;
