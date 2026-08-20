#!/bin/sh

# Xcode Cloud Post-Clone Script for UpLift (React Native / Expo)
set -e

# Ensure Homebrew and native tooling are in PATH (for Apple Silicon & Intel runners)
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1
export HOMEBREW_NO_ENV_HINTS=1

echo "==> [Xcode Cloud] Running ci_post_clone.sh..."
echo "    Working directory: $(pwd)"
echo "    Script path:       $0"
echo "    Repository dir:    ${CI_PRIMARY_REPOSITORY_DIR:-N/A}"

# Determine repository root
if [ -n "$CI_PRIMARY_REPOSITORY_DIR" ]; then
    REPO_ROOT="$CI_PRIMARY_REPOSITORY_DIR"
else
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    if [ -f "$SCRIPT_DIR/../package.json" ]; then
        REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
    elif [ -f "$SCRIPT_DIR/../../package.json" ]; then
        REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
    else
        REPO_ROOT="$(pwd)"
    fi
fi

echo "==> Resolved Project Root: $REPO_ROOT"
cd "$REPO_ROOT"

# Install Node.js if missing
if ! command -v node >/dev/null 2>&1; then
    echo "==> Node.js not found in PATH. Installing Node.js via Homebrew..."
    brew install node
fi

# Install CocoaPods if missing
if ! command -v pod >/dev/null 2>&1; then
    echo "==> CocoaPods not found in PATH. Installing CocoaPods via Homebrew..."
    brew install cocoapods
fi

echo "==> Tooling Versions:"
echo "    Node:      $(node -v 2>/dev/null || echo 'not found')"
echo "    npm:       $(npm -v 2>/dev/null || echo 'not found')"
echo "    CocoaPods: $(pod --version 2>/dev/null || echo 'not found')"

echo "==> Installing npm packages in $REPO_ROOT..."
npm install --legacy-peer-deps

echo "==> Running pod install in $REPO_ROOT/ios..."
cd "$REPO_ROOT/ios"
pod install

echo "==> [Xcode Cloud] ci_post_clone.sh finished successfully!"
