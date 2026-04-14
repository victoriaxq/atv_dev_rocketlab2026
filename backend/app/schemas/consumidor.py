from pydantic import BaseModel, ConfigDict

class ConsumidorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_consumidor: str
    nome_consumidor: str
    prefixo_cep: str
    cidade: str
    estado: str