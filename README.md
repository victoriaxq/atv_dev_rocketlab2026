# Sistema de Gerenciamento de E-Commerce

Sistema completo para gerenciamento de produtos de e-commerce, permitindo visualizar catalogo, vendas, avaliacoes e gerenciar produtos.

## Stack Tecnologica

### Frontend
- **Vite** - Build tool rapido para desenvolvimento
- **React 19** + **TypeScript** - Framework UI com tipagem estatica
- **Tailwind CSS** - Estilizacao utilitaria
- **shadcn/ui** - Componentes de UI acessiveis
- **Axios** - Cliente HTTP para requisicoes
- **SWR** - Data fetching e caching
- **React Router** - Roteamento SPA

### Backend
- **FastAPI** (Python) - Framework web moderno e rapido
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Alembic** - Migracoes de banco de dados

## Como Executar

### 1. Backend

```bash
# Navegue para o diretorio do backend
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependencias
pip install -r requirements.txt

# Execute as migracoes
alembic upgrade head

# Popule o banco com dados de exemplo
python seed.py

# Inicie o servidor
uvicorn app.main:app --reload --port 8000
```

O backend estara disponivel em `http://localhost:8000`
Documentacao da API: `http://localhost:8000/docs`

### 2. Frontend

```bash
# Navegue para o diretorio do frontend
cd frontend

# Instale as dependencias
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estara disponivel em `http://localhost:5173`

## Funcionalidades

- **Catalogo de Produtos**: Navegue pelos produtos com busca e filtros por categoria
- **Detalhes do Produto**: Veja especificacoes, desempenho de vendas e avaliacoes
- **Gerenciamento de Produtos**: Adicione, edite e remova produtos
- **Metricas de Vendas**: Visualize receita total, total de vendas e media de avaliacoes
- **Avaliacoes de Clientes**: Veja todas as avaliacoes com notas e comentarios

## Estrutura do Projeto

```
├── backend/
│   ├── app/
│   │   ├── models/        # Modelos SQLAlchemy
│   │   ├── routers/       # Endpoints da API
│   │   ├── schemas/       # Schemas Pydantic
│   │   ├── database.py    # Configuracao do banco
│   │   └── main.py        # Aplicacao FastAPI
│   ├── alembic/           # Migracoes do banco
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Cliente API e tipos
│   │   ├── components/    # Componentes React
│   │   │   └── ui/        # Componentes shadcn/ui
│   │   ├── lib/           # Utilitarios
│   │   ├── pages/         # Paginas da aplicacao
│   │   └── types/         # Tipos TypeScript
│   └── package.json
│
└── data/                  # Arquivos CSV com dados
```

## API Endpoints

### Produtos
- `GET /produto/` - Listar produtos (com busca e filtros)
- `GET /produto/categorias` - Listar categorias
- `GET /produto/{id}` - Detalhes do produto
- `POST /produto/` - Criar produto
- `PATCH /produto/{id}` - Atualizar produto
- `DELETE /produto/{id}` - Remover produto

### Avaliacoes
- `GET /avaliacao/` - Listar avaliacoes
- `GET /avaliacao/{id}` - Detalhes da avaliacao
