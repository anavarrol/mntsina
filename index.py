from app import app
from flask import render_template
from save_config import save_config
from test_connection import test_connection
from familia import search_familia_route,insert_familia,update_familia,delete_familia
from subfamilia import search_subfamilia_route,insert_subfamilia,update_subfamilia,delete_subfamilia
from prestacao import  search_prestacao_route,insert_prestacion, delete_prestacion, update_prestacion
from tipoprestacion import search_tipoprestacion_route,insert_tipoprestacion,update_tipoprestacion,delete_tipoprestacion
from origenprestacion import search_origenprestacion_route,insert_origenprestacion,delete_origenprestacion,update_origenprestacion
from PrestacionServicio import search_prestacionservicio_route,insert_prestacionservicio,delete_prestacionservicio,update_prestacionservicio
from garante import search_garante_route,insert_garante,delete_garante,update_garante
from Contrato import  search_contrato_route, insert_contrato_route, update_contrato_route, delete_contrato_route
from Lotes import search_lotes_route, insert_lotes_route, update_lotes_route, delete_lotes_route
from get import get_prestacion,get_catalogo,get_servicio,get_subfamilias,get_familias,get_ambito,get_codtipo
from cargadatos import cargadatos_bp,carga_prestacionservicio,carga_prestacion
from layouts import layout_bp,download_prestacionservicio,download_prestacion

app.register_blueprint(layout_bp)
app.register_blueprint(cargadatos_bp)
app.secret_key = 'S7N42m1l'

@app.route('/')
def menu():
    return render_template('menu.html')

@app.route('/save_config', methods=['POST'])
def save_config_route():
    return save_config()

@app.route('/test_connection', methods=['POST'])
def test_connection_route():
    return test_connection()

#--------------------------------------------------------------------------------- Familia
@app.route('/familia', methods=['GET'])  
def familia_page(): 
    return render_template('familia.html')  

@app.route('/search_familia', methods=['POST'])  
def familia_route():
    return search_familia_route()

@app.route('/insert_familia', methods=['POST'])
def insert_familia_route():
    return insert_familia()

@app.route('/update_familia', methods=['POST'])
def update_familia_route():
    return update_familia()

@app.route('/delete_familia', methods=['POST'])
def delete_familia_route():
    return delete_familia()

#--------------------------------------------------------------------------------- SubFamilia
@app.route('/subfamilia', methods=['GET'])  
def subfamilia_page(): 
    return render_template('subfamilia.html')

@app.route('/search_subfamilia', methods=['POST'])  
def subfamilia_route():
    return search_subfamilia_route()

@app.route('/insert_subfamilia', methods=['POST'])
def insert_subfamilia_route():
    return insert_subfamilia()

@app.route('/update_subfamilia', methods=['POST'])
def update_subfamilia_route():
    return update_subfamilia()

@app.route('/delete_subfamilia', methods=['POST'])
def delete_subfamilia_route():
    return delete_subfamilia()

#--------------------------------------------------------------------------------- Prestacion
@app.route('/prestacao', methods=['GET'])  
def prestacao_page():  
    return render_template('prestacao.html')  

@app.route('/insert_prestacion', methods=['POST'])
def insert_prestacion_route():
    return insert_prestacion()

@app.route('/search_prestacao', methods=['POST'])  
def prestacao_route():
    return search_prestacao_route()

@app.route('/update_prestacion', methods=['POST'])  
def update_prestacao_route():
    return update_prestacion()

@app.route('/delete_prestacion', methods=['POST'])
def delete_prestacion_route():
    return delete_prestacion()

#--------------------------------------------------------------------------------- TipoPrestacion
@app.route('/tipoprestacion', methods=['GET'])
def tipoprestacion_page():
    return render_template('TipoPrestacion.html')

@app.route('/search_tipoprestacion', methods=['POST'])  
def tipoprestacion_route():
    return search_tipoprestacion_route()

@app.route('/insert_tipoprestacion', methods=['POST'])
def insert_tipoprestacion_route():
    return insert_tipoprestacion()

@app.route('/update_tipoprestacion', methods=['POST'])
def update_tipoprestacion_route():
    return update_tipoprestacion()

@app.route('/delete_tipoprestacion', methods=['POST'])
def delete_tipoprestacion():
    return delete_tipoprestacion()

#--------------------------------------------------------------------------------- OrigenPrestacion
@app.route('/origenprestacion', methods=['GET'])  
def origenprestacion_page(): 
    return render_template('origenprestacion.html')  

