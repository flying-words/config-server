FROM node:7

WORKDIR /src
COPY ./package.json /src/package.json
RUN yarn install

COPY . /src
RUN yarn test

EXPOSE 9000
CMD yarn start

