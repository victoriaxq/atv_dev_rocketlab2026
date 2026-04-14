from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import avaliacao_pedido, consumidor, item_pedido, produto, pedido, consumidor, vendedor

app = FastAPI(
    title="Sistema de Compras Online",
    description="API para gerenciamento de pedidos, produtos, consumidores e vendedores.",
    version="1.0.0",
)

app.include_router(avaliacao_pedido.router)
app.include_router(item_pedido.router)
app.include_router(produto.router)
app.include_router(pedido.router)
app.include_router(consumidor.router)
app.include_router(vendedor.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando com sucesso!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # porta padrão do Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
