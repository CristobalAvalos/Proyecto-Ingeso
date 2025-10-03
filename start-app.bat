@echo off
echo 🚀 Iniciando la aplicación con hot-reload...
docker-compose up -d --build

echo ⏳ Esperando que los servicios estén listos...
timeout /t 10 /nobreak > nul

echo 🌐 Abriendo la aplicación en el navegador...
start http://localhost:5173

echo.
echo ✅ ¡Aplicación iniciada!
echo.
echo 📝 HOT-RELOAD ACTIVADO:
echo    - Los cambios en el código se reflejan automáticamente
echo    - Frontend: http://localhost:5173
echo    - Backend: http://localhost:3000
echo.
echo 📋 Comandos útiles:
echo    Ver logs:     docker-compose logs -f
echo    Detener:      docker-compose down
echo    Reiniciar:    docker-compose restart
echo.
pause
