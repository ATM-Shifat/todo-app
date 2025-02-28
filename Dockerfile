# Use an official node.js runtime as a parent image
FROM node:22-alpine

#Set the workig directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files (package*.json) to the container ( . )
COPY package*.json .

# Install the dependencies
RUN npm install 

# Dependencies are installed first because docker builds the image top-to bottom.
# Rebuilding starts from the protion that has changed
# Now if the source code is changed, then at the build time
# the dependencies will be cached and only the source code will be copied.
# Less overhead.

# Copy the rest of the application code 
COPY . .

# Expose the ports the app runs on
# EXPOSE 3000

# Define the commands to run the application
CMD ["node", "./src/server.js" ]

