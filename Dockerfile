# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies with npm
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]