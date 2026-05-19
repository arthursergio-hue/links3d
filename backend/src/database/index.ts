import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'empreendimentos.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export interface Empreendimento {
  id: string;
  nome: string;
  url: string;
  thumbnailUrl?: string;
  dataExpiracao: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  status: string;
  observacoes?: string;
}

// Load data
function loadData(): Empreendimento[] {
  if (!fs.existsSync(dbPath)) {
    const now = new Date().toISOString();
    const sampleData: Empreendimento[] = [
      {
        id: '1',
        nome: 'Santinho Spot',
        url: 'https://autode.sk/43d6Kk3',
        thumbnailUrl: '',
        dataExpiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        dataCriacao: now,
        ultimaAtualizacao: now,
        status: 'expiring'
      },
      {
        id: '2',
        nome: 'Santo Antônio Spot',
        url: 'https://autode.sk/4wIJZCj',
        thumbnailUrl: '',
        dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        dataCriacao: now,
        ultimaAtualizacao: now,
        status: 'active'
      }
    ];
    saveData(sampleData);
    console.log('Sample data created');
    return sampleData;
  }

  try {
    const content = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function saveData(data: Empreendimento[]): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

class Database {
  private data: Empreendimento[];

  constructor() {
    this.data = loadData();
  }

  all(): Empreendimento[] {
    return this.data;
  }

  findById(id: string): Empreendimento | undefined {
    return this.data.find(item => item.id === id);
  }

  insert(item: Empreendimento): Empreendimento {
    this.data.push(item);
    saveData(this.data);
    return item;
  }

  update(id: string, updates: Partial<Empreendimento>): Empreendimento | undefined {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    this.data[index] = { ...this.data[index], ...updates };
    saveData(this.data);
    return this.data[index];
  }

  delete(id: string): boolean {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    saveData(this.data);
    return true;
  }

  refresh(): void {
    this.data = loadData();
  }
}

export const db = new Database();