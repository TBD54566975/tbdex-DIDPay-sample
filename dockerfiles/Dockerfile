FROM node:20 AS build

WORKDIR /didpay

COPY src ./src
COPY public ./public
COPY .eslintrc.cjs index.html package.json postcss.config.cjs tailwind.config.js tsconfig.json tsconfig.node.json vite.config.ts ./

RUN npm install && npm run build

FROM nginx:1.25.1-alpine

ARG NGINX_PORT=3000
ENV NGINX_PORT=${NGINX_PORT}
EXPOSE ${NGINX_PORT}

COPY --from=build  /didpay/dist /usr/share/nginx/html
COPY ./dockerfiles/conf/nginx.conf /etc/nginx/nginx.conf
COPY ./dockerfiles/conf/server.conf.template /etc/nginx/templates/server.conf.template

CMD ["nginx", "-g", "daemon off;"]