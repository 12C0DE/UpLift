#!/bin/sh

# Xcode Cloud Pre-Xcodebuild Failsafe Script for UpLift
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "==> [Xcode Cloud] Running ci_pre_xcodebuild.sh..."

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

XCCONFIG_FILE="$REPO_ROOT/ios/Pods/Target Support Files/Pods-UpLift/Pods-UpLift.release.xcconfig"

if [ ! -f "$XCCONFIG_FILE" ]; then
    echo "==> WARNING: Base configuration file missing at: $XCCONFIG_FILE"
    echo "==> Running emergency dependency setup..."
    cd "$REPO_ROOT"
    if [ ! -d "node_modules" ]; then
        echo "==> Installing Node packages..."
        npm install --legacy-peer-deps
    fi
    cd "$REPO_ROOT/ios"
    echo "==> Running pod install..."
    pod install
else
    echo "==> Verified Pods xcconfig exists at: $XCCONFIG_FILE"
fi

echo "==> [Xcode Cloud] ci_pre_xcodebuild.sh completed successfully!"
