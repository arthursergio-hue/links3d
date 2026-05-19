import { Empreendimento } from '../types';
import { Eye, AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import styles from './ClienteCard.module.css';

interface ClienteCardProps {
  empreendimento: Empreendimento;
}

export function ClienteCard({ empreendimento }: ClienteCardProps) {
  const statusLabels = {
    active: 'Disponível',
    expiring: 'Expirando em breve',
    expired: 'Indisponível'
  };

  const statusIcons = {
    active: <CheckCircle size={14} />,
    expiring: <AlertTriangle size={14} />,
    expired: <XCircle size={14} />
  };

  const handleOpen = () => {
    window.open(empreendimento.url, '_blank');
  };

  return (
    <div className={`${styles.card} ${styles[empreendimento.status]}`}>
      <div className={styles.thumbnail}>
        {empreendimento.thumbnailUrl ? (
          <img src={empreendimento.thumbnailUrl} alt={empreendimento.nome} />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <Eye size={36} />
          </div>
        )}
        <span className={`${styles.badge} ${styles[`badge${empreendimento.status.charAt(0).toUpperCase() + empreendimento.status.slice(1)}`]}`}>
          {statusIcons[empreendimento.status]}
          {statusLabels[empreendimento.status]}
        </span>
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