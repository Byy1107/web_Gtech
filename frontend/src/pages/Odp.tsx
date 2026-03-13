import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import CustomerTable from '@/components/CustomerTable';
import SearchInput from '@/components/SearchInput';
import ModalForm from '@/components/ModalForm';
import { odpApi } from '@/api/endpoints';
import { formatDate, debounce } from '@/utils';
import type { Odp } from '@/types';

const Odp: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedOdp, setSelectedOdp] = React.useState<Odp | null>(null);

  const { data: odps, isLoading, refetch } = useQuery({
    queryKey: ['odps'],
    queryFn: odpApi.getOdps,
  });

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleEdit = (odp: Odp) => {
    setSelectedOdp(odp);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (odp: Odp) => {
    if (window.confirm(`Are you sure you want to delete ${odp.name}?`)) {
      try {
        await odpApi.deleteOdp(odp.id);
        refetch();
      } catch (error) {
        console.error('Failed to delete ODP:', error);
      }
    }
  };

  const filteredOdps = React.useMemo(() => {
    if (!odps?.data) return [];
    
    return odps.data.filter((odp: Odp) =>
      odp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      odp.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [odps, searchTerm]);

  const columns = [
    {
      key: 'name' as keyof Odp,
      title: 'ODP Name',
      sortable: true,
    },
    {
      key: 'location' as keyof Odp,
      title: 'Location',
      sortable: true,
    },
    {
      key: 'capacity' as keyof Odp,
      title: 'Capacity',
      sortable: true,
    },
    {
      key: 'usedPorts' as keyof Odp,
      title: 'Used Ports',
      sortable: true,
      render: (value: number, record: Odp) => {
        const percentage = (value / record.capacity) * 100;
        const colorClass = percentage > 80 ? 'text-red-600' : percentage > 60 ? 'text-yellow-600' : 'text-green-600';
        
        return (
          <div className="flex items-center space-x-2">
            <span className={colorClass}>{value}</span>
            <span className="text-muted-foreground">/ {record.capacity}</span>
            <span className={`text-xs ${colorClass}`}>({percentage.toFixed(1)}%)</span>
          </div>
        );
      },
    },
    {
      key: 'latitude' as keyof Odp,
      title: 'Coordinates',
      render: (value: number, record: Odp) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value.toFixed(4)}, {record.longitude.toFixed(4)}</span>
        </div>
      ),
    },
    {
      key: 'createdAt' as keyof Odp,
      title: 'Created',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      key: 'actions' as keyof Odp,
      title: 'Actions',
      render: (value: any, record: Odp) => (
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
          <h1 className="text-3xl font-bold">ODP Management</h1>
          <p className="text-muted-foreground">Manage fiber distribution points</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add ODP</span>
        </button>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <SearchInput
          placeholder="Search ODPs..."
          onSearch={handleSearch}
        />
      </div>

      {/* ODP Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Distribution Points</h3>
          <p className="text-sm text-muted-foreground">
            {filteredOdps.length} ODPs total
          </p>
        </div>
        <CustomerTable
          data={filteredOdps}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* Map View Placeholder */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">ODP Map View</h3>
        <div className="h-64 bg-muted rounded-md flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive map will be implemented here</p>
            <p className="text-sm text-muted-foreground">Showing ODP locations and capacity usage</p>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <ModalForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New ODP"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ODP Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter ODP name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter location description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                placeholder="Enter capacity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Used Ports</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                placeholder="Enter used ports"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                className="w-full p-2 border rounded-md"
                placeholder="Enter latitude"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                className="w-full p-2 border rounded-md"
                placeholder="Enter longitude"
              />
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
              Create ODP
            </button>
          </div>
        </div>
      </ModalForm>

      {/* Edit Modal */}
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit ODP"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ODP Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedOdp?.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={selectedOdp?.location}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                defaultValue={selectedOdp?.capacity}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Used Ports</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                defaultValue={selectedOdp?.usedPorts}
              />
            </div>
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
              Update ODP
            </button>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default Odp;
