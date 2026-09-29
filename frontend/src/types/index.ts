export interface Empreendimento {
  id: string;
  nome: string;
  url: string;
  thumbnailUrl?: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  observacoes?: string;
}

export interface CreateEmpreendimentoInput {
  nome: string;
  url: string;
  thumbnailUrl?: string;
  observacoes?: string;
}

export interface UpdateEmpreendimentoInput {
  nome?: string;
  url?: string;
  thumbnailUrl?: string;
  observacoes?: string;
}
