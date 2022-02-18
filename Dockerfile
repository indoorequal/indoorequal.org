FROM node:16 as builder

WORKDIR /code

COPY package.json yarn.lock /code/
RUN yarn install --pure-lockfile

COPY . /code
RUN yarn run build

FROM nginx:alpine

COPY nginx_gzip.conf /etc/nginx/conf.d
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /code/dist /usr/share/nginx/html/
