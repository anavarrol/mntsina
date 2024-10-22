import os
import json
from typing import Any
from sqlalchemy import ForeignKey, create_engine, Column, Integer, String, ForeignKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,relationship, column_property
from app import app


config_dir = os.path.join(app.root_path, 'config')


def load_config():
    with open(os.path.join(config_dir, 'config.json')) as f:
        return json.load(f)


config = load_config()

# Configurar o engine do SQLAlchemy
db_url = f"mssql+pyodbc://{config['username']}:{config['password']}@{config['server']}/{config['database']}?driver=SQL+Server"
engine = create_engine(db_url)

# Configurar a ORM e a classe base
Base = declarative_base()
Session = sessionmaker(bind=engine)


class Familia(Base):
    __tablename__ = 'Familia'

    IdFamilia = Column(String, primary_key=True)
    Descripcion = Column(String)
    Servicio = Column(String)
    CodTipo = Column(Integer, primary_key=True)
    Activo = Column(String)

    def __init__(self, IdFamilia, Descripcion, Servicio, CodTipo,Activo):
        self.IdFamilia = IdFamilia
        self.Descripcion = Descripcion
        self.Servicio = Servicio
        self.CodTipo = CodTipo
        self.Activo = Activo



class SubFamilia(Base):
    __tablename__ = 'SubFamilia'

    IdSubFamilia = Column(String,primary_key = True)
    Descripcion = Column(String)
    IdFamilia = Column(String,ForeignKey("Familia.IdFamilia"))
    Servicio = Column(String)
    Activo = Column(String)

    def __init__(self, IdSubFamilia, Descripcion, IdFamilia,Servicio,Activo):
        self.IdSubFamilia = IdSubFamilia
        self.Descripcion = Descripcion
        self.IdFamilia = IdFamilia
        self.Servicio = Servicio
        self.Activo = Activo
    prestaciones = relationship("Prestacion", back_populates="idsubfamilia")


class TipoPrestacion(Base):
    __tablename__ = 'TipoPrestacion'

    Codigo = Column(String,primary_key = True)
    Descripcion = Column(String)


    def __init__(self, Codigo, Descripcion):
        self.Codigo = Codigo
        self.Descripcion = Descripcion
       
class Prestacion(Base):
    __tablename__ = 'Prestacion'
    IdCatalogo = Column(String,primary_key = True)
    IdPrestacion = Column(String, primary_key=True)
    IdFamilia = Column(String)
    Activo = Column(Integer)
    Descripcion = Column(String)
    UnidadMedida = Column(String)
    Duracion = Column(Integer)
    IdSubFamilia = Column(String, ForeignKey('SubFamilia.IdSubFamilia'))
    idsubfamilia = relationship("SubFamilia", back_populates="prestaciones")
    

    def __init__(self, IdCatalogo, IdPrestacion, IdFamilia, IdSubFamilia, Activo, Descripcion, UnidadMedida, Duracion):
        self.IdCatalogo = IdCatalogo
        self.IdPrestacion = IdPrestacion
        self.IdFamilia = IdFamilia
        self.IdSubFamilia = IdSubFamilia
        self.Activo = Activo
        self.Descripcion = Descripcion
        self.UnidadMedida = UnidadMedida
        self.Duracion = Duracion
       


class Catalago(Base):
    __tablename__ = 'Catalogo'
    IdCatalogo = Column(String, primary_key=True)
    Descripcion = Column(String)

class OrigenPrestacion(Base):
    __tablename__ = 'OrigenPrestacion'
    CodCentro = Column(String, primary_key = True)
    IdAmbito = Column(String,ForeignKey ('Ambito.IdAmbito'))
    IdServicio = Column(String,ForeignKey ('Servicio.IdServicio'), primary_key = True)
    IdCatalogo = Column(String,ForeignKey ('Prestacion.IdCatalogo'))
    IdPrestacion = Column(String,ForeignKey('Prestacion.IdPrestacion'), primary_key = True)

    Activo = 1
    

    def __init__(self,CodCentro,IdAmbito,IdServicio,IdCatalogo,IdPrestacion,Activo ) :
        self.CodCentro = CodCentro
        self.IdAmbito=IdAmbito
        self.IdServicio= IdServicio
        self.IdCatalogo = IdCatalogo
        self.IdPrestacion=IdPrestacion
        self.Activo=Activo
      
