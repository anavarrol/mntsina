from flask import Flask, request, jsonify
import math
from sqlalchemy import and_,text
from conn import TipoPrestacion,Session

app = Flask(__name__, template_folder='templates')


def search_tipoprestacion(Codigo, Descripcion, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina

    query = session.query(TipoPrestacion).filter(
        and_(
            (TipoPrestacion.Codigo == Codigo) if Codigo else True,
            TipoPrestacion.Descripcion.contains(Descripcion) if Descripcion else True
        )
    )

    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(TipoPrestacion.Codigo).offset(primeiro_registro).limit(registros_por_pagina).all()
    session.close()

    return results, num_paginas


@app.route('/search_tipoprestacion')
def search_tipoprestacion_route():
    data = request.get_json()
    Codigo = data.get('Codigo')
    Descripcion = data.get('Descripcion')
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_tipoprestacion(Codigo, Descripcion, page)

    dict_results = []
    for row in results:
        dict_results.append({
            'Codigo': row.Codigo,
            'Descripcion': row.Descripcion
        })

    return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})


@app.route('/insert_tipoprestacion', methods=['POST'])
def insert_tipoprestacion():
    data = request.get_json()
    Codigo = data['Codigo']
    Descripcion = data['Descripcion']
 

    try:
        session = Session()
        new_tipoprestacion = TipoPrestacion(Codigo, Descripcion)
        session.add(new_tipoprestacion)
        session.commit()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update_tipoprestacion', methods=['POST'])
def update_tipoprestacion():
    data = request.get_json()
    newCodigo = data['newCodigo']
    newDescripcion = data['newDescripcion']
    
    oldCodigo = data['oldCodigo']
    oldDescripcion = data['oldDescripcion']
    try:
        session = Session()
        prestacion = session.query(TipoPrestacion).filter(
            and_(
                TipoPrestacion.Codigo == oldCodigo,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                
            )
        ).first()

        if prestacion:
            prestacion.Codigo = newCodigo
            prestacion.Descripcion = newDescripcion
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/delete_tipoprestacion', methods=['POST'])
def delete_tipoprestacion():
    data = request.get_json()
    delCodigo = data['delCodigo']
    delDescripcion = data['delDescripcion']


    try:
        session = Session()
        prestacion = session.query(TipoPrestacion).filter(
            and_(
                TipoPrestacion.Codigo == delCodigo,
                text("convert(varchar, Descripcion) = :desc").params(desc=delDescripcion), TipoPrestacion.Codigo == delCodigo,
                
            )
        ).first()

        if prestacion:
            session.delete(prestacion)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
