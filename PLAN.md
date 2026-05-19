# Links-360 - Plano MVP

## Conceito
Aplicativo web para centralizar e gerenciar links do Autodesk Viewer, com interface limpa e responsiva.

## Stack Tecnológica
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Banco de Dados**: SQLite (simples, sem setup complexo)
- **Estilização**: CSS Modules ou Tailwind CSS
- **Ícones**: Lucide React

## Arquitetura
```
/links-360
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── styles/
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── database/
│   └── package.json
└── package.json       # Root workspace
```

## Funcionalidades MVP

### 🔐 Acesso Admin (protegido)
- Login com Google OAuth
- Dashboard com todos os links
- Cards showing: nome, thumbnail, data expiração, status
- Botão para abrir link no Autodesk
- Botão para estender expiração (abre site original)
- Indicadores visuais: verde (ok), amarelo (expira em breve), vermelho (expirado)
- Formulário para adicionar novos links (nome + URL)
- Status badges: Ativo, Expiring Soon, Expired

### 👁️ Acesso Público (visualização)
- Grid responsivo de cards com os links
- Filtro por status
- Busca por nome
- Cards clicáveis abrem o Autodesk Viewer
- Contador regressivo de expiração

### 🔔 Alertas
- Badge no card quando expira em ≤7 dias
- Possível notificação por email (futuro)

## Modelo de Dados

### Link
```typescript
interface Link {
  id: string;
  nome: string;
  url: string;           // URL curta Autodesk (autode.sk/...)
  urlCompleta?: string;  // URL completa do viewer
  dataExpiracao: Date;
  dataCriacao: Date;
  ultimaAtualizacao: Date;
  status: 'active' | 'expiring' | 'expired';
}
```

## API Endpoints

### Público
- `GET /api/links` - Lista todos os links ativos
- `GET /api/links/:id` - Detalhes de um link

### Admin (requer autenticação)
- `POST /api/links` - Adicionar novo link
- `PUT /api/links/:id` - Atualizar link (nome, URL, expiração)
- `DELETE /api/links/:id` - Remover link
- `GET /api/links/all` - Lista completa incluindo expirados (admin)

## Fluxo de Extensão de Link
1. Admin clica em "Estender" no card
2. App copia URL completa do Autodesk
3. Abre nova aba com a URL do viewer
4. Admin faz login manual e estende
5. Volta ao app e atualiza a data de expiração manualmente

## Design
- Cores: baseadas no brand da Seazone (tons de azul)
- Cards com thumbnail preview (OpenGraph/favicon do Autodesk)
- Status badges coloridos
- Layout em grid responsivo (1-3 colunas)
- Responsivo mobile-first

## Próximas Versões
- Notificações por email quando link expira
- Integração direta com API do Autodesk (se disponível)
- Métricas de visualização
- Importação em lote de links