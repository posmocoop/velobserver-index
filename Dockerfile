FROM node:lts-alpine

# Create app directory
WORKDIR /opt/velobserver

COPY ./ ./

# If you are building your code for production
RUN yarn install

# tsc transpile
RUN yarn run tsc -p .