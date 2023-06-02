FROM node:18 AS development

WORKDIR /usr/app

COPY package.json yarn.lock ./

ENV NODE_ENV=development

RUN yarn

COPY . ./

RUN yarn postinstall

CMD ["yarn", "run", "dev"]


FROM node:18-alpine

RUN apk --no-cache add ca-certificates

WORKDIR /usr/app

COPY --from=development /usr/app .

ENV NODE_ENV=production

RUN yarn cache clean

RUN yarn run build

RUN yarn install --production --ignore-scripts --prefer-offline

CMD ["yarn", "start"]

