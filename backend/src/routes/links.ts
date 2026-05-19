import { Request, Response } from 'express';
import { Router } from 'express';
import { db, Empreendimento } from '../database/index.js';
import { v4 as uuidv4 } from 'uuid';

function calculateStatus(dataExpiracao: string): 'active' | 'expiring' | 'expired' {
  const now = new Date();
  const expires = new Date(dataExpiracao);
  const daysUntilExpiration = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration < 0) return 'expired';
  if (daysUntilExpiration <= 7) return 'expiring';
  return 'active';
}

function enrichEmpreendimento(item: Empreendimento) {
  const status = calculateStatus(item.dataExpiracao);
  const diasRestantes = Math.ceil((new Date(item.dataExpiracao).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return { ...item, status, diasRestantes };
}

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    db.refresh();
    const items = db.all();
    const enriched = items
      .map(enrichEmpreendimento)
      .sort((a, b) => new Date(a.dataExpiracao).getTime() - new Date(b.dataExpiracao).getTime());
    res.json(enriched);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Erro ao buscar empreendimentos' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.refresh();
    const item = db.findById(id);

    if (!item) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    res.json(enrichEmpreendimento(item));
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Erro ao buscar empreendimento' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { nome, url, thumbnailUrl, dataExpiracao, observacoes } = req.body;

    if (!nome || !url || !dataExpiracao) {
      return res.status(400).json({ error: 'Nome, URL e data de expiração são obrigatórios' });
    }

    const now = new Date().toISOString();
    const newItem: Empreendimento = {
      id: uuidv4(),
      nome,
      url,
      thumbnailUrl: thumbnailUrl || '',
      dataExpiracao,
      dataCriacao: now,
      ultimaAtualizacao: now,
      status: calculateStatus(dataExpiracao),
      observacoes: observacoes || ''
    };

    db.insert(newItem);
    res.status(201).json(enrichEmpreendimento(newItem));
  } catch (error) {
    console.error('Error creating:', error);
    res.status(500).json({ error: 'Erro ao criar empreendimento' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, url, thumbnailUrl, dataExpiracao, observacoes } = req.body;

    db.refresh();
    const existing = db.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    const now = new Date().toISOString();
    const updatedDataExpiracao = dataExpiracao || existing.dataExpiracao;

    const updates: Partial<Empreendimento> = {
      nome: nome ?? existing.nome,
      url: url ?? existing.url,
      thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
      dataExpiracao: updatedDataExpiracao,
      ultimaAtualizacao: now,
      observacoes: observacoes !== undefined ? observacoes : existing.observacoes
    };

    const updated = db.update(id, updates);
    res.json(enrichEmpreendimento(updated!));
  } catch (error) {
    console.error('Error updating:', error);
    res.status(500).json({ error: 'Erro ao atualizar empreendimento' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.refresh();
    const deleted = db.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    res.json({ message: 'Empreendimento deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting:', error);
    res.status(500).json({ error: 'Erro ao deletar empreendimento' });
  }
});