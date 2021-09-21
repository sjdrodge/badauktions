FROM node:16-slim AS dev
RUN mkdir /home/node/app
WORKDIR /home/node/app
RUN yarn set version berry
COPY package.json ./
RUN yarn install
CMD ["yarn", "run", "start"]

FROM nginx:1.21-alpine AS proxy-base
RUN rm /etc/nginx/conf.d/default.conf

FROM proxy-base AS proxy-dev
COPY nginx/dev.conf /etc/nginx/nginx.conf

FROM dev AS build
COPY . .
RUN yarn run build

FROM proxy-base AS proxy-prod
COPY nginx/prod.conf /etc/nginx/nginx.conf
COPY --from=build /home/node/app/dist /usr/share/nginx/html
