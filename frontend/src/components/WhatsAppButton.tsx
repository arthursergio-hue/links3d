import { MessageCircle, X } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

const WHATSAPP_LINKS = [
  { name: 'Floripa', url: 'https://wa.me/5548999604009' },
  { name: 'SP', url: 'https://wa.me/5511983056303' },
  { name: 'Rio', url: 'https://wa.me/5521983037802' }
];

export function WhatsAppButton() {
  const handleClick = () => {
    const randomLink = WHATSAPP_LINKS[Math.floor(Math.random() * WHATSAPP_LINKS.length)];
    window.open(randomLink.url, '_blank');
  };

  return (
    <button className={styles.button} onClick={handleClick} title="Fale conosco">
      <MessageCircle size={24} />
    </button>
  );
}