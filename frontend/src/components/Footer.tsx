import { Github, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h4 className={styles.title}>Institucional</h4>
            <nav className={styles.nav}>
              <a href="https://www.seazone.com.br/sobre" target="_blank" rel="noopener noreferrer">Sobre</a>
              <a href="https://www.seazone.com.br/empreendimentos" target="_blank" rel="noopener noreferrer">Empreendimentos</a>
              <a href="https://www.seazone.com.br/imprensa" target="_blank" rel="noopener noreferrer">Imprensa</a>
              <a href="https://www.seazone.com.br/trabalhe-conosco" target="_blank" rel="noopener noreferrer">Trabalhe Conosco</a>
              <a href="https://www.seazone.com.br/contato" target="_blank" rel="noopener noreferrer">Contato</a>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Produtos</h4>
            <nav className={styles.nav}>
              <a href="https://www.seazone.com.br/tour-virtual" target="_blank" rel="noopener noreferrer">Tour Virtual</a>
              <a href="https://www.seazone.com.br/planta-3d" target="_blank" rel="noopener noreferrer">Planta 3D</a>
              <a href="https://www.seazone.com.br/realidade-virtual" target="_blank" rel="noopener noreferrer">Realidade Virtual</a>
              <a href="https://www.seazone.com.br/mao-de-obra" target="_blank" rel="noopener noreferrer">Mão de Obra</a>
              <a href="https://www.seazone.com.br/servicos" target="_blank" rel="noopener noreferrer">Serviços</a>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Links</h4>
            <nav className={styles.nav}>
              <a href="https://www.seazone.com.br/calculadora" target="_blank" rel="noopener noreferrer">Calculadora de Obra</a>
              <a href="https://www.seazone.com.br/blog" target="_blank" rel="noopener noreferrer">Blog</a>
              <a href="https://www.seazone.com.br/calculadora-de-metragem" target="_blank" rel="noopener noreferrer">Calculadora de Metragem</a>
              <a href="https://www.seazone.com.br/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Redes Sociais</h4>
            <div className={styles.social}>
              <a href="https://www.instagram.com/seazoneoficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/seazoneoficial/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/seazoneoficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://www.linkedin.com/company/seazoneoficial/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>

            <div className={styles.locations}>
              <h5 className={styles.subtitle}>Filiais</h5>
              <nav className={styles.nav}>
                <a href="https://www.seazone.com.br/filial/florianopolis" target="_blank" rel="noopener noreferrer">Florianópolis - SC</a>
                <a href="https://www.seazone.com.br/filial/saopaulo" target="_blank" rel="noopener noreferrer">São Paulo - SP</a>
                <a href="https://www.seazone.com.br/filial/rio" target="_blank" rel="noopener noreferrer">Rio de Janeiro - RJ</a>
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <span>© 2026 SeaZone. Todos os direitos reservados.</span>
            <span className={styles.cnpj}>CNPJ: 29.378.484/0001-47</span>
          </div>
        </div>
      </div>
    </footer>
  );
}