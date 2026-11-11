#!/usr/bin/env bash
set -euo pipefail

HOST="${HELIOHOST_HOST:-johnny.heliohost.org}"
PORT="${HELIOHOST_PORT:-1373}"
USER="${HELIOHOST_USER:-}"
REMOTE="${HELIOHOST_REMOTE:-httpdocs}"
LOCAL="out"
DELETE=0

usage() {
  cat <<'EOF'
Uso:
  ./scripts/upload-heliohost.sh [opciones] [archivo-o-carpeta]

Por defecto sube la carpeta out/ a httpdocs en Johnny (plan gratuito).

Opciones:
  -l, --local RUTA      Archivo o carpeta local (por defecto: out)
  -r, --remote RUTA     Ruta remota (por defecto: httpdocs)
  -H, --host HOST       Host SFTP (por defecto: johnny.heliohost.org)
  -p, --port PUERTO     Puerto SFTP (por defecto: 1373)
  -u, --user USUARIO    Usuario SFTP (por defecto: se lee de ~/.netrc)
  -d, --delete          Borrar en el servidor lo que no exista localmente
  -h, --help            Mostrar esta ayuda

Ejemplos:
  ./scripts/upload-heliohost.sh
  ./scripts/upload-heliohost.sh -d
  ./scripts/upload-heliohost.sh -H tommy2.heliohost.org -u TU_USUARIO
  ./scripts/upload-heliohost.sh -l out -r /ruta/absoluta/httpdocs
  ./scripts/upload-heliohost.sh -l public/index.html -r httpdocs/index.html

La contraseña se lee desde ~/.netrc, nunca desde este script.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -l|--local)
      LOCAL="${2:?Falta la ruta local}"
      shift 2
      ;;
    -r|--remote)
      REMOTE="${2:?Falta la ruta remota}"
      shift 2
      ;;
    -H|--host)
      HOST="${2:?Falta el host}"
      shift 2
      ;;
    -p|--port)
      PORT="${2:?Falta el puerto}"
      shift 2
      ;;
    -u|--user)
      USER="${2:?Falta el usuario}"
      shift 2
      ;;
    -d|--delete)
      DELETE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "Opción desconocida: $1" >&2
      usage
      exit 1
      ;;
    *)
      LOCAL="$1"
      shift
      ;;
  esac
done

if ! command -v lftp >/dev/null 2>&1; then
  echo "Error: lftp no está instalado. Instálalo con: brew install lftp" >&2
  exit 1
fi

if [[ ! -e "$LOCAL" ]]; then
  echo "Error: no existe la ruta local: $LOCAL" >&2
  exit 1
fi

if [[ ! -f "$HOME/.netrc" ]]; then
  echo "Error: no existe ~/.netrc. Créalo con permisos 600." >&2
  exit 1
fi

PERMS="$(stat -f '%Lp' "$HOME/.netrc" 2>/dev/null || stat -c '%a' "$HOME/.netrc")"
if [[ "$PERMS" != "600" ]]; then
  echo "Ajustando permisos de ~/.netrc a 600…"
  chmod 600 "$HOME/.netrc"
fi

if [[ -z "$USER" ]]; then
  USER="$(
    awk -v host="$HOST" '
      $1 == "machine" { in_block = ($2 == host) }
      in_block && $1 == "login" { print $2; exit }
    ' "$HOME/.netrc"
  )"
fi

if [[ -z "$USER" ]]; then
  echo "Error: no encontré el usuario para $HOST en ~/.netrc." >&2
  echo "Hosts disponibles en ~/.netrc:" >&2
  awk '$1 == "machine" {print "  " $2}' "$HOME/.netrc" >&2
  echo "Agrega un bloque:" >&2
  echo "  machine $HOST" >&2
  echo "    login TU_USUARIO" >&2
  echo "    password TU_CONTRASENA" >&2
  exit 1
fi

TMP_SCRIPT="$(mktemp)"
trap 'rm -f "$TMP_SCRIPT"' EXIT

{
  echo "set sftp:auto-confirm yes"
  echo "set net:max-retries 2"
  echo "open sftp://${USER}@${HOST}:${PORT}"
  echo "cd"

  if [[ -d "$LOCAL" ]]; then
    if [[ "$DELETE" -eq 1 ]]; then
      printf 'mirror -R --delete --verbose -X .DS_Store "%s" "%s"\n' "$LOCAL" "$REMOTE"
    else
      printf 'mirror -R --verbose -X .DS_Store "%s" "%s"\n' "$LOCAL" "$REMOTE"
    fi
  else
    if [[ "$REMOTE" == */ ]]; then
      printf 'put -O "%s" "%s"\n' "$REMOTE" "$LOCAL"
    else
      printf 'put "%s" -o "%s"\n' "$LOCAL" "$REMOTE"
    fi
  fi

  echo "bye"
} > "$TMP_SCRIPT"

echo "HelioHost"
echo "  Host:   $HOST"
echo "  Puerto: $PORT"
echo "  Usuario: $USER"
echo "  Local:  $LOCAL"
echo "  Remoto: $REMOTE"
if [[ -d "$LOCAL" ]]; then
  echo "  Modo:   carpeta (mirror)"
else
  echo "  Modo:   archivo"
fi
if [[ "$DELETE" -eq 1 ]]; then
  echo "  Delete: activado"
fi
echo

lftp -f "$TMP_SCRIPT"
