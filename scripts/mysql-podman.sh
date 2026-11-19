#!/usr/bin/env bash
# Inicia MySQL 8 para el backend Laravel usando Podman o Docker (el que esté instalado).
# Modo desarrollo: contraseña vacía para root (acepta el .env.example del repo).
# Uso: bash scripts/mysql-podman.sh
set -euo pipefail

NOMBRE="so_geo_mysql"
DATOS="so_geo_mysql_data"

if command -v podman >/dev/null 2>&1; then
    MOTOR=podman
elif command -v docker >/dev/null 2>&1; then
    MOTOR=docker
else
    echo "ERROR: instala Podman o Docker para levantar MySQL 8." >&2
    exit 1
fi

echo "Usando $MOTOR para iniciar MySQL 8..."

if "$MOTOR" container inspect "$NOMBRE" >/dev/null 2>&1; then
    if [ "$("$MOTOR" inspect -f '{{.State.Running}}' "$NOMBRE")" = "true" ]; then
        echo "MySQL ya está en ejecución."
    else
        echo "Iniciando contenedor existente..."
        "$MOTOR" start "$NOMBRE"
    fi
else
    echo "Creando contenedor MySQL 8..."
    "$MOTOR" run -d --name "$NOMBRE" \
        -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
        -e MYSQL_DATABASE=so_geograficos \
        -p 3306:3306 \
        -v "$DATOS:/var/lib/mysql" \
        docker.io/library/mysql:8.0
fi

echo "Esperando a que MySQL responda..."
for _ in $(seq 1 60); do
    if "$MOTOR" exec "$NOMBRE" mysqladmin ping -h 127.0.0.1 --silent 2>/dev/null; then
        echo "MySQL listo en 127.0.0.1:3306 (BD: so_geograficos, usuario: root, sin contraseña)."
        exit 0
    fi
    sleep 2
done

echo "MySQL no respondió a tiempo. Revisa: $MOTOR logs $NOMBRE" >&2
exit 1
