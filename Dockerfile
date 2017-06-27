FROM openjdk:8-jdk-alpine

EXPOSE 5000

RUN apk update
RUN apk add openssl nodejs-npm

RUN wget https://github.com/xoliba/xoliba/archive/master.zip -O front.zip; unzip front.zip; rm front.zip
RUN wget https://github.com/xoliba/xoliba-ai/archive/master.zip -O AI.zip; unzip AI.zip; rm AI.zip

#WORKDIR "/xoliba-ai-master"
#RUN ./gradlew run &

WORKDIR "/xoliba-master"
RUN npm install
WORKDIR "../

#WORKDIR "/xoliba-master"
#RUN npm start &

ENTRYPOINT cd xoliba-ai-master; ./gradlew run & cd ../xoliba-master/; npm start
