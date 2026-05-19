import { Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <img
              src="https://www.seazone.com.br/_next/static/media/logo-seazone-white.73e8e44b.svg"
              alt="SeaZone"
              className={styles.logo}
            />
            <p className={styles.tagline}>Pronto para a sua próxima aventura?</p>
          </div>

          <div className={styles.section}>
            <nav className={styles.nav}>
              <a href="https://seazone.com.br/buscar" target="_blank" rel="noopener noreferrer">
                Buscar hospedagens
              </a>
              <a href="https://seazone.com.br/contato" target="_blank" rel="noopener noreferrer">
                Contato
              </a>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.title}>Informações gerais</h4>
            <nav className={styles.nav}>
              <a href="https://seazone.com.br/sobre" target="_blank" rel="noopener noreferrer">
                Sobre
              </a>
              <a href="https://seazone.com.br/empreendimentos" target="_blank" rel="noopener noreferrer">
                Empreendimentos
              </a>
              <a href="https://seazone.com.br/imprensa" target="_blank" rel="noopener noreferrer">
                Imprensa
              </a>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.title}>Nos siga nas redes sociais</h4>
            <div className={styles.social}>
              <a href="https://www.instagram.com/seazoneoficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/seazoneoficial/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/@seazoneoficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://www.linkedin.com/company/seazoneoficial/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            Copyright © 2025 Seazone. Todos os direitos reservados.
          </p>
          <nav className={styles.legal}>
            <a href="https://seazone.com.br/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
              Política de privacidade
            </a>
            <a href="https://seazone.com.br/termos-de-uso" target="_blank" rel="noopener noreferrer">
              Termos de uso
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}