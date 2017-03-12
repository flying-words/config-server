FROM daocloud.io/limijiaoyin_dev/node-yarn:6.9

WORKDIR /src
COPY ./package.json /src/package.json
RUN yarn install

COPY . /src
RUN yarn test

EXPOSE 9000
CMD node server.js

