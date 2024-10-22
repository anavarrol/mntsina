from flask import Flask, request, jsonify
from sqlalchemy import and_,text
from conn import Contrato,Session
from SP.PROC_GET_NAV_COLLECTIVES import PROC_GET_NAV_COLLECTIVES
import math

app = Flask(__name__, template_folder='templates')


def search_contrato(IdContrato, Descripcion, Activo, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina
    # llama al PA antes de ejecutar la consulta
    PROC_GET_NAV_COLLECTIVES().execute()

    query = session.query(Contrato).filter(
        and_(
            (Contrato.IdContrato == IdContrato) if IdContrato else True,
            Contrato.Descripcion.contains(Descripcion) if Descripcion else True,
            Contrato.Activo == Activo
        )
    )
    print(query)
    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(Contrato.IdGarante).offset(primeiro_registro).limit(registros_por_pagina).all()

    session.close()

    return results, num_paginas

@app.route('/search_contrato')
def search_contrato_route():
    data = request.get_json()
    IdContrato = data.get('IdContrato')
    Descripcion = data.get('Descripcion')
    Activo =True
    
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_contrato(IdContrato, Descripcion, Activo, page)
    try:
        dict_results = []
        for row in results:
            dict_results.append({
            'IdContrato': row.IdContrato,
            'Descripcion': row.Descripcion,
            'IdGarante' : row.IdGarante,
            'IdCatalogo': row.IdCatalogo,
            'Observaciones': row.Obervaciones,
            'TipoContrato': row.TipoCoontrato,
            'Cent_LPA': row.Cent_LPA,
            'Cent_TFE': row.Cent_TFE
        })

        return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': ''}), 500

@app.route('/insert_contrato', methods=['POST'])
def insert_contrato_route():
    data = request.get_json()
    IdContrato = data['IdContrato']
    Descripcion = data['Descripcion']
    IdGarante = data['IdGarante']
    IdCatalogo = data['IdCatalogo']
    Observaciones = data['Observaciones']
    TipoContrato = data['TipoContrato']
    Centro_LPA = data['Centro_LPA']
    Centro_TNF = data['Centro_TNF']
    Activo = 1

    try:
        session = Session()
        new_contrato = Contrato(IdContrato,Descripcion,IdGarante, IdCatalogo, Observaciones, Activo, TipoContrato, Centro_LPA, Centro_TNF)
        session.add(new_contrato)
        session.commit()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/update_contrato', methods=['POST'])
def update_contrato_route():
    data = request.get_json()
    newIdContrato = data['newIdContrato']
    newDescripcion = data['newDescripcion']
    newIdGarante = data['newIdGarante']
    newIdCatalogo = data['newIdCatalogo']
    newObservaciones = data['newObservaciones']
    newTipoContrato = data['newTipoContrato']
    newCentro_LPA = data['newCentro_LPA']
    newCentro_TNF = data['newCentro_TNF']

    oldIdContrato = data['oldIdContrato']
    oldDescripcion = data['oldDescripcion']
    oldIdGarante = data['oldIdGarante']
    oldIdCatalogo = data['oldIdCatalogo']
    oldObservaciones = data['oldObservaciones']
    oldTipoContrato = data['oldTipoContrato']
    oldCentro_LPA = data['oldCentro_LPA']
    oldCentro_TNF = data['oldCentro_TNF']
    
    Activo = 1
    try:
        session = Session()
        contrato = session.query(Contrato).filter(
            and_(
                Contrato.IdContrato == oldIdContrato,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                Contrato.IdGarante == oldIdGarante,
                Contrato.IdCatalogo == oldIdCatalogo,
                Contrato.Observaciones == oldObservaciones,
                Contrato.TipoContrato == oldTipoContrato,
                Contrato.CENT_LPA == oldCentro_LPA,
                Contrato.CENT_TFE == oldCentro_TNF
            )
        ).first()

        print (contrato)

        if contrato:
            contrato.IdContrato = newIdContrato
            contrato.Descripcion = newDescripcion
            contrato.IdGarante = newIdGarante
            contrato.IdCatalogo = newIdCatalogo
            contrato.Observaciones = newObservaciones
            contrato.TipoContrato = newTipoContrato
            contrato.CENT_LPA = newCentro_LPA
            contrato.CENT_TFE =newCentro_TNF
            contrato.Activo = Activo

            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Contrato not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        session.close()

@app.route('/delete_contrato', methods=['POST'])
def delete_contrato_route():
    data = request.get_json()
    delIdContrato = data['delIdContrato']
    delDescripcion = data['delDescripcion']
    delIdGarante = data['delIdGarante']
    delIdCatalogo = data['delIdCatalogo']
    delObservaciones = data['delObservaciones']
    delTipoContrato = data['delTipoContrato']
    delCentro_LPA = data['delCentro_LPA']
    delCentro_TNF = data['delCentro_TNF']
    Activo = 1

    try:
        session = Session()

        # Utiliza la clase Contrato en lugar de la variable local
        contrato = session.query(Contrato).filter(
            and_(
                Contrato.IdContrato == delIdContrato,
                text("convert(varchar, Descripcion) = :desc").params(desc=delDescripcion),
                Contrato.IdGarante == delIdGarante,
                Contrato.IdCatalogo == delIdCatalogo,
                Contrato.Observaciones == delObservaciones,
                Contrato.TipoContrato == delTipoContrato,
                Contrato.CENT_LPA == delCentro_LPA,
                Contrato.CENT_TFE == delCentro_TNF,
                Contrato.Activo == Activo
            )
        ).first()

        if contrato:
            session.delete(contrato)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200
        else:
            session.close()
            return jsonify({'success': False, 'error': 'Contrato not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

