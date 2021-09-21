FROM node:16-slim AS base
USER node
ENV NODE_ENV=production
RUN mkdir /home/node/app
WORKDIR /home/node/app
RUN yarn set version berry
COPY package.json ./
RUN yarn plugin import workspace-tools
RUN yarn workspaces focus --all --production

FROM base AS dev
ENV NODE_ENV=development
# Production dependencies were already installed in the base image.
# Now we install the dev dependencies (and avoid modifying package-lock.json).
RUN yarn install
CMD ["yarn", "run", "dev"]

FROM dev AS build
ENV NODE_ENV=production
COPY --chown=node:node . .
RUN yarn run build

FROM base AS prod
COPY --from=build --chown=node:node /home/node/app/dist ./dist
CMD ["yarn", "run", "start"]
