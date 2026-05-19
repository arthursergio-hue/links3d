import { Empreendimento } from '../types';
import { Eye, Trash2, Edit2, Calendar, AlertTriangle, CheckCircle, XCircle, Link as LinkIcon, Clock, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import styles from './AdminCard.module.css';

interface AdminCardProps {
  empreendimento: Empreendimento;
  onUpdate: (id: string, data: Partial<Empreendimento>) => Promise<Empreendimento>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (empreendimento: Empreendimento) => void;
}

export function AdminCard({ empreendimento, onUpdate, onDelete, onEdit }: AdminCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(empreendimento.dataExpiracao.split('T')[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusLabels = {
    active: 'Ativo',
    expiring: 'Expirando',
    expired: 'Expirado'
  };

  const statusIcons = {
    active: <CheckCircle size={12} />,
    expiring: <AlertTriangle size={12} />,
    expired: <XCircle size={12} />
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysText = () => {
    if (empreendimento.status === 'expired') return 'Expirado';
    if (empreendimento.diasRestantes === 0) return 'Hoje';
    if (empreendimento.diasRestantes === 1) return '1 dia';
    return `${empreendimento.diasRestantes} dias`;
  };

  const handleOpen = () => {
    window.open(empreendimento.url, '_blank');
  };

  const handleSaveDate = async () => {
    await onUpdate(empreendimento.id, { dataExpiracao: new Date(editDate).toISOString() });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Deletar este empreendimento?')) {
      setIsDeleting(true);
      await onDelete(empreendimento.id);
    }
  };

  const handleExtend = async () => {
    window.open(empreendimento.url, '_blank');
    const novaData = new Date();
    novaData.setDate(novaData.getDate() + 30);
    await onUpdate(empreendimento.id, { dataExpiracao: novaData.toISOString() });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(empreendimento.url);
  };

  return (
    <div className={`${styles.card} ${styles[empreendimento.status]}`}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[`badge${empreendimento.status.charAt(0).toUpperCase() + empreendimento.status.slice(1)}`]}`}>
          {statusIcons[empreendimento.status]}
          {statusLabels[empreendimento.status]}
        </span>
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
          <div className={styles.metaItem}>
            <Calendar size={12} />
            <span>{formatDate(empreendimento.dataExpiracao)}</span>
          </div>
          <div className={`${styles.metaItem} ${styles[empreendimento.status]}`}>
            <Clock size={12} />
            <span>{getDaysText()}</span>
          </div>
        </div>

        <div className={styles.urlRow}>
          <LinkIcon size={12} />
          <span className={styles.url}>{empreendimento.url}</span>
          <button className={styles.copyBtn} onClick={copyLink} title="Copiar link">
            Copiar
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        {isEditing ? (
          <div className={styles.editDate}>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className={styles.dateInput}
            />
            <button onClick={handleSaveDate} className={styles.saveBtn}>OK</button>
            <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>X</button>
          </div>
        ) : (
          <div className={styles.adminActions}>
            <button className={styles.extendBtn} onClick={handleExtend} title="Estender">
              <Calendar size={14} />
              Estender
            </button>
            <button className={styles.editBtn} onClick={() => onEdit(empreendimento)} title="Editar">
              <Edit2 size={14} />
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete} disabled={isDeleting} title="Deletar">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}