from pydantic import BaseModel, ConfigDict

class VendedorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_vendedor: str
    nome_vendedor: str
    prefixo_cep: str
    cidade: str
    estado: str