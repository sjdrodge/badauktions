FROM node:16-slim as base
USER node
ENV NODE_ENV=production
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

FROM base as dev
ENV NODE_ENV=development
ENV PATH=/home/node/app/node_modules/.bin:$PATH
# Production dependencies were already installed in the base image.
# Now we install the dev dependencies (and avoid modifying package-lock.json).
RUN npm install --save=false
CMD ["nodemon"]

FROM dev as build
ENV NODE_ENV=production
COPY --chown=node:node . .
RUN npm run build

FROM base as prod
COPY --from=build --chown=node:node /home/node/app/dist ./dist
CMD ["node", "dist/app.js"]