class PrestacionServicio(Base):
    __tablename__ = 'PrestacionServicio'
    IdCatalogo = Column(String,primary_key =True)
    IdPrestacion = Column(String,primary_key =True)
    IdServicio = Column(String,primary_key =True)
    Agendable = Column(String,primary_key =True)
    Duracion = Column(String,primary_key =True)
    CodCentro = Column(String,primary_key =True)
    Departamental = Column(String,primary_key=True)
    Incremento = Column(String,primary_key =True)
    Decremento = Column(String,primary_key =True)
    Activo = 1
    

    def __init__(self,IdCatalogo,IdPrestacion,IdServicio,Activo,Agendable,Duracion,CodCentro,Departamental,Incremento,Decremento) :
        self.IdCatalogo = IdCatalogo
        self.IdPrestacion=IdPrestacion
        self.IdServicio= IdServicio
        self.Activo=Activo
        self.Agendable=Agendable
        self.Duracion= Duracion
        self.CodCentro= CodCentro
        self.Departamental=Departamental
        self.Incremento= Incremento
        self.Decremento= Decremento

class Servicio(Base):
    __tablename__ = 'Servicio'
    IdServicio = Column(String,primary_key=True)
    Descripcion = Column(String,primary_key = True)

    def __int__(self,IdServicio,Descripcion):
        self.IdServicio=IdServicio
        self.Descripcion=Descripcion

class Ambito(Base):
    __tablename__ = 'Ambito'
    IdAmbito = Column(String,primary_key=True)
    Descripcion = Column(String,primary_key = True)

    def __int__(self,IdAmbito,Descripcion):
        self.IdAmbito=IdAmbito
        self.Descripcion=Descripcion

class Garante(Base):
    __tablename__ = 'Garante'
    IdGarante = Column("Id.Garante", String, primary_key=True)
    Descripcion = Column(String)
    NIFCIF = Column(String)
    Activo = Column(String)

    #alias para Id.Garante 
    #IdGarante_alias = column_property(IdGarante)

    def __init__(self, IdGarante, Descripcion, NIFCIF, Activo):
        self.IdGarante = IdGarante
        self.Descripcion = Descripcion
        self.NIFCIF = NIFCIF
        self.Activo = Activo

class Contrato(Base):
    __tablename__ = 'Contrato'
    IdContrato = Column(String, primary_key=True)
    Descripcion = Column(String)
    IdGarante = Column("No.garante",String,ForeignKey('Garante.Id.Garante'))
    #IdGarante = Column("No.garante",String)
    IdCatalogo = Column(String,ForeignKey('Catalogo.IdCatalogo'))
    Observaciones = Column(String)
    Activo = Column(String, default = 1)
    TipoContrato = Column(String)
    Cent_LPA = Column(String)
    Cent_TFE = Column(String)

    #Establece relacion con Garante y un alias para Id.Garante

    #garante = relationship("Garante", backref="Contrato")
    #garante = relationship("Garante", backref="Contrato", foreign_keys=[IdGarante])
    #garante = relationship("Garante", primaryjoin="Contrato.IdGarante == Garante.IdGarante", backref="Contrato")

    #__table_args__ = (
    #    ForeignKeyConstraint(['No.garante'], ['Garante."Id.Garante"']),
    #)

    def __init__(self, IdContrato, Descripcion, IdGarante, IdCatalogo, Observaciones, Activo, TipoContrato, Cent_LPA, Cent_TFE):
        self.IdContrato = IdContrato
        self.Descripcion = Descripcion
        self.IdGarante = IdGarante
        self.IdCatalogo = IdCatalogo
        self.Observaciones = Observaciones
        self.Activo = Activo
        self.TipoContrato = TipoContrato
        self.Cent_LPA = Cent_LPA
        self.Cent_TFE = Cent_TFE

class Lotes(Base):
    __tablename__ = 'lotes'
    Centro = Column(String, primary_key = True)
    Cod_lote = Column(String, primary_key = True)
    Fecha_inicio = Column(String)
    Fecha_fin = Column(String, primary_key = True)
    Descripcion = Column(String)
    ServicioCanario = Column(String)
    ServicioCompañia = Column(String)
    Activo = Column(String)
    Id_lote= Column(String, primary_key = True)
    
    def __init__(self, Centro, Cod_lote, Fecha_inicio, Fecha_fin, Descripcion, ServicioCanario, ServicioCompañia, Activo, Id_lote):
        self.Centro = Centro
        self.Cod_lote = Cod_lote
        self.Fecha_inicio = Fecha_inicio
        self.Fecha_fin = Fecha_fin
        self.Descripcion = Descripcion
        self.ServicioCanario = ServicioCanario
        self.ServicioCompañia = ServicioCompañia
        self.Activo = Activo
        self.Id_lote = Id_lote