#!/bin/sh
sh killRunningContainer.sh
npm install
npm run build
docker build -t friedcosey/static:web2 .
docker run -d -p 9005:80 --name web2 friedcosey/static:web2
docker push friedcosey/static:web2
