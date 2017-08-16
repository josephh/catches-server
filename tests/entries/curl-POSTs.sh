
curl -v -H "Content-Type: multipart/form-data" -F data='{"newCatch":{"species":"pike","date":"2017-01-05T08:46:27Z","userId":"1","coordinates":{"lat":"51.489921","long":"-0.23182869"},"tags":[{"type":"angler","value":"jon"},{"type":"location","value":"hammersmith"},{"type":"location","value":"thames"}]}}' -F "image=@./1/1.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./2/2.json" -F "image=@./2/2.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./3/3.json" -F "image=@./3/3.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./4/4.json" -F "image=@./4/4.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./5/5.json" -F "image=@./5/5.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./6/6.json" -F "image=@./6/6.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./7/7.json" -F "image=@./7/7.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./8/8.json" -F "image=@./8/8.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./9/9.json" -F "image=@./9/9.jpg" http://localhost:8000/api/catches
curl -v -H "Content-Type: multipart/form-data" -F "data=@./10/10.json" -F "image=@./10/10.jpg" http://localhost:8000/api/catches
