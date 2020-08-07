FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN npm install

COPY . .
# ENTRYPOINT [ "/app/server.sh" ]
CMD ["npm", "run", "start"]
