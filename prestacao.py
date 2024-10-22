from flask import Flask, request, jsonify
from sqlalchemy import and_,text
from conn import Prestacion,Session
from SP.PROC_GET_NAV_BENEFITS import PROC_GET_NAV_BENEFITS
import math

app = Flask(__name__, template_folder='templates')

def search_prestacao(IdPrestacion, Descripcion, Activo, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina

    query = session.query(Prestacion).filter(
        and_(
            (Prestacion.IdPrestacion == IdPrestacion) if IdPrestacion else True,
            Prestacion.Descripcion.contains(Descripcion) if Descripcion else True,
            Prestacion.Activo == Activo
        )
    )
    print(query)
    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(Prestacion.IdPrestacion).offset(primeiro_registro).limit(registros_por_pagina).all()

    session.close()

    return results, num_paginas

@app.route('/search_prestacao')
def search_prestacao_route():
    data = request.get_json()
    IdPrestacion = data.get('idPrestacion')
    Descripcion = data.get('Descripcion')
    Activo = True
    
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_prestacao(IdPrestacion, Descripcion, Activo, page)
    try:
        dict_results = []
        for row in results:
            dict_results.append({
            'IdCatalogo': row.IdCatalogo,
            'IdPrestacion' : row.IdPrestacion,
            'IdFamilia': row.IdFamilia,
            'IdSubFamilia': row.IdSubFamilia,
            'Descripcion': row.Descripcion,
            'UnidadMedida': row.UnidadMedida,
            'Duracion': row.Duracion
        })
        
        return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})
    
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': ''}), 500

@app.route('/insert_prestacion', methods=['POST'])
def insert_prestacion():
    data = request.get_json()
    IdCatalogo = data['IdCatalogo']
    IdPrestacion = data['IdPrestacion']
    IdFamilia = data['IdFamilia']
    IdSubFamilia = data['IdSubFamilia']
    Descripcion = data['Descripcion']
    UnidadMedida = data['UnidadMedida']
    Duracion = data['Duracion']
  
    Activo = 1

    try:
        session = Session()
        new_prestacion = Prestacion(IdCatalogo, IdPrestacion, IdFamilia, IdSubFamilia,Activo,Descripcion,UnidadMedida,Duracion)
        session.add(new_prestacion)
        session.commit()
        PROC_GET_NAV_BENEFITS().execute()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update_prestacion', methods=['POST'])
def update_prestacion():
    data = request.get_json()
    newIdCatalogo = data['newIdCatalogo']
    newIdPrestacion = data['newIdPrestacion']
    newIdFamilia = data['newIdFamilia']
    newIdSubFamilia = data['newIdSubFamilia']
    newDescripcion = data['newDescripcion']
    newUnidadMedida = data['newUnidadMedida']
    newDuracion = data['newDuracion']

    oldIdCatalogo = data['oldIdCatalogo']
    oldIdPrestacion = data['oldIdPrestacion']
    oldIdFamilia = data['oldIdFamilia']
    oldIdSubFamilia = data['oldIdSubFamilia']
    oldDescripcion = data['oldDescripcion']
    oldUnidadMedida = data['oldUnidadMedida']
    oldDuracion = data['oldDuracion']
    Activo = 1
    try:
        session = Session()
        prestacion = session.query(Prestacion).filter(
            and_(
                Prestacion.IdCatalogo == oldIdCatalogo,
                Prestacion.IdPrestacion == oldIdPrestacion,
                Prestacion.IdFamilia == oldIdFamilia,
                Prestacion.IdSubFamilia == oldIdSubFamilia,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                Prestacion.UnidadMedida == oldUnidadMedida,
                Prestacion.Duracion == oldDuracion
            )
        ).first()

        if prestacion:
            prestacion.IdCatalogo = newIdCatalogo
            prestacion.IdPrestacion = newIdPrestacion
            prestacion.IdFamilia = newIdFamilia
            prestacion.IdSubFamilia = newIdSubFamilia
            prestacion.Descripcion = newDescripcion
            prestacion.UnidadMedida = newUnidadMedida
            prestacion.Duracion = newDuracion
            prestacion.Activo = Activo
            session.commit()
            PROC_GET_NAV_BENEFITS().execute()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Prestacion not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/delete_prestacion', methods=['POST'])
def delete_prestacion():
    data = request.get_json()
    delCatalogo = data['delCatalogo']
    delIdPrestacion = data['delIdPrestacion']
    delIdFamilia = data['delIdFamilia']
    delIdSubFamilia = data['delIdSubFamilia']
    delDescripcion = data['delDescripcion']
    delUnidadMedida = data['delUnidadMedida']
    delDuracion = data['delDuracion']

    try:
        session = Session()
        prestacion = session.query(Prestacion).filter(
            and_(
                Prestacion.IdCatalogo == delCatalogo, 
                Prestacion.IdPrestacion == delIdPrestacion,
                Prestacion.IdFamilia == delIdFamilia,
                Prestacion.Descripcion == delDescripcion,
                Prestacion.UnidadMedida == delUnidadMedida,
                Prestacion.Duracion == delDuracion,
                Prestacion.IdSubFamilia == delIdSubFamilia,
                Prestacion.Activo == 0
            )
        ).first()

        if prestacion:
            prestacion.Activo = 0
            session.commit()
            PROC_GET_NAV_BENEFITS().execute()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Prestacion not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
