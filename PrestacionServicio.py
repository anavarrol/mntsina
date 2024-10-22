from flask import Flask, request, jsonify
import math
from sqlalchemy import and_
from conn import PrestacionServicio,Session
from SP.PROC_SET_PROCEDURES_BENEFITS import PROC_SET_PROCEDURES_BENEFITS
import logging

app = Flask(__name__, template_folder='templates')

logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s')



def search_prestacionservicio(IdPrestacion, CodCentro, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina


    query = session.query(PrestacionServicio).filter(
        and_(
            (PrestacionServicio.IdPrestacion == IdPrestacion) if IdPrestacion else True,
            PrestacionServicio.CodCentro.contains(CodCentro) if CodCentro else True
        )
    )

    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(PrestacionServicio.IdPrestacion).offset(primeiro_registro).limit(registros_por_pagina).all()
    session.close()

    #print('*** Debug: Results:', results)  # Adicione esta linha para imprimir os resultados no terminal

    return results, num_paginas



@app.route('/search_prestacionservicio')
def search_prestacionservicio_route():
    data = request.get_json()
    IdPrestacion = data.get('idPrestacion')
    CodCentro = data.get('CodCentro')
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_prestacionservicio(IdPrestacion, CodCentro, page)

    dict_results = []
    for row in results:
        dict_results.append({
            'idCatalogo': row.IdCatalogo,
            'idPrestacion': row.IdPrestacion,
            'idServicio': row.IdServicio,
            'Agendable': row.Agendable,
            'Duracion': row.Duracion,
            'CodCentro': row.CodCentro,
            'Departamental' : row.Departamental,
            'Incremento': row.Incremento,
            'Decremento': row.Decremento,


        })

    #print('*** Debug: Dict Results:', dict_results)  # Adicione esta linha para imprimir os resultados no terminal

    return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})




@app.route('/insert_prestacionservicio', methods=['POST'])
def insert_prestacionservicio():
    data = request.get_json()
    IdCatalogo = data['Catalogo']
    IdPrestacion = data['Prestacion']
    IdServicio = data['IdServicio']
    Duracion = data['Duracion']
    CodCentro = data['CodCentro']
    Departamental = data['Departamental']
    Incremento = data['Incremento']
    Decremento = data['Decremento']
 

    try:
        session = Session()
        new_prestacionservicio = PrestacionServicio(IdCatalogo,IdPrestacion, IdServicio,1,0,Duracion,CodCentro,Departamental,Incremento,Decremento)
        session.add(new_prestacionservicio)
        logging.info (f'new_prestacionservicio: {new_prestacionservicio.__dict__}')
        session.commit()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        logging.info (e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/update_prestacionservicio', methods=['POST'])
def update_prestacionservicio():
    data = request.get_json()
    newIdCatalogo = data['newIdCatalogo']
    newIdPrestacion = data['newIdPrestacion']
    newIdServicio = data['newIdServicio']
    newAgendable = data['newAgendable']
    newDuracion = data['newDuracion']
    newCodCentro = data['newCentro']
    newDepartamental = data['newDepartamental']
    newIncremento = data['newIncremento']
    newDecremento = data['newDecremento']
  
    oldIdCatalogo = data['oldIdCatalogo']
    oldIdPrestacion = data['oldIdPrestacion']
    oldIdServicio = data['oldIdServicio']
    oldAgendable = data['oldAgendable']
    oldDuracion = data['oldDuracion']
    oldCodCentro = data['oldCodCentro']
    oldDepartamental = data['oldDepartamental']
    oldIncremento = data['oldIncremento']
    oldDecremento = data['oldDecremento']

    try:
        session = Session()
        tipoprestacion = session.query(PrestacionServicio).filter(
            and_(
                PrestacionServicio.IdCatalogo == oldIdCatalogo,
                PrestacionServicio.IdPrestacion == oldIdPrestacion,
                PrestacionServicio.IdServicio == oldIdServicio,
                PrestacionServicio.Agendable == oldAgendable,
                PrestacionServicio.Duracion == oldDuracion,
                PrestacionServicio.CodCentro == oldCodCentro,
                PrestacionServicio.Departamental == oldDepartamental,
                PrestacionServicio.Incremento == oldIncremento,
                PrestacionServicio.Decremento == oldDecremento
            )
        ).first()

        if tipoprestacion:
            logging.info(f'Valores antigos: {oldIdCatalogo}, {oldIdPrestacion}, {oldIdServicio}, {oldAgendable},{oldDuracion},{oldCodCentro},{oldDepartamental},{oldIncremento},{oldDecremento}')
            # Atualizar os outros campos
            tipoprestacion.IdCatalogo = newIdCatalogo
            tipoprestacion.IdPrestacion = newIdPrestacion
            tipoprestacion.IdServicio = newIdServicio
            tipoprestacion.Duracion = newDuracion
            tipoprestacion.CodCentro = newCodCentro
            tipoprestacion.Departamental = newDepartamental
            tipoprestacion.Incremento = newIncremento
            tipoprestacion.Decremento = newDecremento

            # Atualizar o campo Agendable separadamente
            tipoprestacion.Agendable = int(newAgendable)
            logging.info(f'Valores antigos: {oldIdCatalogo}, {oldIdPrestacion}, {oldIdServicio}, {oldAgendable},{oldDuracion},{oldCodCentro},{oldDepartamental},{oldIncremento},{oldDecremento}')
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            logging.info()
            #return jsonify({'success': False, 'error': }), 404

    except Exception:
           print(Exception)
           return jsonify({'success': False, 'error': str(Exception)}), 500

@app.route('/delete_prestacionservicio', methods=['POST'])
def delete_prestacionservicio():
    data = request.get_json()
    delIdCatalogo = data['delCatalogo']
    delIdPrestacion = data['delPrestacion']
    delIdServicio = data['delServicio']
    delAgendable = data['delAgendable']
    delDuracion = data['delDuracion']
    delCodCentro = data['delCentro']
    delDepartamental = data['delDepartamental']
    delIncremento = data['delIncremento']
    delDecremento = data['delDecremento']


    try:
        session = Session()
        tipoprestacion = session.query(PrestacionServicio).filter(
            and_(
                PrestacionServicio.IdCatalogo == delIdCatalogo,
                PrestacionServicio.IdPrestacion == delIdPrestacion,
                PrestacionServicio.IdServicio ==delIdServicio,
                PrestacionServicio.Agendable == delAgendable,
                PrestacionServicio.Duracion == delDuracion,
                PrestacionServicio.CodCentro == delCodCentro,
                PrestacionServicio.Departamental == delDepartamental,
                PrestacionServicio.Incremento == delIncremento,
                PrestacionServicio.Decremento == delDecremento
                
            )
        ).first()

        if tipoprestacion:
            logging.info(f'Valores para borrar: {delIdCatalogo}, {delIdPrestacion}, {delIdServicio}, {delAgendable},{delDuracion},{delCodCentro},{delDepartamental},{delIncremento},{delDecremento}')
            session.delete(tipoprestacion)
            session.commit()
            PROC_SET_PROCEDURES_BENEFITS().execute(delIdPrestacion)
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        logging.info (e)
        return jsonify({'success': False, 'error': str(e)}), 500