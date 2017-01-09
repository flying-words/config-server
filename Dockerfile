FROM node:6.5

RUN apt-get update && apt-get install -y git

WORKDIR /src
COPY ./package.json /src/package.json
RUN npm install

COPY . /src
RUN npm test

RUN echo $(git rev-parse --short HEAD) > .version

EXPOSE 9000
CMD node server.js

