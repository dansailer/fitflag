# justfile for fitflag project

# Detect container engine (podman or docker)
container_engine := `command -v podman > /dev/null && echo podman || echo "docker"`

# Default recipe to display help
default:
    @just --list

# Start flagd locally using Docker/Podman
flagd-start:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found. Please install one of them."
        exit 1
    fi
    
    echo "Starting flagd with {{container_engine}}..."
    {{container_engine}} run -d \
        --name flagd \
        --rm \
        -p 8013:8013 \
        -p 8016:8016 \
        -v "$(pwd)/flagd/config:/etc/flagd:ro" \
        ghcr.io/open-feature/flagd:latest \
        start \
        --cors-origin "*" \
        --debug \
        --uri file:/etc/flagd/gui.yaml \
        --uri file:/etc/flagd/quarkus.yaml \
        --uri file:/etc/flagd/nodejs.yaml

# Stop flagd container
flagd-stop:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found."
        exit 1
    fi
    
    echo "Stopping flagd..."
    {{container_engine}} stop flagd

# Restart flagd
flagd-restart: flagd-stop flagd-start

# Show flagd logs
flagd-logs:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found."
        exit 1
    fi
    
    {{container_engine}} logs -f flagd

frontend-install:
    cd src/fitflag-frontend && npm install

frontend-update:
    cd src/fitflag-frontend && npm update

frontend-dev:
    cd src/fitflag-frontend && npm run dev

frontend-build:
    cd src/fitflag-frontend && npm run build

frontend-lint:
    cd src/fitflag-frontend && npm run lint

frontend-preview:
    cd src/fitflag-frontend && npm run preview

frontend-docker-build:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found."
        exit 1
    fi
    
    echo "Building frontend Docker image..."
    {{container_engine}} build -t fitflag-frontend:latest -f src/fitflag-frontend/Dockerfile src/fitflag-frontend


quarkus-dev:
    #!/usr/bin/env bash
    export JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home
    export PATH="$JAVA_HOME/bin:$PATH"
    cd src/fitflag-quarkus && ./mvnw quarkus:dev

quarkus-build:
    #!/usr/bin/env bash
    export JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home
    export PATH="$JAVA_HOME/bin:$PATH"
    cd src/fitflag-quarkus && ./mvnw clean package

quarkus-run:
    #!/usr/bin/env bash
    export JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home
    export PATH="$JAVA_HOME/bin:$PATH"
    cd src/fitflag-quarkus && java -jar target/quarkus-app/quarkus-run.jar

quarkus-clean:
    #!/usr/bin/env bash
    export JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home
    export PATH="$JAVA_HOME/bin:$PATH"
    cd src/fitflag-quarkus && ./mvnw clean

quarkus-test:
    #!/usr/bin/env bash
    export JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home
    export PATH="$JAVA_HOME/bin:$PATH"
    cd src/fitflag-quarkus && ./mvnw test

quarkus-update:
    #!/usr/bin/env bash
    export JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home
    export PATH="$JAVA_HOME/bin:$PATH"
    cd src/fitflag-quarkus && ./mvnw versions:display-dependency-updates

quarkus-docker-build:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found."
        exit 1
    fi
    echo "Building Quarkus Docker image..."
    {{container_engine}} build -t fitflag-quarkus:latest -f src/fitflag-quarkus/Dockerfile src/fitflag-quarkus

nodejs-install:
    cd src/fitflag-nodejs && npm install

nodejs-update:
    cd src/fitflag-nodejs && npm update

nodejs-dev:
    cd src/fitflag-nodejs && npm run dev

nodejs-build:
    cd src/fitflag-nodejs && npm run build

nodejs-start:
    cd src/fitflag-nodejs && npm start

nodejs-watch:
    cd src/fitflag-nodejs && npm run watch

nodejs-docker-build:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found."
        exit 1
    fi
    echo "Building Node.js Docker image..."
    {{container_engine}} build -t fitflag-nodejs:latest -f src/fitflag-nodejs/Dockerfile src/fitflag-nodejs

compose-up:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found."
        exit 1
    fi
    export PODMAN_COMPOSE_WARNING_LOGS=false
    echo "Starting application stack with {{container_engine}}-compose..."
    {{container_engine}} compose -f docker-compose.yml up --detach --build
compose-down:
    #!/usr/bin/env bash
    if [ -z "{{container_engine}}" ]; then
        echo "Error: Neither podman nor docker found."
        exit 1
    fi
    export PODMAN_COMPOSE_WARNING_LOGS=false
    echo "Stopping application stack with {{container_engine}}-compose..."
    {{container_engine}} compose -f docker-compose.yml down

# Update all project dependencies
update-all: frontend-update nodejs-update quarkus-update
    @echo "All dependencies updated!"