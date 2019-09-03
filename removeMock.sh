 containerId=$(docker ps -a | grep backend2web2test | awk '{print $1}')
 if [ ! -z $containerId ]
 then
     docker stop $containerId
     docker rm $containerId
     echo $containerId is removed
 else
     echo "No container running";
 fi
 containerId=$(docker ps -a | grep  frontendweb2test | awk '{print $1}')
 if [ ! -z $containerId ]
 then
     docker stop $containerId
     docker rm $containerId
     echo $containerId is removed
 else
     echo "No container running";
 fi
 containerId=$(docker ps -a | grep  mongoweb2test | awk '{print $1}')
 if [ ! -z $containerId ]
 then
     docker stop $containerId
     docker rm $containerId
     echo $containerId is removed
 else
     echo "No container running";
 fi
