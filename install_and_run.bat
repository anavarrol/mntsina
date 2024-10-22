@echo off
echo Descargando las dependencias...
pip install -r requirements.txt

echo.
echo Todas dependencias  instaladas con exito!

echo.
echo Executando o arquivo index.py...
python index.py


echo Para acceder la apliacación abra el navegador.
echo e inserte localhost:5000
echo.
echo Script concluído.
pause
