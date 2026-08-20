import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}) => {
  const statuses: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Out for Delivery', value: 'OutForDelivery' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  return (
    <div className="toolbar">
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by order #, customer, or product..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="status-pills">
        {statuses.map((st) => (
          <button
            key={st.value}
            className={`pill ${selectedStatus === st.value ? 'active' : ''}`}
            onClick={() => onStatusChange(st.value)}
          >
            {st.label}
          </button>
        ))}
      </div>
    </div>
  );
};
