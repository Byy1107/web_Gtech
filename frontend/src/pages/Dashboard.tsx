import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Wifi, WifiOff, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import TrafficChart from '@/components/TrafficChart';
import CustomerTable from '@/components/CustomerTable';
import { dashboardApi, mikrotikApi } from '@/api/endpoints';
import { formatCurrency, formatBytes } from '@/utils';
import type { DashboardStats, Customer, PPPActive } from '@/types';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: traffic, isLoading: trafficLoading } = useQuery({
    queryKey: ['dashboard-traffic'],
    queryFn: dashboardApi.getTraffic,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: activeUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['active-users'],
    queryFn: mikrotikApi.getActiveUsers,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const customerColumns = [
    {
      key: 'name' as keyof Customer,
      title: 'Customer Name',
      sortable: true,
    },
    {
      key: 'pppSecret' as keyof Customer,
      title: 'PPP Username',
      sortable: true,
    },
    {
      key: 'package' as keyof Customer,
      title: 'Package',
      render: (value: any) => value?.name || 'N/A',
    },
    {
      key: 'status' as keyof Customer,
      title: 'Status',
      render: (value: string) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Network Operations Center</h1>
        <p className="text-muted-foreground">Real-time ISP monitoring dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats?.data.totalCustomers || 0}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Online PPP"
          value={stats?.data.onlineCustomers || 0}
          icon={<Wifi className="h-4 w-4" />}
          trend={{
            value: 5.2,
            isPositive: true,
          }}
        />
        <StatCard
          title="Offline PPP"
          value={stats?.data.offlineCustomers || 0}
          icon={<WifiOff className="h-4 w-4" />}
          trend={{
            value: -2.1,
            isPositive: false,
          }}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.data.monthlyRevenue || 0)}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Bandwidth Usage */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Real-time Bandwidth</h3>
          <div className="grid gap-4 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Upload</span>
              <span className="text-sm font-medium">
                {formatBytes(stats?.data.bandwidthUsage.upload || 0)}/s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Download</span>
              <span className="text-sm font-medium">
                {formatBytes(stats?.data.bandwidthUsage.download || 0)}/s
              </span>
            </div>
          </div>
          <TrafficChart data={traffic?.data || []} />
        </div>

        {/* Active PPP Sessions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Active PPP Sessions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {usersLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : activeUsers?.data.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No active sessions</div>
            ) : (
              activeUsers?.data.slice(0, 10).map((user: PPPActive) => (
                <div key={user.name} className="flex items-center justify-between p-2 rounded-md border">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.callerId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{user.uptime}</p>
                    <p className="text-xs">{formatBytes(user.bytesIn + user.bytesOut)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Customer Status Overview */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Customer Status Overview</h3>
        <CustomerTable
          data={[]}
          columns={customerColumns}
          loading={false}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            onPageChange: () => {},
          }}
        />
      </div>

      {/* Unpaid Invoices Alert */}
      {stats?.data.unpaidInvoices > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              {stats.data.unpaidInvoices} unpaid invoices require attention
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
