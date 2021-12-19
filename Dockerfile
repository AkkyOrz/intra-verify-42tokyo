FROM node:17
WORKDIR /app
RUN apt-get update && apt-get install -y libgtk-3.0 libgbm-dev libnss3 libatk-bridge2.0-0 libasound2
COPY package.json ./
COPY . .
RUN yarn
CMD ["yarn", "start"]
