import os
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Definir o caminho para a pasta config
config_dir = os.path.join(app.root_path, 'config')

# Rota para salvar as informações de configuração
@app.route('/save_config', methods=['POST'])
def save_config():
    # Obter os dados enviados pelo cliente
    data = request.get_json()

    # Salvar as informações de configuração em um arquivo JSON
    config_path = os.path.join(app.root_path, 'config', 'config.json')
    with open(config_path, 'w') as f:
        json.dump(data, f)

    # Retornar uma resposta ao cliente
    return jsonify({'success': True})
