#!/bin/bash
# Generate Dev Certs for mTLS

mkdir -p certs
cd certs

# CA
openssl genrsa -out ca.key 4096
openssl req -new -x509 -key ca.key -sha256 -subj "/C=VN/ST=Hanoi/O=VHV/CN=Dev CA" -days 365 -out ca.crt

# Server Cert
openssl genrsa -out server.key 4096
openssl req -new -key server.key -out server.csr -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:localhost,IP:127.0.0.1")) -subj "/C=VN/ST=Hanoi/O=VHV/CN=localhost"
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -extensions SAN -extfile <(printf "[SAN]\nsubjectAltName=DNS:localhost,IP:127.0.0.1")

# Client Cert
openssl genrsa -out client.key 4096
openssl req -new -key client.key -out client.csr -subj "/C=VN/ST=Hanoi/O=VHV/CN=client"
openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt

echo "Certs generated in ./certs"
