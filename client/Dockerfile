FROM node:16-slim as dev
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package.json package-lock.json ./
ENV PATH=/home/node/app/node_modules/.bin:$PATH
RUN npm ci
CMD ["npm", "run", "start"]

FROM nginx:1.20-alpine as proxy-base
RUN rm /etc/nginx/conf.d/default.conf

FROM proxy-base as proxy-dev
COPY nginx/dev.conf /etc/nginx/nginx.conf

FROM dev as build
COPY . .
RUN npm run build

FROM proxy-base as proxy-prod
COPY nginx/prod.conf /etc/nginx/nginx.conf
COPY --from=build /home/node/app/dist /usr/share/nginx/html
