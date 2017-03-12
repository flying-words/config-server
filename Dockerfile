FROM node:6.5

WORKDIR /src
COPY ./package.json /src/package.json
RUN npm install

COPY . /src
RUN npm test

EXPOSE 9000
CMD node server.js

