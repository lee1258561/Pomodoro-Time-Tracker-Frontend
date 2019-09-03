From nginx:mainline
COPY dist/index.html /usr/share/nginx/html/index.html
COPY dist/main.js /usr/share/nginx/html/main.js
COPY default.conf /etc/nginx/conf.d/default.conf
