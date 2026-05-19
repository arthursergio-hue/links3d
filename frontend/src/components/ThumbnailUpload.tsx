import { useState, useEffect } from 'react';
import { Image, RefreshCw, Check, X, AlertTriangle, Loader, FolderOpen, ExternalLink } from 'lucide-react';
import styles from './ThumbnailUpload.module.css';

interface ThumbnailUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  empreendimentoNome: string;
  isEditMode?: boolean;
}

export function ThumbnailUpload({ currentUrl, onUpload, empreendimentoNome, isEditMode = false }: ThumbnailUploadProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [preview, setPreview] = useState(currentUrl || '');

  // Se já tem URL, mostrar preview
  useEffect(() => {
    if (currentUrl) {
      setPreview(currentUrl);
    }
  }, [currentUrl]);

  function handleSelectImage(url: string) {
    setPreview(url);
    onUpload(url);
  }

  function handleRemove() {
    setPreview('');
    onUpload('');
  }

  function handleUrlSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('url') as HTMLInputElement;
    const url = input.value.trim();

    if (url) {
      setPreview(url);
      onUpload(url);
      input.value = '';
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <Image size={14} />
        Capa do Empreendimento
      </label>

      {/* Preview */}
      {preview ? (
        <div className={styles.preview}>
          <img src={preview} alt="Capa" onError={() => setPreview('')} />
          <div className={styles.previewActions}>
            <button type="button" className={styles.changeBtn} onClick={() => setMode('url')}>
              <RefreshCw size={14} />
              Trocar
            </button>
            <button type="button" className={styles.removeBtn} onClick={handleRemove}>
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.upload}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'url' ? styles.active : ''}`}
              onClick={() => setMode('url')}
            >
              <ExternalLink size={14} />
              URL Manual
            </button>
          </div>

          {/* URL Manual */}
          {mode === 'url' && (
            <form onSubmit={handleUrlSubmit} className={styles.urlForm}>
              <input
                type="url"
                name="url"
                placeholder="Cole URL da imagem"
                className={styles.urlInput}
              />
              <button type="submit" className={styles.urlBtn}>
                Adicionar
              </button>
            </form>
          )}

          <div className={styles.hint}>
            💡 Para buscar capas automaticamente, configure Supabase ou Google Drive.
          </div>
        </div>
      )}
    </div>
  );
}