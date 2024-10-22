from flask import Flask, request, jsonify
import math
from sqlalchemy import and_,text


from conn import Familia,Session

app = Flask(__name__, template_folder='templates')


def search_familia(IdFamilia, Descripcion,CodTipo, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina
    

    query = session.query(Familia).filter(
        and_(
            (Familia.IdFamilia == IdFamilia) if IdFamilia else True,
            Familia.Descripcion.contains(Descripcion) if Descripcion else True,
            Familia.CodTipo.contains(CodTipo) if CodTipo else True,
            Familia.Activo == 1
        )
    )
   # print(query.statement)
    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(Familia.IdFamilia).offset(primeiro_registro).limit(registros_por_pagina).all()
 
    session.close()
    
    return results, num_paginas


@app.route('/search_familia')
def search_familia_route():
    data = request.get_json()
    IdFamilia = data.get('IdFamilia')
    Descripcion = data.get('Descripcion')
    CodTipo =""
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_familia(IdFamilia, Descripcion,CodTipo, page)

    dict_results = []
    for row in results:
        dict_results.append({
            'IdFamilia': row.IdFamilia,
            'Descripcion': row.Descripcion,
            'Servicio': row.Servicio,
            'CodTipo': row.CodTipo
        })

    return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})


@app.route('/insert_familia', methods=['POST'])
def insert_familia():
    data = request.get_json()
    IdFamilia = data['IdFamilia']
    Descripcion = data['Descripcion']
    Servicio = data['Servicio']
    CodTipo = data['CodTipo']
    Activo = 1
    try:
        session = Session()
        new_familia = Familia(IdFamilia, Descripcion, Servicio,Activo, CodTipo)
        session.add(new_familia)
        session.commit()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update_familia', methods=['POST'])
def update_familia():
    data = request.get_json()
    newIdFamilia = data['newIdFamilia']
    newDescripcion = data['newDescripcion']
    newServicio = data['newServicio']
    newCodTipo = data['newCodTipo']

    oldIdFamilia = data['oldIdFamilia']
    oldDescripcion = data['oldDescripcion']
    oldServicio = data['oldServicio']
    oldCodTipo = data['oldCodTipo']
    Activo = 1
    
    try:
        session = Session()
        familia = session.query(Familia).filter(
            and_(
                Familia.IdFamilia == oldIdFamilia,
                #text("convert(varchar, IdFamilia) = :desc").params(desc=oldIdFamilia),
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                #Familia.Descripcion == oldDescripcion,
                Familia.Servicio == oldServicio,
                Familia.CodTipo == oldCodTipo
            
            )

        ).first()
       
        if familia:
            familia.IdFamilia = newIdFamilia
            familia.Descripcion = newDescripcion
            familia.Servicio = newServicio
            familia.CodTipo = newCodTipo
            familia.Activo = Activo
            session.commit()
            #session.close()
          
            return jsonify({'success': True}), 200

        else:
            
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        session.close()

@app.route('/delete_familia', methods=['POST'])
def delete_familia():
    data = request.get_json()
    
    delIdFamilia = data['delIdFamilia']
    delDescripcion = data['delDescripcion']
    delServicio = data['delServicio']
    delCodTipo = data['delCodTipo']
    Activo = 1

    try:
        session = Session()
        familia = session.query(Familia).filter(
            and_(
                Familia.IdFamilia == delIdFamilia,
                text("convert(varchar, Descripcion) = :desc").params(desc=delDescripcion), Familia.IdFamilia == delIdFamilia,
                Familia.Servicio == delServicio,
                Familia.CodTipo == delCodTipo,
                Familia.Activo == Activo
            )
        ).first()

        if familia:
            session.delete(familia)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
