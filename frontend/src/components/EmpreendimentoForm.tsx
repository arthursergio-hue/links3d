import { useState } from 'react';
import { X, Plus, Calendar, Link as LinkIcon, Save, Image } from 'lucide-react';
import { ThumbnailUpload } from './ThumbnailUpload';
import { Empreendimento } from '../types';
import styles from './EmpreendimentoForm.module.css';

interface EmpreendimentoFormProps {
  onSubmit: (data: {
    nome: string;
    url: string;
    thumbnailUrl?: string;
    dataExpiracao: string;
    observacoes?: string;
  }) => Promise<void>;
  onClose: () => void;
  editMode?: boolean;
  initialData?: Partial<Empreendimento>;
}

export function EmpreendimentoForm({ onSubmit, onClose, editMode = false, initialData }: EmpreendimentoFormProps) {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '');
  const [dataExpiracao, setDataExpiracao] = useState(
    initialData?.dataExpiracao ? new Date(initialData.dataExpiracao).toISOString().split('T')[0] : ''
  );
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!url.trim()) {
      setError('URL é obrigatória');
      return;
    }
    if (!url.includes('autode.sk')) {
      setError('A URL deve ser um link do Autodesk (autode.sk)');
      return;
    }
    if (!dataExpiracao) {
      setError('Data de expiração é obrigatória');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        nome: nome.trim(),
        url: url.trim(),
        thumbnailUrl: thumbnailUrl || undefined,
        dataExpiracao: new Date(dataExpiracao).toISOString(),
        observacoes: observacoes.trim() || undefined
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            {editMode ? <Save size={20} /> : <Plus size={20} />}
            {editMode ? 'Editar Empreendimento' : 'Novo Empreendimento'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome do Empreendimento</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Santinho Spot"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="url">
              <LinkIcon size={14} />
              URL do Autodesk
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://autode.sk/..."
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <ThumbnailUpload
              currentUrl={thumbnailUrl}
              onUpload={setThumbnailUrl}
              empreendimentoNome={nome}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="dataExpiracao">
              <Calendar size={14} />
              Data de Expiração
            </label>
            <input
              id="dataExpiracao"
              type="date"
              value={dataExpiracao}
              onChange={e => setDataExpiracao(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="observacoes">Observações (opcional)</label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              placeholder="Anotações sobre o empreendimento..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Salvando...' : editMode ? 'Salvar Alterações' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}