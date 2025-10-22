# Gerenciador de Hábitos - Frontend

Sistema para registrar hábitos e marcar como concluídos.

## Tecnologias

- React 18+
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- TanStack Query
- Zustand
- Axios
- Zod
- React Hook Form

## Estrutura do Projeto

```
src/
├── domain/              # Domínios de negócio
├── core/                # Componentes e lógica compartilhada
│   ├── components/      # Componentes UI genéricos
│   ├── contexts/        # Contextos globais
│   ├── hooks/           # Hooks reutilizáveis
│   ├── lib/             # Configurações de bibliotecas
│   ├── utils/           # Funções utilitárias
│   ├── types/           # Tipos globais
│   └── constants/       # Constantes globais
├── pages/               # Páginas da aplicação
├── routes/              # Configuração de rotas
│   └── layouts/         # Layouts de rotas
└── assets/              # Recursos estáticos
    └── styles/          # Estilos globais
```

## Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Gerenciador de Hábitos
```

## Desenvolvimento

O projeto segue uma arquitetura baseada em domínios funcionais:

- **Domain**: Módulos de negócio específicos
- **Core**: Componentes e lógica compartilhada
- **Pages**: Páginas que orquestram domínios e componentes core

### Convenções de Nomenclatura

- Diretórios de domínio: `camelCase`
- Componentes: `PascalCase`
- Hooks: `camelCase` com prefixo `use`
- Arquivos de implementação: `main.tsx` ou `main.ts`
- Arquivos de tipos: `types.ts`
- Arquivos de exportação: `index.ts`

## Funcionalidades

- ✅ Estrutura base configurada
- ✅ Roteamento configurado
- ✅ Autenticação (contexto)
- ✅ Tema (contexto)
- ✅ Componentes UI base
- ⏳ Cadastro de hábitos
- ⏳ Marcação de conclusão
- ⏳ Visualização de hábitos
- ⏳ Estatísticas de progresso
- ⏳ Lembretes
- ⏳ Categorização de hábitos
- ⏳ Configurações de conta

## Licença

MIT