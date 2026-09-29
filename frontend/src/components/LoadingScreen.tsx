import { useEffect, useState } from 'react';
import logoUrl from '../assets/logo-seazone.png';
import styles from './LoadingScreen.module.css';

interface Slide {
  nome: string;
  cidade: string;
  bairro: string;
  imagem: string;
}

interface LoadingScreenProps {
  exiting?: boolean;
}

const SLIDE_INTERVAL = 2600;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function preload(src: string): Promise<void> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

export function LoadingScreen({ exiting = false }: LoadingScreenProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(-1);
  const [previous, setPrevious] = useState(-1);

  useEffect(() => {
    let cancelled = false;
    fetch('/loading/manifest.json')
      .then(res => res.json() as Promise<Slide[]>)
      .then(async data => {
        const ordered = shuffle(data);
        if (!ordered.length) return;
        await preload(ordered[0].imagem);
        if (cancelled) return;
        setSlides(ordered);
        setCurrent(0);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (slides.length < 2 || current < 0) return;
    let cancelled = false;
    const next = (current + 1) % slides.length;
    const timer = setTimeout(async () => {
      await preload(slides[next].imagem);
      if (cancelled) return;
      setPrevious(current);
      setCurrent(next);
    }, SLIDE_INTERVAL);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [slides, current]);

  const active = slides[current];

  return (
    <div className={`${styles.screen} ${exiting ? styles.exiting : ''}`} role="status" aria-live="polite">
      <div className={styles.slides} aria-hidden="true">
        {[previous, current].filter(index => index >= 0).map(index => (
          <div
            key={slides[index].imagem}
            className={`${styles.slide} ${index === current ? styles.slideActive : ''}`}
            style={{ backgroundImage: `url(${slides[index].imagem})` }}
          />
        ))}
      </div>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <img src={logoUrl} alt="Seazone" className={styles.logo} />

        <div className={styles.center}>
          <span className={styles.eyebrow}>Experiência 360°</span>
          <h1 className={styles.title}>Conheça cada detalhe{' '}<br />antes de chegar</h1>
          <div className={styles.progress}>
            <span className={styles.progressBar} />
          </div>
          <span className={styles.status}>Carregando empreendimentos</span>
        </div>

        <div className={styles.caption}>
          {active && (
            <div key={active.imagem} className={styles.captionInner}>
              <span className={styles.captionName}>{active.nome}</span>
              <span className={styles.captionPlace}>
                {[active.bairro, active.cidade].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
          {slides.length > 1 && (
            <span className={styles.counter}>
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
