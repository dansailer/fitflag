#!/bin/bash
# Setup script for Quarkus backend

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Setting up Quarkus backend..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Maven not found. Please install Maven or download the Maven wrapper."
    echo "You can download Maven wrapper files from:"
    echo "https://github.com/takari/maven-wrapper"
    echo ""
    echo "Or install Maven via Homebrew: brew install maven"
    exit 1
fi

# Generate Maven wrapper
echo "Generating Maven wrapper..."
cd "$SCRIPT_DIR" && mvn wrapper:wrapper

echo "Setup complete! You can now run:"
echo "  ./mvnw quarkus:dev    # Start in dev mode"
echo "  ./mvnw clean package  # Build for production"
