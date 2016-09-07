FROM mhart/alpine-node:6.5

WORKDIR /src
COPY ./package.json /src/package.json
RUN npm install

COPY . /src
RUN node_modules/.bin/mocha 

EXPOSE 9000
CMD node app.js

