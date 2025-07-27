#!/bin/bash
set -e

if [[ -f "localhost-cert.pem" && -f "localhost-key.pem" ]]; then
  echo "✅ Certs already exist."
  exit 0
fi

echo "🔐 Generating localhost self-signed certs..."
openssl req -x509 -out localhost-cert.pem -keyout localhost-key.pem \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

echo "✅ Certs created: localhost-cert.pem and localhost-key.pem"
