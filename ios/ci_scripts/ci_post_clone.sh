#!/bin/sh

# Xcode Cloud Post-Clone Script for UpLift (React Native / Expo)
set -e

export HOMEBREW_NO_AUTO_UPDATE=1

echo "==> Installing Node.js & CocoaPods if needed..."
if ! command -v node >/dev/null 2>&1; then
    brew install node
fi

if ! command -v pod >/dev/null 2>&1; then
    brew install cocoapods
fi

echo "==> Installing npm packages in project root..."
cd "$CI_PRIMARY_REPOSITORY_DIR"
npm install

echo "==> Running pod install in ios folder..."
cd "$CI_PRIMARY_REPOSITORY_DIR/ios"
pod install

echo "==> Xcode Cloud post-clone setup completed successfully!"
