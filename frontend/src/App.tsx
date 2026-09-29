import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ClienteCard } from './components/ClienteCard';
import { AdminCard } from './components/AdminCard';
import { EmpreendimentoForm } from './components/EmpreendimentoForm';
import { FilterBar, CapaFilter, SortOrder } from './components/FilterBar';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { LoadingScreen } from './components/LoadingScreen';
import { useEmpreendimentos } from './hooks/useEmpreendimentos';
import { CreateEmpreendimentoInput, Empreendimento } from './types';
import styles from './App.module.css';

// Tempo mínimo da tela de carregamento, para o slideshow não piscar quando a API responde rápido.
const MIN_SPLASH_MS = 2800;
const SPLASH_EXIT_MS = 600;

function App() {
  const { empreendimentos, loading, error, addEmpreendimento, updateEmpreendimento, deleteEmpreendimento, refresh } = useEmpreendimentos();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmpreendimento, setEditingEmpreendimento] = useState<Empreendimento | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [search, setSearch] = useState('');
  const [capa, setCapa] = useState<CapaFilter>('all');
  const [sort, setSort] = useState<SortOrder>('az');
  const [minSplashDone, setMinSplashDone] = useState(false);
  const [splash, setSplash] = useState<'visible' | 'exiting' | 'hidden'>('visible');

  useEffect(() => {
    const timer = setTimeout(() => setMinSplashDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (splash === 'visible' && !loading && minSplashDone) setSplash('exiting');
  }, [splash, loading, minSplashDone]);

  useEffect(() => {
    if (splash !== 'exiting') return;
    const timer = setTimeout(() => setSplash('hidden'), SPLASH_EXIT_MS);
    return () => clearTimeout(timer);
  }, [splash]);

  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const query = normalize(search.trim());

  // Público: busca só pelo nome. Admin: também por link/observação, com filtro de capa e ordenação.
  const filteredEmpreendimentos = empreendimentos
    .filter(item => {
      const campos = isAdmin ? [item.nome, item.url, item.observacoes ?? ''] : [item.nome];
      const matchesSearch = !query || campos.some(campo => normalize(campo).includes(query));
      const matchesCapa = !isAdmin || capa === 'all' || (capa === 'com') === Boolean(item.thumbnailUrl);
      return matchesSearch && matchesCapa;
    })
    .sort((a, b) => {
      if (!isAdmin || sort === 'az') return a.nome.localeCompare(b.nome, 'pt-BR');
      if (sort === 'za') return b.nome.localeCompare(a.nome, 'pt-BR');
      return new Date(b.ultimaAtualizacao).getTime() - new Date(a.ultimaAtualizacao).getTime();
    });

  const handleAddEmpreendimento = async (data: CreateEmpreendimentoInput) => {
    await addEmpreendimento(data);
    setShowForm(false);
  };

  const handleUpdateEmpreendimento = async (data: CreateEmpreendimentoInput) => {
    if (!editingEmpreendimento) return;
    await updateEmpreendimento(editingEmpreendimento.id, data);
    setEditingEmpreendimento(null);
  };

  const handleEdit = (empreendimento: Empreendimento) => {
    setEditingEmpreendimento(empreendimento);
  };

  const handleCloseEdit = () => {
    setEditingEmpreendimento(null);
  };

  const comCapaCount = empreendimentos.filter(item => item.thumbnailUrl).length;

  return (
    <div className={styles.app}>
      <Header
        isAdmin={isAdmin}
        onLogin={() => setShowLogin(true)}
        onLogout={() => setIsAdmin(false)}
        onRefresh={refresh}
      />

      <main className={styles.main}>
        <div className={styles.container}>
          {isAdmin ? (
            <>
              <div className={styles.adminHeader}>
                <h1 className={styles.adminTitle}>Gerenciar Empreendimentos</h1>
              </div>

              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{empreendimentos.length}</span>
                  <span className={styles.statLabel}>Total</span>
                </div>
                <div className={`${styles.statCard} ${styles.statActive}`}>
                  <span className={styles.statValue}>{comCapaCount}</span>
                  <span className={styles.statLabel}>Com capa</span>
                </div>
                <div className={`${styles.statCard} ${styles.statWarning}`}>
                  <span className={styles.statValue}>{empreendimentos.length - comCapaCount}</span>
                  <span className={styles.statLabel}>Sem capa</span>
                </div>
              </div>

              <div className={styles.actions}>
                <FilterBar
                  search={search}
                  onSearchChange={setSearch}
                  capa={capa}
                  onCapaChange={setCapa}
                  sort={sort}
                  onSortChange={setSort}
                  total={empreendimentos.length}
                  shown={filteredEmpreendimentos.length}
                />
                <button className={styles.addButton} onClick={() => setShowForm(true)}>
                  + Novo Empreendimento
                </button>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.grid}>
                {filteredEmpreendimentos.map(item => (
                  <AdminCard
                    key={item.id}
                    empreendimento={item}
                    onDelete={deleteEmpreendimento}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {error && <div className={styles.error}>{error}</div>}

              {filteredEmpreendimentos.length === 0 ? (
                <div className={styles.empty}>
                  <p>Nenhum empreendimento disponível no momento.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  {filteredEmpreendimentos.map(item => (
                    <ClienteCard
                      key={item.id}
                      empreendimento={item}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      {splash !== 'hidden' && <LoadingScreen exiting={splash === 'exiting'} />}

      {showForm && (
        <EmpreendimentoForm
          onSubmit={handleAddEmpreendimento}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingEmpreendimento && (
        <EmpreendimentoForm
          onSubmit={handleUpdateEmpreendimento}
          onClose={handleCloseEdit}
          editMode={true}
          initialData={editingEmpreendimento}
        />
      )}

      {showLogin && (
        <LoginModal
          onLogin={() => {
            setIsAdmin(true);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}

export default App;