@app.route('/search_origenprestacion', methods=['POST'])  
def origenprestacion_route():
    return search_origenprestacion_route()

@app.route('/insert_origenprestacion', methods=['POST'])
def insert_origenprestacion_route():
    return insert_origenprestacion()

@app.route('/update_origenprestacion', methods=['POST'])
def update_origenprestacion_route():
    return update_origenprestacion()

@app.route('/delete_origenprestacion', methods=['POST'])
def delete_origenprestacion_route():
    return delete_origenprestacion()

#--------------------------------------------------------------------------------- PrestacionServicio
@app.route('/prestacionservicio', methods=['GET'])  
def prestacionservicio_page(): 
    return render_template('prestacionservicio.html')  

@app.route('/search_prestacionservicio', methods=['POST'])  
def prestacionservicio_route():
    return search_prestacionservicio_route()

@app.route('/insert_prestacionservicio', methods=['POST'])
def insert_prestacionservicio_route():
    return insert_prestacionservicio()

@app.route('/update_prestacionservicio', methods=['POST'])
def update_prestacionservicio_route():
    return update_prestacionservicio()

@app.route('/delete_prestacionservicio', methods=['POST'])
def delete_prestacionservicio_route():
    return delete_prestacionservicio()

#--------------------------------------------------------------------------------- Garantes
@app.route('/garante', methods=['GET'])
def garante_page():
    return render_template ('garante.html')

@app.route('/search_garante', methods = ['POST'])
def garante_route():
    return search_garante_route()

@app.route ('/insert_garante', methods=['POST'])
def insert_garante_route():
    return insert_garante()

@app.route('/update_garante', methods=['POST'])
def update_garante_route():
    return update_garante()

@app.route('/delete_garante', methods=['POST'])
def delete_garante_route():
    return delete_garante()

#--------------------------------------------------------------------------------- Contrato
@app.route('/Contrato', methods=['GET'])
def Contrato_page():
    return render_template ('Contrato.html')

@app.route('/search_contrato', methods = ['POST'])
def search_contrato():
    return search_contrato_route()

@app.route ('/insert_contrato', methods=['POST'])
def insert_contrato():
    return insert_contrato_route()

@app.route('/update_contrato', methods=['POST'])
def update_contrato():
    return update_contrato_route()

@app.route('/delete_contrato', methods=['POST'])
def delete_contrato():
    return delete_contrato_route()

#--------------------------------------------------------------------------------- Lotes
@app.route('/lotes', methods=['GET'])
def lotes_page():
    return render_template ('lotes.html')

@app.route('/search_lotes', methods = ['POST'])
def search_lotes():
    return search_lotes_route()

@app.route ('/insert_lote', methods=['POST'])
def insert_lotes():
    return insert_lotes_route()

@app.route('/update_lote', methods=['POST'])
def update_lotes():
    return update_lotes_route()

@app.route('/delete_lote', methods=['POST'])
def delete_lotes():
    return delete_lotes_route()

#--------------------------------------------------------------------------------- Get PopUps
@app.route('/get_ambito', methods=['GET'])  
def get_ambito_route():
    return get_ambito()

@app.route('/get_catalogo', methods=['GET'])  
def get_catalogo_route():
    return get_catalogo()

@app.route('/get_codtipo', methods=['GET'])  
def get_codtipo_route():
    return get_codtipo()

@app.route('/get_familias', methods=['GET'])  
def get_familias_route():
    return get_familias()

@app.route('/get_prestacion', methods=['GET'])  
def get_prestacion_route():
    return get_prestacion()

@app.route('/get_servicio', methods=['GET'])  
def get_servicio_route():
    return get_servicio()

@app.route('/get_subfamilias/<id_familia>', methods=['GET'])  
def get_subfamilias_route(id_familia):
    return get_subfamilias(id_familia)

#--------------------------------------------------------------------------------- Cargadatos - Import Excel
@app.route('/carga_prestacion', methods=['POST'])
def carga_prestacion_route():
    return carga_prestacion()

@app.route('/download_prestacion', methods=['GET'])
def download_prestacion_route():
    return download_prestacion()

@app.route('/carga_prestacionservicio', methods=['POST'])
def carga_prestacionservicio_route():
    return carga_prestacionservicio()

@app.route('/download_prestacionservicio', methods=['GET'])
def download_prestacionservicio_route():
    return download_prestacionservicio()

if __name__ == '__main__':
    app.run(debug=True)