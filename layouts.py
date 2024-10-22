from flask import send_file, Blueprint

layout_bp = Blueprint('layout', __name__)

@layout_bp.route('/download_prestacionservicio')
def download_prestacionservicio():
    try:
        # Lógica para obter o último layout válido e salvá-lo em um arquivo temporário
        # Exemplo: df.to_excel('caminho_do_arquivo.xlsx', index=False)

        # Enviar o arquivo como resposta para o cliente
        return send_file('layout/prestacionservicio.xlsx', attachment_filename='prestacionservicio.xlsx', as_attachment=True)
    except Exception as e:
        # Tratar o erro de forma apropriada
        print(str(e))
        return 'Error al bajar el layout', 500
    

@layout_bp.route('/download_prestacion')
def download_prestacion():
    try:
        # Lógica para obter o último layout válido e salvá-lo em um arquivo temporário
        # Exemplo: df.to_excel('caminho_do_arquivo.xlsx', index=False)

        # Enviar o arquivo como resposta para o cliente
        return send_file('layout/prestacion.xlsx', attachment_filename='prestacion.xlsx', as_attachment=True)
    except Exception as e:
        # Tratar o erro de forma apropriada
        print(str(e))
        return 'Error al bajar el layout', 500