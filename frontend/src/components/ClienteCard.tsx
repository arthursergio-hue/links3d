import { Empreendimento } from '../types';
import { Eye, ExternalLink } from 'lucide-react';
import styles from './ClienteCard.module.css';

interface ClienteCardProps {
  empreendimento: Empreendimento;
}

export function ClienteCard({ empreendimento }: ClienteCardProps) {
  const handleOpen = () => {
    window.open(empreendimento.url, '_blank');
  };

  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        {empreendimento.thumbnailUrl ? (
          <img src={empreendimento.thumbnailUrl} alt={empreendimento.nome} />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <Eye size={36} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{empreendimento.nome}</h3>
        {empreendimento.observacoes && (
          <p className={styles.observacoes}>{empreendimento.observacoes}</p>
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.openButton} onClick={handleOpen}>
          <ExternalLink size={18} />
          Visualizar Projeto
        </button>
      </div>
    </div>
  );
}