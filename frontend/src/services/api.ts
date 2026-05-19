const API_BASE = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Erro na requisição');
  }

  return response.json();
}

export const api = {
  getEmpreendimentos: () => fetchAPI<import('../types').Empreendimento[]>('/empreendimentos'),

  getEmpreendimento: (id: string) => fetchAPI<import('../types').Empreendimento>(`/empreendimentos/${id}`),

  createEmpreendimento: (data: import('../types').CreateEmpreendimentoInput) =>
    fetchAPI<import('../types').Empreendimento>('/empreendimentos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEmpreendimento: (id: string, data: import('../types').UpdateEmpreendimentoInput) =>
    fetchAPI<import('../types').Empreendimento>(`/empreendimentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteEmpreendimento: (id: string) =>
    fetchAPI<{ message: string }>(`/empreendimentos/${id}`, {
      method: 'DELETE',
    }),
};