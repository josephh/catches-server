#! /bin/bash

curl -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./1/1.json)" \
  -F "image=@./1/1.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./2/2.json)" \
  -F "image=@./2/2.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./3/3.json)" \
  -F "image=@./3/3.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./4/4.json)" \
  -F "image=@./4/4.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./5/5.json)" \
  -F "image=@./5/5.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./6/6.json)" \
  -F "image=@./6/6.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./7/7.json)" \
  -F "image=@./7/7.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./8/8.json)" \
  -F "image=@./8/8.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./9/9.json)" \
  -F "image=@./9/9.jpg"

curl -i -X POST http://localhost:8000/api/catches \
  -H "Content-Type: multipart/form-data" \
  -F "data=$(cat ./10/10.json)" \
  -F "image=@./10/10.jpg"
