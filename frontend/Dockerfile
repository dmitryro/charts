FROM node:10
RUN rm -rf ./node_modules
RUN npm install
COPY .env_sample .env
WORKDIR /frontend
ADD . /frontend/
