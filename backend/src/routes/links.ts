import { Request, Response } from 'express';
import { Router } from 'express';
import { db, Empreendimento } from '../database/index.js';
import { v4 as uuidv4 } from 'uuid';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    db.refresh();
    const items = db.all();
    const sorted = [...items].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    res.json(sorted);
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

    res.json(item);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Erro ao buscar empreendimento' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { nome, url, thumbnailUrl, observacoes } = req.body;

    if (!nome || !url) {
      return res.status(400).json({ error: 'Nome e URL são obrigatórios' });
    }

    const now = new Date().toISOString();
    const newItem: Empreendimento = {
      id: uuidv4(),
      nome,
      url,
      thumbnailUrl: thumbnailUrl || '',
      dataCriacao: now,
      ultimaAtualizacao: now,
      observacoes: observacoes || ''
    };

    db.insert(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating:', error);
    res.status(500).json({ error: 'Erro ao criar empreendimento' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, url, thumbnailUrl, observacoes } = req.body;

    db.refresh();
    const existing = db.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    const now = new Date().toISOString();

    const updates: Partial<Empreendimento> = {
      nome: nome ?? existing.nome,
      url: url ?? existing.url,
      thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
      ultimaAtualizacao: now,
      observacoes: observacoes !== undefined ? observacoes : existing.observacoes
    };

    const updated = db.update(id, updates);
    res.json(updated);
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