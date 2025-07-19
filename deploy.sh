#!/bin/bash

echo "📥 Haciendo git pull en bakery/"
git pull

echo "📦 Entrando a frontend/ e instalando dependencias..."
cd frontend
npm install

echo "🛠️ Compilando frontend con Vite..."
npm run build

echo "🚀 Desplegando a /var/www/bakehaus.com/"
rsync -av --delete ./dist/ /var/www/bakehaus.com/

echo "✅ Despliegue finalizado con éxito."
