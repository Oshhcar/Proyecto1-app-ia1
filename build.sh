docker build --no-cache -t oshhcar/app .
docker stop app
docker rm app
docker run -it -d --name=app -p 80:3000 oshhcar/app