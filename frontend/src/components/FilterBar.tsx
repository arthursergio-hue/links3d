import { Search } from 'lucide-react';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  filter: 'all' | 'active' | 'expiring' | 'expired';
  onFilterChange: (filter: 'all' | 'active' | 'expiring' | 'expired') => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function FilterBar({ filter, onFilterChange, search, onSearchChange }: FilterBarProps) {
  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Ativos' },
    { key: 'expiring', label: 'Expirando' },
    { key: 'expired', label: 'Expirados' }
  ] as const;

  return (
    <div className={styles.bar}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filters}>
        {filters.map(f => (
          <button
            key={f.key}
            className={`${styles.filterButton} ${filter === f.key ? styles.active : ''} ${styles[f.key]}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}