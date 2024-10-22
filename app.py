from flask import Flask
from flask_cors import CORS #importa CORS para que se utilice de todas las direcciones

app = Flask(__name__, template_folder='templates')
CORS(app)
