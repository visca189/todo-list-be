FROM node:20.12.0-alpine as base

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY config.ts ./config.ts

RUN yarn build

FROM node:20.12.0-alpine

COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist

EXPOSE 3000
CMD ["dist/src/index.js"]