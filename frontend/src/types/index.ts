export interface Empreendimento {
  id: string;
  nome: string;
  url: string;
  thumbnailUrl?: string;
  dataExpiracao: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  status: 'active' | 'expiring' | 'expired';
  diasRestantes: number;
  observacoes?: string;
}

export interface CreateEmpreendimentoInput {
  nome: string;
  url: string;
  thumbnailUrl?: string;
  dataExpiracao: string;
  observacoes?: string;
}

export interface UpdateEmpreendimentoInput {
  nome?: string;
  url?: string;
  thumbnailUrl?: string;
  dataExpiracao?: string;
  observacoes?: string;
}