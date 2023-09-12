FROM node:16.17.1

WORKDIR /frontend

COPY package.json .
RUN npm i
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

