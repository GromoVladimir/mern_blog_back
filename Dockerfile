# specify the node base image with your desired version node:<version>
FROM node:16

# replace this with your application's default port
EXPOSE 8888

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies with npm
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]