import pyodbc
from flask import jsonify

connection = pyodbc.connect('DRIVER={SQL Server};SERVER=SINA-BD-QA\ICOT;DATABASE=sinasuite;UID=devuser;PWD=d3vus3r/')
# puntero 
cursor = connection.cursor()

class PROC_SET_PROCEDURES_BENEFITS: # prestacionServicio
    def execute(self, bene_code):
        bene_id = 0
        action = 3
        try:
            cursor.execute("{CALL PROC_SET_PROCEDURES_BENEFITS (?, ? ,?)}", bene_id, bene_code, action)
            print ("Procedimiento PROC_SET_PROCEDURES_BENEFITS ejecutado")
        except Exception as e:
            print(e)
            return jsonify({'success': False, 'error': str(e)}), 500
        
connection.close()