#!/bin/sh

#set up test server
docker-compose -f PTTWeb2/docker-compose_test.yml up -d --build

#modify database url
docker exec -itd backend2web2test sed -i -e '12{s/mongo\:27017/mongoweb2test\:27017/g}' /app/server.ts
