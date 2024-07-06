FROM node:lts-iron
LABEL authors="Bhishman Desai"

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

# Bundle app source
COPY . .

CMD ["npm", "run", "dev"]
