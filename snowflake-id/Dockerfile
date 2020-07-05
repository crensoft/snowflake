FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install

# If you are building your code for production
# RUN npm ci --only=production

COPY . .

RUN yarn build

EXPOSE 3999

CMD [ "node", "dist/server.js" ]