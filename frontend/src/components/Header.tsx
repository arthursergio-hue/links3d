import { useState } from 'react';
import { RefreshCw, Shield, LogOut, LogIn } from 'lucide-react';
import styles from './Header.module.css';
import logoUrl from '../assets/logo-seazone.png';

interface HeaderProps {
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onRefresh: () => void;
}

export function Header({ isAdmin, onLogin, onLogout, onRefresh }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logoUrl} alt="Seazone" className={styles.logoImage} />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Empreendimentos</span>
            <span className={styles.logoBadge}>3D Viewer</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.iconButton} onClick={onRefresh} title="Atualizar">
            <RefreshCw size={18} />
          </button>

          {isAdmin ? (
            <div className={styles.adminArea}>
              <span className={styles.adminBadge}>
                <Shield size={14} />
                Admin
              </span>
              <button className={styles.logoutButton} onClick={onLogout}>
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <button className={styles.loginButton} onClick={onLogin}>
              <LogIn size={16} />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}