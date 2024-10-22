from flask import Flask, request, jsonify
import math
from sqlalchemy import and_,text
import SP.PROC_GET_NAV_INSURANCES as PROC_GET_NAV_INSURANCES


from conn import Garante,Session

app = Flask(__name__, template_folder='templates')


def search_garante(IdGarante, Descripcion, Activo, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina
    

    query = session.query(Garante).filter(
        and_(
            (Garante.IdGarante == IdGarante) if IdGarante else True,
            Garante.Descripcion.contains(Descripcion) if Descripcion else True,
            Garante.Activo == Activo
        )
    )
    print(query)
    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(Garante.IdGarante).offset(primeiro_registro).limit(registros_por_pagina).all()

    session.close()

    return results, num_paginas


@app.route('/search_garante')
def search_garante_route():
    data = request.get_json()
    IdGarante = data.get('IdGarante')
    Descripcion = data.get('Descripcion')
    Activo =True
    
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_garante(IdGarante, Descripcion, Activo, page)

    dict_results = []
    for row in results:
        dict_results.append({
            'IdGarante': row.IdGarante,
            'Descripcion': row.Descripcion,
            'NIFCIF' : row.NIFCIF
          
            
        })

    return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})


@app.route('/insert_garante', methods=['POST'])
def insert_garante():
    data = request.get_json()
    IdGarante = data['IdGarante']
    Descripcion = data['Descripcion']
    NIFCIF = data['Nifcif']
    Activo = 1

    try:
        session = Session()
        new_familia = Garante(IdGarante, Descripcion, NIFCIF,Activo)
        session.add(new_familia)
        session.commit()
        session.close()
    
        try:
            sesion = Session()
            # PA
            PROC_GET_NAV_INSURANCES().execute()
            sesion.close()
            return jsonify({'success': True}), 200
        
        except Exception as e:
            print(e)
            return jsonify({'success': False, 'error': str(e)}), 500
    
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
    




@app.route('/update_garante', methods=['POST'])
def update_garante():
    data = request.get_json()
    newIdGarante = data['newIdGarante']
    newDescripcion = data['newDescripcion']
    newNifcif = data['newNIFCIF']
    oldIdGarante = data['oldIdGarante']
    oldDescripcion = data['oldDescripcion']
    oldNifcif = data['oldNIFCIF']
    Activo = 1
    try:
        session = Session()
        garante = session.query(Garante).filter(
            and_(
                Garante.IdGarante == oldIdGarante,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                text ("convert (varchar,Garante.NIFCIF) = :nif").params(nif= oldNifcif),
            )
        ).first()
        print (garante)
        if garante:
            garante.IdGarante = newIdGarante
            garante.Descripcion = newDescripcion
            garante.NIFCIF = str(newNifcif)
            garante.Activo = Activo
            session.commit()
         #   session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        session.close()
from sqlalchemy import text

# ...

@app.route('/delete_garante', methods=['POST'])
def delete_garante():
    data = request.get_json()
    delIdGarante = data['delIdGarante']
    delDescripcion = data['delDescripcion']
    delNifCif = data['delNifCif']
    Activo = 1

    try:
        session = Session()

        # Utiliza la clase Garante en lugar de la variable local garante
        garante = session.query(Garante).filter(
            and_(
                Garante.IdGarante == delIdGarante,
                text("convert(varchar, Descripcion) = :desc").params(desc=delDescripcion),
                text("convert(varchar, Garante.NIFCIF) = :nif").params(nif=delNifCif),
                Garante.Activo == Activo
            )
        ).first()

        if garante:
            session.delete(garante)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200
        else:
            session.close()
            return jsonify({'success': False, 'error': 'Garante not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

