# Use an LTS Node image
FROM node:lts

# Set the working directory in the app
WORKDIR /

# Copy dependency manifests first (better build caching)
COPY package*.json ./

# Install dependencies
# (uses package-lock.json if present)
RUN npm ci --omit=dev || npm install --production

# Copy the rest of the app
ADD . /

# App listens on 8080 (per server.js)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]