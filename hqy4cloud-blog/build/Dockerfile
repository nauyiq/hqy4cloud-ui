FROM nginx:stable-alpine
MAINTAINER hongqy<759428167@qq.com>

ADD conf/nginx.conf /etc/nginx/nginx.conf
ADD dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

