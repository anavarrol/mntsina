import pyodbc
from flask import Flask, request, jsonify

import math
from conn import SubFamilia,Session
from sqlalchemy import and_,text,String


app = Flask(__name__, template_folder='templates')


# Função que executa a consulta SQL e retorna os resultados
def search_subfamilia(IdSubFamilia, Descripcion, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina

    query = session.query(SubFamilia).filter(
        and_(
            (SubFamilia.IdSubFamilia == IdSubFamilia) if IdSubFamilia else True,
            SubFamilia.Descripcion.contains(Descripcion) if Descripcion else True
        )
    )

    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)
    results = query.order_by(SubFamilia.IdSubFamilia).offset(primeiro_registro).limit(registros_por_pagina).all()
    print(query)
    session.close()

    return results, num_paginas

@app.route('/search_subfamilia')
def search_subfamilia_route():
    # Obtém os parâmetros de busca do corpo da solicitação
    data = request.get_json()
    IdSubFamilia = data.get('IdSubFamilia')
    Descripcion = data.get('Descripcion')
    page = int(request.args.get('page', '1'))
    
    # Executa a consulta SQL e retorna os resultados em formato de dicionário
    results, num_paginas = search_subfamilia(IdSubFamilia, Descripcion, page)
    
    # Construye manualmente el diccionario 
    dict_results = [
        {
            'IdSubFamilia': row.IdSubFamilia,
            'Descripcion': row.Descripcion,
            'IdFamilia': row.IdFamilia,
            'Servicio': row.Servicio,
            'Activo': row.Activo
        }
        for row in results
    ]

  # Retorna os resultados como um dicionário
    return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})


@app.route('/insert_subfamilia', methods=['POST'])
def insert_subfamilia():
    data = request.get_json()
    IdSubFamilia = data['IdSubFamilia']
    Descripcion = data['Descripcion']
    IdFamilia = data['IdFamilia']
    Servicio = data['Servicio']
    Activo = 1

    try:
        session = Session()
        new_subfamilia = SubFamilia(IdSubFamilia, Descripcion, IdFamilia,Servicio,Activo)
        session.add(new_subfamilia)
        session.commit()
        session.close()

        # Retorna uma resposta de sucesso
        return jsonify({'success': True}), 200

    except pyodbc.Error as e:
        # Conexão falhou
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update_subfamilia', methods=['POST'])
def update_subfamilia():
    data = request.get_json()
    newIdSubFamilia = data['newIdSubFamilia']
    newDescripcion = data['newDescripcion']
    newIdFamilia = data['newIdFamilia']
    newServicio = data['newServicio']
    oldIdSubFamilia = data['oldIdSubFamilia']
    oldDescripcion = data['oldDescripcion']
    oldIdFamilia = data['oldIdFamilia']
    oldServicio = data['oldServicio']
    
    Activo = 1


    try:
    
        session = Session()
        Subfamilia = session.query(SubFamilia).filter(
            and_(
                SubFamilia.IdSubFamilia == oldIdSubFamilia,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                SubFamilia.IdFamilia == oldIdFamilia,
                SubFamilia.Servicio == oldServicio
               
            )
        ).first()
   

        if Subfamilia:
            Subfamilia.IdSubFamilia = newIdSubFamilia
            Subfamilia.Descripcion = newDescripcion
            Subfamilia.IdFamilia = newIdFamilia
            Subfamilia.Servicio = newServicio
            Subfamilia.Activo = Activo 
            session.commit()
            session.close()

            return jsonify({'success': True}), 200
        else:
            return jsonify({'success': False, 'error': 'Subfamilia não encontrada'}), 404

    except pyodbc.Error as e:
        # Conexão falhou
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/delete_subfamilia', methods=['POST'])
def delete_subfamilia():
    data = request.get_json()
    delIdSubFamilia = data['delIdSubFamilia']
    delDescripcion = data['delDescripcion']
    delIdFamilia = data['delIdFamilia']
    delServicio = data['delServicio']    
    Activo = 1

    try:
        session = Session()
        Subfamilia = session.query(SubFamilia).filter(
            and_ (
                SubFamilia.IdSubFamilia == delIdSubFamilia,
                text("convert(varchar, Descripcion) = :desc").params(desc=delDescripcion), SubFamilia.IdSubFamilia == delIdSubFamilia,
                SubFamilia.Servicio == delServicio
            )
        ).first()
        if Subfamilia:
            Subfamilia.IdSubFamilia = delIdSubFamilia
            Subfamilia.Descripcion = delDescripcion
            Subfamilia.IdFamilia = delIdFamilia
            Subfamilia.Servicio = delServicio
            
            Subfamilia.Activo = Activo
            session.delete(Subfamilia)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        # Retorna uma resposta de sucesso
        return jsonify({'success': True}), 200



    except pyodbc.Error as e:
        # Conexão falhou
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
