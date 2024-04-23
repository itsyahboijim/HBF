#!/bin/bash

# Execute "chmod +x docker_env_build.sh" to add permissions for this script to be executed
DOCKERFILE_PATH="Dockerfile"
ENV_FILE=".env"

echo "Building image with args: "
# Prepare --build-arg options
BUILD_ARGS=""
while IFS= read -r line; do
  # Skip comments and empty lines
  if [[ "$line" =~ ^#.*$ || -z "$line" ]]; then
    continue
  fi

  # Extract key and value from the line
  KEY="${line%%=*}"
  VALUE="${line#*=}"

  echo "$KEY: $VALUE"

  BUILD_ARGS+="--build-arg $KEY=$VALUE "
done < "$ENV_FILE"

# Build the Docker image with the collected build arguments
DOCKER_IMAGE_NAME="hbf:latest"

# Run the docker build command
docker build -f "$DOCKERFILE_PATH" $BUILD_ARGS -t "$DOCKER_IMAGE_NAME" .