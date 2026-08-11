#!/bin/sh

# Xcode Cloud Post-Clone Script for UpLift (React Native / Expo)

# Ensure Homebrew and native tooling are in PATH (for Apple Silicon & Intel runners)
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export HOMEBREW_NO_AUTO_UPDATE=1

echo "==> Xcode Cloud Environment Info:"
echo "    Working directory: $(pwd)"
echo "    Script path:       $0"
echo "    Repository dir:    $CI_PRIMARY_REPOSITORY_DIR"

# Install Node.js if missing
if ! command -v node >/dev/null 2>&1; then
    echo "==> Installing Node.js via Homebrew..."
    brew install node || true
fi

# Install CocoaPods if missing
if ! command -v pod >/dev/null 2>&1; then
    echo "==> Installing CocoaPods via Homebrew..."
    brew install cocoapods || true
fi

echo "==> Tooling Versions:"
echo "    Node: $(node -v 2>/dev/null || echo 'not found')"
echo "    npm:  $(npm -v 2>/dev/null || echo 'not found')"
echo "    pod:  $(pod --version 2>/dev/null || echo 'not found')"

# Safely navigate to repository root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "==> Resolved Project Root: $ROOT_DIR"
cd "$ROOT_DIR"

echo "==> Installing npm packages in $(pwd)..."
npm install

echo "==> Running pod install in $ROOT_DIR/ios..."
cd "$ROOT_DIR/ios"
pod install

echo "==> Xcode Cloud post-clone script finished successfully!"
