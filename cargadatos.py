from flask import Blueprint, request, flash, jsonify,redirect,url_for
import pandas as pd
from conn import PrestacionServicio,Prestacion, Session
import logging

cargadatos_bp = Blueprint('cargadatos', __name__)
logging.basicConfig(level=logging.DEBUG, filename='import.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s')

@cargadatos_bp.route('/carga_prestacionservicio', methods=['POST'])
def carga_prestacionservicio():
    try:
        file = request.files['importFile']
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file,dtype={'idCatalogo': str, 'idPrestacion':str, 'idServicio':str, 'agendable':str, 'duracion':str, 'codcentro':str, 'departamental':str, 'incremento':str, 'decremento':str})
            logging.info(f'df: {df}')
            
            # Verificar se as colunas necessárias estão presentes no arquivo Excel
            if all(col in df.columns for col in ['idCatalogo', 'idPrestacion', 'idServicio', 'agendable', 'duracion', 'codCentro', 'departamental', 'incremento', 'decremento']):
                # Processar os dados do arquivo Excel e salvar nas colunas correspondentes do banco de dados
                # Exemplo de código para salvar no banco de dados:
                for _, row in df.iterrows():
                    IdCatalogo = row['idCatalogo']
                    IdPrestacion = row['idPrestacion']
                    IdServicio = row['idServicio']
                    Agendable = row['agendable']
                    Duracion = row['duracion']
                    CodCentro = row['codCentro']
                    Departamental = row['departamental']
                    Incremento = row['incremento']
                    Decremento = row['decremento']
                    Activo = 1
                    logging.info(f'row: {IdCatalogo, IdPrestacion, IdServicio, Activo, Agendable, Duracion, CodCentro, Departamental, Incremento, Decremento}')
                    
                    #verificar la información enviada al endpoint
                    if pd.isna(IdCatalogo):
                        IdCatalogo = ''
                        
                    try:
                        session = Session()
                        print(IdCatalogo, IdPrestacion, IdServicio, Agendable, Duracion, CodCentro, Departamental, Incremento, Decremento)  
                        new_prestacionservicio = PrestacionServicio(IdCatalogo, IdPrestacion, IdServicio, Activo, Agendable, Duracion, CodCentro, Departamental, Incremento, Decremento)
                        logging.info(f'new_prestacionservicio: {new_prestacionservicio.__dict__}')
                        session.add(new_prestacionservicio)
                        session.commit()
                        session.close()

                    except Exception as e:
                        flash('Ocorreu um erro ao inserir os dados no banco de dados. Por favor, tente novamente.', 'error')
                        # Registrar o erro em um arquivo de log ou exibir para o usuário, se necessário
                        logging.error(str(e))

                flash('Dados importados com sucesso!', 'success')
                logging.info(f'registro importado con exito: {new_prestacionservicio.__dict__}')
            else:
                flash('Colunas necessárias não encontradas no arquivo Excel.', 'error')
        else:
            flash('Formato de arquivo inválido. Por favor, selecione um arquivo Excel (.xlsx).', 'error')
    except Exception as e:
        flash('Ocorreu um erro ao importar os dados. Por favor, tente novamente.', 'error')
        # Registrar o erro em um arquivo de log ou exibir para o usuário, se necessário
        logging.error(str(e))

    return redirect(url_for('prestacionservicio_page'))



@cargadatos_bp.route('/carga_prestacion', methods=['POST'])
def carga_prestacion():
    try:
        file = request.files['importFile']
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file,dtype={'IdCatalogo': str,'IdPrestacion': str,'IdFamilia':str,'IdSubfamilia':str,'Descripcion':str,'UnidadMedida':str, 'Duracion': str})
            logging.info(f'df: {df}')
            
            # Verificar se as colunas necessárias estão presentes no arquivo Excel
            if all(col in df.columns for col in ['IdCatalogo', 'IdPrestacion', 'IdFamilia', 'IdSubfamilia', 'Descripcion', 'UnidadMedida', 'Duracion']):
                # Processar os dados do arquivo Excel e salvar nas colunas correspondentes do banco de dados
                # Exemplo de código para salvar no banco de dados:
                for _, row in df.iterrows():
                    IdCatalogo = row['IdCatalogo']
                    IdPrestacion = row['IdPrestacion']
                    IdFamilia = row['IdFamilia']
                    IdSubfamilia = row['IdSubfamilia']
                    Descripcion = row['Descripcion']
                    UnidadMedida = row['UnidadMedida']
                    Duracion = row['Duracion']
                    Activo = 1
                    logging.info(f'row: {IdCatalogo, IdPrestacion, IdFamilia, IdSubfamilia,Activo, Descripcion, UnidadMedida, Duracion}')
                    # print(df) 
                    
                    #verificar la información enviada al endpoint
                    if pd.isna(IdCatalogo):
                        IdCatalogo = ''
                    if pd.isna(UnidadMedida):
                        UnidadMedida = ''


                    try:
                        session = Session()
                        new_prestacion = Prestacion(IdCatalogo, IdPrestacion, IdFamilia, IdSubfamilia,Activo,Descripcion,UnidadMedida,Duracion)

                        logging.info(f'new_prestacion: {new_prestacion.__dict__}')
                        session.add(new_prestacion)
                        session.commit()
                        session.close()

                    except Exception as e:
                        flash('Ocorreu um erro ao inserir os dados no banco de dados. Por favor, tente novamente.', 'error')
                        # Registrar o erro em um arquivo de log ou exibir para o usuário, se necessário
                        logging.error(str(e))

                flash('Dados importados com sucesso!', 'success')
                logging.info(f'registro importado con exito: {new_prestacion.__dict__}')
            else:
                flash('Colunas necessárias não encontradas no arquivo Excel.', 'error')
                logging.info(f'las columnas no son correspondientes IdCatalogo, IdPrestacion, IdFamilia, IdSubfamilia, Descripcion, UnidadMedida,Duracion')
        else:
            flash('Formato de arquivo inválido. Por favor, selecione um arquivo Excel (.xlsx).', 'error')
    except Exception as e:
        flash('Ocorreu um erro ao importar os dados. Por favor, tente novamente.', 'error')
        # Registrar o erro em um arquivo de log ou exibir para o usuário, se necessário
        logging.error(str(e))

    return redirect(url_for('prestacao_page'))
