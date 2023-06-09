FROM node:18.12.1
# FROM node:16.3.0-alpine
WORKDIR /app/sfl-api
COPY package.json ./
RUN yarn
COPY . .
RUN \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*s
RUN yarn env
EXPOSE 8080
CMD yarn prod
