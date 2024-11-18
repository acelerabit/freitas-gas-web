FROM node:20.16.0

WORKDIR /app

COPY  package.json yarn.lock ./
COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]