import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CustomerTable from '@/components/CustomerTable';
import SearchInput from '@/components/SearchInput';
import ModalForm from '@/components/ModalForm';
import { packageApi } from '@/api/endpoints';
import { formatDate, formatCurrency, debounce } from '@/utils';
import type { Package } from '@/types';

const Packages: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(null);

  const { data: packages, isLoading, refetch } = useQuery({
    queryKey: ['packages'],
    queryFn: packageApi.getPackages,
  });

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleEdit = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (pkg: Package) => {
    if (window.confirm(`Are you sure you want to delete ${pkg.name}?`)) {
      try {
        await packageApi.deletePackage(pkg.id);
        refetch();
      } catch (error) {
        console.error('Failed to delete package:', error);
      }
    }
  };

  const filteredPackages = React.useMemo(() => {
    if (!packages?.data) return [];
    
    return packages.data.filter((pkg: Package) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.speed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.mikrotikProfile.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [packages, searchTerm]);

  const columns = [
    {
      key: 'name' as keyof Package,
      title: 'Package Name',
      sortable: true,
    },
    {
      key: 'speed' as keyof Package,
      title: 'Speed',
      sortable: true,
    },
    {
      key: 'price' as keyof Package,
      title: 'Price',
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'mikrotikProfile' as keyof Package,
      title: 'Mikrotik Profile',
      sortable: true,
    },
    {
      key: 'createdAt' as keyof Package,
      title: 'Created',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      key: 'actions' as keyof Package,
      title: 'Actions',
      render: (value: any, record: Package) => (
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
          <h1 className="text-3xl font-bold">Package Management</h1>
          <p className="text-muted-foreground">Manage internet packages and pricing</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <SearchInput
          placeholder="Search packages..."
          onSearch={handleSearch}
        />
      </div>

      {/* Packages Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Internet Packages</h3>
          <p className="text-sm text-muted-foreground">
            {filteredPackages.length} packages total
          </p>
        </div>
        <CustomerTable
          data={filteredPackages}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* Create Modal */}
      <ModalForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Package"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Package Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter package name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Speed</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 10 Mbps, 50 Mbps"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded-md"
              placeholder="Enter monthly price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mikrotik Profile</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter Mikrotik profile name"
            />
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
              Create Package
            </button>
          </div>
        </div>
      </ModalForm>

      {/* Edit Modal */}
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Package"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Package Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedPackage?.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Speed</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedPackage?.speed}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedPackage?.price}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mikrotik Profile</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedPackage?.mikrotikProfile}
            />
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
              Update Package
            </button>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default Packages;
