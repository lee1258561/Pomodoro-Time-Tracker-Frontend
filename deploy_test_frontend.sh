 cd PTTWeb2
 docker run -d -p 9001:80 --name frontendweb2test friedcosey/static:web2
 docker exec -tid frontendweb2test sh -c "sed -i -e '{s/http\:\/\/gazelle\.cc\.gatech\.edu\:9103/http\:\/\/gazelle\.cc\.gatech\.edu\:9102/g}' /usr/share/nginx/html/main.js"
