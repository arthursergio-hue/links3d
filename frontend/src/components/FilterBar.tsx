import { Search } from 'lucide-react';
import styles from './FilterBar.module.css';

export type CapaFilter = 'all' | 'com' | 'sem';
export type SortOrder = 'az' | 'za' | 'recentes';

interface FilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  capa: CapaFilter;
  onCapaChange: (capa: CapaFilter) => void;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  total: number;
  shown: number;
}

const capaOptions = [
  { key: 'all', label: 'Todos' },
  { key: 'com', label: 'Com capa' },
  { key: 'sem', label: 'Sem capa' }
] as const;

export function FilterBar({ search, onSearchChange, capa, onCapaChange, sort, onSortChange, total, shown }: FilterBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Buscar por nome, link ou observação..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filters}>
        {capaOptions.map(f => (
          <button
            key={f.key}
            type="button"
            className={`${styles.filterButton} ${capa === f.key ? styles.active : ''}`}
            onClick={() => onCapaChange(f.key)}
          >
            {f.label}
          </button>
        ))}

        <select
          className={styles.sortSelect}
          value={sort}
          onChange={e => onSortChange(e.target.value as SortOrder)}
          aria-label="Ordenar"
        >
          <option value="az">Nome A–Z</option>
          <option value="za">Nome Z–A</option>
          <option value="recentes">Atualizados recentemente</option>
        </select>
      </div>

      {shown !== total && (
        <span className={styles.count}>{shown} de {total}</span>
      )}
    </div>
  );
}
