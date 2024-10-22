from flask import Flask, request, jsonify
import pyodbc

app = Flask(__name__)

@app.route('/test_connection', methods=['POST'])
def test_connection():
    # Obter dados de conexão do corpo da solicitação
    data = request.get_json()
    server = data['server']
    database = data['database']
    username = data['username']
    password = data['password']

    # Tentar conectar ao banco de dados
    try:
        conn = pyodbc.connect(
            driver='{SQL Server}',
            host=server,
            database=database,
            trusted_connection=True,
            user=username,
            password=password
        )
        # Conexão bem-sucedida
        conn.close()
        return jsonify({'success': True}), 200
    except pyodbc.Error as e:
        # Conexão falhou
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
