# Create an Alpine Image with node installed
FROM node:alpine

# Change to app dir inside image
WORKDIR /app

# Copy the package.json in the workdir
COPY package.json .

# Install dependencies / Exclude dev dependencies
RUN npm install --only=prod

# Copy the rest of the files
COPY . .

# Execute npm start
CMD ["npm", "start"]
