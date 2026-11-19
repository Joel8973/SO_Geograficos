#!/usr/bin/env bash
# Inicia MySQL 8 en Podman para el backend Laravel.
# Modo desarrollo: contraseña vacía para root (acepta el .env.example del repo).
set -euo pipefail

NOMBRE="so_geo_mysql"
DATOS="so_geo_mysql_data"

if podman container exists "$NOMBRE"; then
    if [ "$(podman inspect -f '{{.State.Running}}' "$NOMBRE")" = "true" ]; then
        echo "MySQL ya está en ejecución."
    else
        echo "Iniciando contenedor existente..."
        podman start "$NOMBRE"
    fi
else
    echo "Creando contenedor MySQL 8..."
    podman run -d --name "$NOMBRE" \
        -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
        -e MYSQL_DATABASE=so_geograficos \
        -p 3306:3306 \
        -v "$DATOS:/var/lib/mysql" \
        docker.io/library/mysql:8.0
fi

echo "Esperando a que MySQL responda..."
for _ in $(seq 1 40); do
    if podman exec "$NOMBRE" mysqladmin ping -h 127.0.0.1 --silent 2>/dev/null; then
        echo "MySQL listo en 127.0.0.1:3306 (BD: so_geograficos, usuario: root, sin contraseña)."
        exit 0
    fi
    sleep 2
done

echo "MySQL no respondió a tiempo. Revisa: podman logs $NOMBRE" >&2
exit 1
