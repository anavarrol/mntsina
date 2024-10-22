import pyodbc
from flask import jsonify

connection = pyodbc.connect('DRIVER={SQL Server};SERVER=SINA-BD-QA\ICOT;DATABASE=sinasuite;UID=devuser;PWD=d3vus3r/')
# puntero 
cursor = connection.cursor()

class PROC_GET_NAV_INSURANCES: # Garante
    def execute(self):
        try:
            cursor.execute("{CALL PROC_GET_NAV_INSURANCES}")
            print ("Procedimiento PROC_GET_NAV_INSURANCES ejecutado")
        except Exception as e:
            print(e)
            return jsonify({'success': False, 'error': str(e)}), 500
        
        
connection.close()