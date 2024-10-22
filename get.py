from flask import Flask, request, jsonify
from sqlalchemy import and_,text
from conn import Catalago,Session,Prestacion,Servicio,Familia,SubFamilia,Ambito,TipoPrestacion, Garante
import logging

app = Flask(__name__, template_folder='templates')

logging.basicConfig(level=logging.DEBUG, filename='app_get.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s')


@app.route("/get_prestacion", methods=["GET"])
def get_prestacion():
    session = Session()

    results = session.query(
       Prestacion.IdPrestacion.label('IdPrestacion'),
       Prestacion.Descripcion.label('Descripcion'),
    ).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'Prestacion': results_as_dicts})

@app.route("/get_catalogo", methods=["GET"])
def get_catalogo():
    session = Session()

    results = session.query(
       Catalago.IdCatalogo.label('IdCatalogo'),
       Catalago.Descripcion.label('Descripcion')
    ).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'catalogo': results_as_dicts})

@app.route("/get_servicio", methods=["GET"])
def get_servicio():
    session = Session()

    results = session.query(
       Servicio.IdServicio.label('IdServicio'),
       Servicio.Descripcion.label('Descripcion')
    ).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'Servicio': results_as_dicts})


@app.route("/get_familias", methods=["GET"])
def get_familias():
    session = Session()

    results = session.query(
        Familia.IdFamilia.label('IdFamilia'),
        Familia.Descripcion.label('Descripcion'),
        Familia.CodTipo.label('CodTipo')
    ).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'familias': results_as_dicts})

@app.route("/get_subfamilias/<id_familia>", methods=["GET"])
def get_subfamilias(id_familia):
    session = Session()

    results = session.query(
        SubFamilia.IdSubFamilia.label('IdSubFamilia'),
        SubFamilia.Descripcion.label('Descripcion'),
        SubFamilia.IdFamilia.label('IdFamilia')
    ).filter (SubFamilia.IdFamilia ==id_familia).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'subfamilias': results_as_dicts})

@app.route("/get_ambito", methods=["GET"])
def get_ambito():
    session = Session()

    results = session.query(
       Ambito.IdAmbito.label('IdAmbito'),
       Ambito.Descripcion.label('Descripcion')
    ).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'Ambito': results_as_dicts})

@app.route("/get_codtipo", methods=["GET"])
def get_codtipo():
    session = Session()

    results = session.query(
       TipoPrestacion.Codigo.label('Codigo'),
       TipoPrestacion.Descripcion.label('Descripcion')
    ).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'TipoPrestacion': results_as_dicts})

@app.route("/get_garante", methods=["GET"])
def get_garante():
    session = Session()

    results = session.query(
       Garante.IdGarante.label('IdGarante'),
       Garante.Descripcion.label('Descripcion')
    ).all()

    session.close()

    results_as_dicts = [row._asdict() for row in results]

    return jsonify({'Garante': results_as_dicts})