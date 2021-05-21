# Create an Alpine Image with node installed
FROM node:alpine

# Change to app dir inside image
WORKDIR /app

# Copy the package.json in the workdir
COPY package.json .

# This fix the bug that dev server keeps restarting
# It kept me insane for some hours
ENV CI=true

# Install dependencies / Exclude dev dependencies / Use the legacy-peer-deps for now until the craco is fixed
# RUN npm install --only=prod
RUN npm install umi -g
RUN npm install --legacy-peer-deps
RUN npm install react-scripts -g
# Copy the rest of the files
COPY . .
EXPOSE 8000
# Execute npm start
CMD ["npm", "start"]
