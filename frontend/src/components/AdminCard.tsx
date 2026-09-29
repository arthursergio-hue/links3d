import { Empreendimento } from '../types';
import { Eye, Trash2, Edit2, Link as LinkIcon, Clock, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import styles from './AdminCard.module.css';

interface AdminCardProps {
  empreendimento: Empreendimento;
  onDelete: (id: string) => Promise<void>;
  onEdit: (empreendimento: Empreendimento) => void;
}

export function AdminCard({ empreendimento, onDelete, onEdit }: AdminCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');

  const handleOpen = () => {
    window.open(empreendimento.url, '_blank');
  };

  const handleDelete = async () => {
    if (confirm('Deletar este empreendimento?')) {
      setIsDeleting(true);
      await onDelete(empreendimento.id);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(empreendimento.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handleOpen} title="Abrir em nova aba">
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      <div className={styles.thumbnail}>
        {empreendimento.thumbnailUrl ? (
          <img src={empreendimento.thumbnailUrl} alt={empreendimento.nome} />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <Eye size={28} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{empreendimento.nome}</h3>

        <div className={styles.meta}>
          <div className={styles.metaItem} title="Última atualização">
            <Clock size={12} />
            <span>Atualizado em {formatDate(empreendimento.ultimaAtualizacao)}</span>
          </div>
        </div>

        <div className={styles.urlRow}>
          <LinkIcon size={12} />
          <span className={styles.url}>{empreendimento.url}</span>
          <button className={styles.copyBtn} onClick={copyLink} title="Copiar link">
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.adminActions}>
          <button className={styles.extendBtn} onClick={() => onEdit(empreendimento)} title="Editar">
            <Edit2 size={14} />
            Editar
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete} disabled={isDeleting} title="Deletar">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}