import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import CustomerTable from '@/components/CustomerTable';
import StatusBadge from '@/components/StatusBadge';
import SearchInput from '@/components/SearchInput';
import ModalForm from '@/components/ModalForm';
import { customerApi, packageApi, odpApi } from '@/api/endpoints';
import { formatDate, debounce } from '@/utils';
import type { Customer, Package, Odp } from '@/types';

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ['customers', currentPage, searchTerm],
    queryFn: () => customerApi.getCustomers({ page: currentPage, search: searchTerm }),
  });

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: packageApi.getPackages,
  });

  const { data: odps } = useQuery({
    queryKey: ['odps'],
    queryFn: odpApi.getOdps,
  });

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await customerApi.deleteCustomer(customer.id);
        refetch();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const columns = [
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
      key: 'phone' as keyof Customer,
      title: 'Phone',
      sortable: true,
    },
    {
      key: 'packageId' as keyof Customer,
      title: 'Package',
      render: (value: number, record: Customer) => {
        const pkg = packages?.data.find((p: Package) => p.id === value);
        return pkg ? pkg.name : 'N/A';
      },
    },
    {
      key: 'odpId' as keyof Customer,
      title: 'ODP',
      render: (value: number, record: Customer) => {
        const odp = odps?.data.find((o: Odp) => o.id === value);
        return odp ? odp.name : 'N/A';
      },
    },
    {
      key: 'status' as keyof Customer,
      title: 'Status',
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      key: 'createdAt' as keyof Customer,
      title: 'Created',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      key: 'actions' as keyof Customer,
      title: 'Actions',
      render: (value: any, record: Customer) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(record)}
            className="p-1 rounded hover:bg-accent"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="p-1 rounded hover:bg-accent text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage ISP customers and subscriptions</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <SearchInput
          placeholder="Search customers..."
          onSearch={handleSearch}
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Customers</h3>
          <p className="text-sm text-muted-foreground">
            {customers?.data.total || 0} total customers
          </p>
        </div>
        <CustomerTable
          data={customers?.data.data || []}
          columns={columns}
          loading={isLoading}
          pagination={{
            currentPage: customers?.data.current_page || 1,
            totalPages: customers?.data.last_page || 1,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      {/* Create Modal */}
      <ModalForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Customer"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PPP Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter PPP username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Package</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select package</option>
                {packages?.data.map((pkg: Package) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.speed}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ODP</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select ODP</option>
                {odps?.data.map((odp: Odp) => (
                  <option key={odp.id} value={odp.id}>
                    {odp.name} ({odp.usedPorts}/{odp.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Create Customer
            </button>
          </div>
        </div>
      </ModalForm>

      {/* Edit Modal */}
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedCustomer?.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PPP Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedCustomer?.pppSecret}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedCustomer?.phone}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="w-full p-2 border rounded-md" defaultValue={selectedCustomer?.status}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Update Customer
            </button>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default Customers;
