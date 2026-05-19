import { useState, useEffect, useCallback } from 'react';
import { Empreendimento, CreateEmpreendimentoInput, UpdateEmpreendimentoInput } from '../types';
import { api } from '../services/api';

export function useEmpreendimentos() {
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpreendimentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEmpreendimentos();
      setEmpreendimentos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar empreendimentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpreendimentos();
  }, [fetchEmpreendimentos]);

  const addEmpreendimento = async (data: CreateEmpreendimentoInput) => {
    const newItem = await api.createEmpreendimento(data);
    setEmpreendimentos(prev => [...prev, newItem].sort((a, b) =>
      new Date(a.dataExpiracao).getTime() - new Date(b.dataExpiracao).getTime()
    ));
    return newItem;
  };

  const updateEmpreendimento = async (id: string, data: UpdateEmpreendimentoInput) => {
    const updated = await api.updateEmpreendimento(id, data);
    setEmpreendimentos(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  };

  const deleteEmpreendimento = async (id: string) => {
    await api.deleteEmpreendimento(id);
    setEmpreendimentos(prev => prev.filter(item => item.id !== id));
  };

  const refresh = fetchEmpreendimentos;

  return { empreendimentos, loading, error, addEmpreendimento, updateEmpreendimento, deleteEmpreendimento, refresh };
}