import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import CustomerTable from '@/components/CustomerTable';
import StatusBadge from '@/components/StatusBadge';
import SearchInput from '@/components/SearchInput';
import { mikrotikApi } from '@/api/endpoints';
import { formatBytes, debounce } from '@/utils';
import type { PPPSecret, PPPActive } from '@/types';

const Monitoring: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const { data: secrets, isLoading: secretsLoading, refetch: refetchSecrets } = useQuery({
    queryKey: ['mikrotik-secrets'],
    queryFn: mikrotikApi.getSecrets,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: activeUsers, isLoading: activeLoading, refetch: refetchActive } = useQuery({
    queryKey: ['mikrotik-active'],
    queryFn: mikrotikApi.getActiveUsers,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const handleRefresh = () => {
    refetchSecrets();
    refetchActive();
  };

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  // Merge secrets with active status
  const mergedData = React.useMemo(() => {
    if (!secrets?.data) return [];
    
    const activeUsernames = new Set(activeUsers?.data?.map((user: PPPActive) => user.name) || []);
    
    return secrets.data
      .filter((secret: PPPSecret) => 
        secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        secret.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        secret.profile.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((secret: PPPSecret) => ({
        ...secret,
        isOnline: activeUsernames.has(secret.name),
      }));
  }, [secrets, activeUsers, searchTerm]);

  const columns = [
    {
      key: 'name' as keyof any,
      title: 'PPP Username',
      sortable: true,
    },
    {
      key: 'profile' as keyof any,
      title: 'Profile',
      sortable: true,
    },
    {
      key: 'service' as keyof any,
      title: 'Service',
      sortable: true,
    },
    {
      key: 'isOnline' as keyof any,
      title: 'Status',
      render: (value: boolean) => (
        <StatusBadge status={value ? 'online' : 'offline'} />
      ),
    },
    {
      key: 'disabled' as keyof any,
      title: 'Enabled',
      render: (value: boolean) => (
        <StatusBadge status={value ? 'offline' : 'active'} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Network Monitoring</h1>
          <p className="text-muted-foreground">Real-time PPP session monitoring</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Online</p>
              <p className="text-2xl font-bold">{activeUsers?.data?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <WifiOff className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Offline</p>
              <p className="text-2xl font-bold">
                {mergedData.filter((item: any) => !item.isOnline).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-blue-600 rounded-full" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total PPP</p>
              <p className="text-2xl font-bold">{secrets?.data?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-orange-600 rounded-full" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Disabled</p>
              <p className="text-2xl font-bold">
                {secrets?.data?.filter((s: PPPSecret) => s.disabled).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <SearchInput
          placeholder="Search by username, service, or profile..."
          onSearch={handleSearch}
        />
      </div>

      {/* PPP Users Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">PPP Users</h3>
          <p className="text-sm text-muted-foreground">
            Auto-refreshes every 10 seconds
          </p>
        </div>
        <CustomerTable
          data={mergedData}
          columns={columns}
          loading={secretsLoading || activeLoading}
        />
      </div>
    </div>
  );
};

export default Monitoring;
