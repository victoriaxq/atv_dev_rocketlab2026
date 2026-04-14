# Sistema de Compras Online

Sistema fullstack de gerenciamento de compras online com backend em **FastAPI** e frontend em **Vite + React + TypeScript**.

## Estrutura do Projeto

```
.
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── models/          # Modelos SQLAlchemy
│   │   ├── routers/         # Rotas da API
│   │   ├── schemas/         # Schemas Pydantic
│   │   ├── config.py        # Configurações
│   │   ├── database.py      # Conexão com banco
│   │   └── main.py          # Entrada da aplicação
│   ├── alembic/             # Migrações do banco
│   ├── requirements.txt     # Dependências Python
│   └── seed.py              # Script para popular o banco
├── frontend/
│   └── sistema-compras/     # App React + Vite
│       ├── src/
│       │   ├── components/  # Componentes React
│       │   ├── pages/       # Páginas da aplicação
│       │   ├── api/         # Clients da API
│       │   └── types/       # Tipos TypeScript
│       └── package.json
└── data/                    # CSVs para seed do banco
```

## Pre-requisitos

- **Python** 3.10+
- **Node.js** 18+
- **pnpm** (gerenciador de pacotes)

### Instalando o pnpm

```bash
npm install -g pnpm
```

---

## Backend (FastAPI)

### 1. Acessar a pasta do backend

```bash
cd backend
```

### 2. Criar ambiente virtual

```bash
python -m venv venv
```

### 3. Ativar o ambiente virtual

**Linux/macOS:**
```bash
source venv/bin/activate
```

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Configurar variaveis de ambiente (opcional)

Crie um arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL=sqlite:///./database.db
```

> Por padrao, o sistema usa SQLite. Para usar PostgreSQL ou outro banco, altere a `DATABASE_URL`.

### 6. Executar as migracoes do banco

```bash
alembic upgrade head
```

### 7. Popular o banco com dados iniciais (opcional)

```bash
python seed.py
```

### 8. Iniciar o servidor

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

O backend estara disponivel em: **http://localhost:8000**

### Documentacao da API

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## Frontend (Vite + React)

### 1. Acessar a pasta do frontend

```bash
cd frontend/sistema-compras
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

O frontend estara disponivel em: **http://localhost:5173**

### Build para producao

```bash
pnpm build
```

### Visualizar build de producao

```bash
pnpm preview
```

---

## Executando Backend e Frontend Simultaneamente

Abra dois terminais separados:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # ou o comando equivalente no Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/sistema-compras
pnpm dev
```

---

## Endpoints da API

| Recurso           | Metodo | Endpoint                    |
|-------------------|--------|-----------------------------|
| Health Check      | GET    | `/`                         |
| Produtos          | CRUD   | `/produtos/`                |
| Consumidores      | CRUD   | `/consumidores/`            |
| Vendedores        | CRUD   | `/vendedores/`              |
| Pedidos           | CRUD   | `/pedidos/`                 |
| Itens do Pedido   | CRUD   | `/itens-pedido/`            |
| Avaliacoes        | CRUD   | `/avaliacoes-pedido/`       |

---

## Scripts Uteis

### Backend

| Comando                          | Descricao                        |
|----------------------------------|----------------------------------|
| `alembic upgrade head`           | Aplica migracoes                 |
| `alembic revision --autogenerate`| Gera nova migracao automatica    |
| `python seed.py`                 | Popula banco com dados de teste  |
| `pytest`                         | Executa testes                   |

### Frontend

| Comando         | Descricao                          |
|-----------------|------------------------------------|
| `pnpm dev`      | Inicia servidor de desenvolvimento |
| `pnpm build`    | Gera build de producao             |
| `pnpm preview`  | Visualiza build de producao        |
| `pnpm lint`     | Executa linter (ESLint)            |

---

## Tecnologias Utilizadas

### Backend
- FastAPI
- SQLAlchemy
- Alembic (migracoes)
- Pydantic
- Uvicorn

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Radix UI
- Lucide Icons

---

## Licenca

Este projeto foi desenvolvido para fins educacionais.
