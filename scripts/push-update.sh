#!/bin/bash
# Push an OTA update to all installed BuildMatch apps.
# Usage: ./scripts/push-update.sh "what changed"
# This sends the latest JS code to every phone that has the app installed.
# No Play Store review needed — users get it silently on next launch or foreground.

set -e

MESSAGE="${1:-Update}"

echo "Pushing OTA update to production: \"$MESSAGE\""
cd "$(dirname "$0")/../artifacts/buildmatch"

EXPO_PUBLIC_DOMAIN=buildmatch.online \
EAS_SKIP_AUTO_FINGERPRINT=1 \
  eas update \
  --branch production \
  --message "$MESSAGE" \
  --non-interactive

echo ""
echo "Done! Users will receive the update the next time they open the app."
