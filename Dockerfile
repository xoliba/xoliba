FROM node:8-alpine

EXPOSE 5000

RUN apk update
RUN apk add openssl

#ADD public /xoliba/public/
#ADD server.js /xoliba/server.js
#ADD test /xoliba/test/
#ADD package.json /xoliba/package.json
#ADD webpack.config.js /xoliba/webpack.config.js

RUN wget https://github.com/xoliba/xoliba/archive/master.zip -O front.zip; unzip front.zip; rm front.zip
#RUN wget https://github.com/xoliba/xoliba-ai/archive/master.zip -O AI.zip; unzip AI.zip; rm AI.zip

#WORKDIR "/xoliba-ai-master"
#RUN ./gradlew build
#WORKDIR "../"

WORKDIR "/xoliba-master"
RUN npm install
#WORKDIR "../

#WORKDIR "/xoliba-master"
#RUN npm start &

ENTRYPOINT npm start
