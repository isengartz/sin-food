# Create an Alpine Image with node installed
FROM node:alpine

# Change to app dir inside image
WORKDIR /app

# Copy the package.json in the workdir
COPY package.json .

# This fix the bug that dev server keeps restarting
# It kept me insane for some hours
ENV CI=true

# Install dependencies / Exclude dev dependencies
RUN npm install --only=prod
RUN npm install react-scripts -g
# Copy the rest of the files
COPY . .
EXPOSE 3000
# Execute npm start
CMD ["npm", "start"]
