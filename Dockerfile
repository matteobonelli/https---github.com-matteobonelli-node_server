FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000:3000

CMD ["node", "./server.js"]