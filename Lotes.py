from flask import Flask, request, jsonify
from sqlalchemy import and_,text
from conn import Lotes,Session
import math

app = Flask(__name__, template_folder='templates')

def search_lotes(Cod_lote, Centro, Activo, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina

    query = session.query(Lotes).filter(
        and_(
            (Lotes.Cod_lote == Cod_lote) if Cod_lote else True,
            Lotes.Centro.contains(Centro) if Centro else True,
            Lotes.Activo == Activo
        )
    )
    print(query)
    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(Lotes.Cod_lote).offset(primeiro_registro).limit(registros_por_pagina).all()

    session.close()

    return results, num_paginas

@app.route('/search_lotes')
def search_lotes_route():
    data = request.get_json()
    Cod_lote = data.get('Cod_lote')
    Centro = data.get('Centro')
    Activo = True
    
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_lotes(Cod_lote, Centro, Activo, page)
    try:
        dict_results = []
        for row in results:
            dict_results.append({
            'Centro': row.Centro,
            'Cod_lote' : row.Cod_lote,
            'Fecha_inicio': row.Fecha_inicio,
            'Fecha_fin': row.Fecha_fin,
            'Descripcion': row.Descripcion,
            'ServicioCanario': row.ServicioCanario,
            'ServicioCompañia': row.ServicioCompañia,
            'Id_lote': row.Id_lote
        })
        
        return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})
    
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': ''}), 500

@app.route('/insert_lote', methods=['POST'])
def insert_lotes_route():
    data = request.get_json()
    Centro = data['Centro']
    Cod_lote = data['Cod_lote']
    Fecha_inicio = data['Fecha_inicio']
    Fecha_fin = data['Fecha_fin']
    Descripcion = data['Descripcion']
    ServicioCanario = data['ServicioCanario']
    ServicioCompañia = data['ServicioCompañia']
    Id_lote = data['Id_lote']
    Activo = 1

    try:
        session = Session()
        new_lote = Lotes(Centro, Cod_lote, Fecha_inicio, Fecha_fin, Descripcion, ServicioCanario, ServicioCompañia,Activo , Id_lote)
        session.add(new_lote)
        session.commit()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/update_lotes', methods=['POST'])
def update_lotes_route():
    data = request.get_json()

    newCentro = data['newCentro']
    newCod_lote = data['newCod_lote']
    newFecha_inicio = data['newFecha_inicio']
    newFecha_fin = data['newFecha_fin']
    newDescripcion = data['newDescripcion']
    newServicioCanario = data['newServicioCanario']
    newServicioCompañia = data['newServicioCompañia']
    newId_lote = data['newId_lote']

    oldCentro = data['oldCentro']
    oldCod_lote = data['oldCod_lote']
    oldFecha_inicio = data['oldFecha_inicio']
    oldFecha_fin = data['oldFecha_fin']
    oldDescripcion = data['oldDescripcion']
    oldServicioCanario = data['oldServicioCanario']
    oldServicioCompañia = data['oldServicioCompañia']
    oldId_lote = data['oldId_lote']
    
    Activo = 1
    try:
        session = Session()
        lote = session.query(Lotes).filter(
            and_(
                Lotes.Centro == oldCentro,
                Lotes.Cod_lote == oldCod_lote,
                Lotes.Fecha_inicio == oldFecha_inicio,
                Lotes.Fecha_fin == oldFecha_fin,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                Lotes.ServicioCanario == oldServicioCanario,
                Lotes.ServicioCompañia == oldServicioCompañia,
                Lotes.Id_lote == oldId_lote
            )
        ).first()

        print (lote)

        if lote:
            lote.Centro = newCentro
            lote.Cod_lote = newCod_lote
            lote.Fecha_inicio = newFecha_inicio
            lote.Fecha_fin = newFecha_fin
            lote.Descripcion = newDescripcion
            lote.ServicioCanario = newServicioCanario
            lote.ServicioCompañia = newServicioCompañia
            lote.Id_lote = newId_lote
            lote.Activo = Activo

            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Lote not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        session.close()

@app.route('/delete_lote', methods=['POST'])
def delete_lotes_route():
    data = request.get_json()
    delCentro = data['delCentro']
    delCod_lote = data['delCod_lote']
    delFecha_inicio = data['delFecha_inicio']
    delFecha_fin = data['delFecha_fin']
    delDescripcion = data['delDescripcion']
    delServicioCanario = data['delServicioCanario']
    delServicioCompañia = data['delServicioCompañia']
    delId_lote = data['delId_lote']
    Activo = 1

    try:
        session = Session()

        # Utiliza la clase Lote en lugar de la variable local
        lote = session.query(Lotes).filter(
            and_(
                Lotes.Centro == delCentro,
                Lotes.Cod_lote == delCod_lote,
                Lotes.Fecha_inicio == delFecha_inicio,
                Lotes.Fecha_fin == delFecha_fin,
                text("convert(varchar, Descripcion) = :desc").params(desc=delDescripcion),
                Lotes.ServicioCanario == delServicioCanario,
                Lotes.ServicioCompañia == delServicioCompañia,
                Lotes.Id_lote == delId_lote,
                Lotes.Activo == Activo
            )
        ).first()

        if lote:
            session.delete(lote)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200
        else:
            session.close()
            return jsonify({'success': False, 'error': 'Lote not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500