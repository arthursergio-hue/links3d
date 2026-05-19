import { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { X } from 'lucide-react';
import styles from './LoginModal.module.css';
import logoUrl from '../assets/logo.png';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface LoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

export function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError('Erro ao obter credencial do Google');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login com Google');
        return;
      }

      onLogin();
    } catch {
      setError('Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Erro ao inicializar login com Google');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>

          <div className={styles.logo}>
            <img src={logoUrl} alt="Seazone" className={styles.logoImage} />
            <div className={styles.titleArea}>
              <h1>Acesso Admin</h1>
              <p>Faça login com sua conta Seazone</p>
            </div>
          </div>

          <div className={styles.form}>
            {GOOGLE_CLIENT_ID ? (
              <div className={styles.googleSection}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="signin_with"
                />
                {loading && <p className={styles.loading}>Verificando...</p>}
              </div>
            ) : (
              <div className={styles.demoWarning}>
                <p>Google OAuth não está configurado.</p>
                <p>Defina VITE_GOOGLE_CLIENT_ID no arquivo .env</p>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}