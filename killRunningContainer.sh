#!/bin/sh
containerId=$(docker ps -a | grep 9005 | awk '{print $1}')
if [ ! -z $containerId ]
then
    docker rm -f $containerId
    echo $containerId is killed
else
    echo "No container running";
fi
