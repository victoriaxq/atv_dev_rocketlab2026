import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Consumidor, Produto, Vendedor, Pedido, ItemPedido, AvaliacaoPedido

def seed_database():
    db: Session = SessionLocal()
    
    # lista de mapeamento: (arquivo CSV, modelo SQLAlchemy)
    files_to_load = [
        ('dim_produtos.csv', Produto),
        ('dim_vendedores.csv', Vendedor),
        ('dim_consumidores.csv', Consumidor),
        ('fat_pedidos.csv', Pedido),
        ('fat_itens_pedidos.csv', ItemPedido),
        ('fat_avaliacoes_pedidos.csv', AvaliacaoPedido),
    ]

    try:
        for file_name, model in files_to_load:
            print(f"povoando {model.__tablename__}...")
            df = pd.read_csv(f"../data/{file_name}")
            
            # tratamento dados nulos na categoria_produto
            if file_name == 'dim_produtos.csv' and df['categoria_produto'].isnull().any():
                # print("aviso: categoria_produto tem valores nulos")
                df['categoria_produto'] = df['categoria_produto'].fillna('desconhecido')
                
            # converte textos para objetos datetime do Python
            elif file_name == "fat_pedidos.csv":
                df['pedido_compra_timestamp'] = pd.to_datetime(df['pedido_compra_timestamp'])
                df['pedido_entregue_timestamp'] = pd.to_datetime(df['pedido_entregue_timestamp'])
                df['data_estimada_entrega'] = pd.to_datetime(df['data_estimada_entrega']).dt.date

            elif file_name == "fat_avaliacoes_pedidos.csv":
                df['data_comentario'] = pd.to_datetime(df['data_comentario'])
                df['data_resposta'] = pd.to_datetime(df['data_resposta'])
                
                # tratando id's de avaliações duplicados, caso existam
                if 'id_avaliacao' in df.columns:
                    df = df.drop_duplicates(subset=['id_avaliacao'])
                
            # para compatibilidade com SQLAlchemy
            df = df.replace({np.nan: None})
            
            # converte o df para dicionários e insere no banco
            data = df.to_dict(orient='records')
            db.bulk_insert_mappings(model, data)
            db.commit()
            print(f"sucesso! {len(data)} registros inseridos em {model.__tablename__}.")

    except Exception as e:
        print(f"erro ao povoar banco: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()