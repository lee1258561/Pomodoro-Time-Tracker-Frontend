#!/bin/sh
containerId=$(docker ps -a | grep 9005 | awk '{print $1}')
if [ ! -z $containerId ]
then
    docker stop $containerId
    docker rm $containerId
    echo $containerId is removed
else
    echo "No container running";
fi
docker run -d -p 9005:80 --name web2 friedcosey/static:web2
