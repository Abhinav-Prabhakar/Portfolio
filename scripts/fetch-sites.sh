#!/bin/zsh
# Pulls placeholder screenshots for the work strip (replace with real work later).
# Usage: scripts/fetch-sites.sh [name|url ...]
set -u
cd "$(dirname "$0")/.."
mkdir -p assets/sites

typeset -a sites
sites=(
  "01-linear|https://linear.app"
  "02-stripe|https://stripe.com"
  "03-vercel|https://vercel.com"
  "04-framer|https://www.framer.com"
  "05-raycast|https://www.raycast.com"
  "06-figma|https://www.figma.com"
  "07-supabase|https://supabase.com"
  "08-notion|https://www.notion.com"
  "09-resend|https://resend.com"
  "10-rive|https://rive.app"
  "11-height|https://height.app"
  "12-cal|https://cal.com"
  "13-clerk|https://clerk.com"
  "14-neon|https://neon.tech"
  "15-posthog|https://posthog.com"
  "16-arc|https://arc.net"
  "17-retool|https://retool.com"
  "18-tldraw|https://tldraw.com"
  "19-mintlify|https://mintlify.com"
  "20-plane|https://plane.so"
  "21-dub|https://dub.co"
  "22-superhuman|https://superhuman.com"
  "23-attio|https://attio.com"
  "24-pitch|https://pitch.com"
  "25-descript|https://descript.com"
  "26-cursor|https://cursor.com"
  "27-bolt|https://bolt.new"
  "28-v0|https://v0.app"
  "29-perplexity|https://perplexity.ai"
  "30-cron|https://cron.com"
)

[[ $# -gt 0 ]] && sites=("$@")

for item in $sites; do
  name="${item%%|*}"
  url="${item#*|}"
  png="assets/sites/$name.png"

  for attempt in 1 2 3; do
    curl -sL --max-time 90 -o "$png" "https://image.thum.io/get/width/1200/crop/750/$url"
    if [[ "$(file -b "$png")" == PNG* ]]; then
      sips -s format jpeg -s formatOptions 80 "$png" --out "assets/sites/$name.jpg" >/dev/null
      rm -f "$png"
      echo "ok   $name $(du -h "assets/sites/$name.jpg" | cut -f1)"
      break
    fi
    # thum.io sometimes answers with a placeholder GIF while it renders.
    rm -f "$png"
    if (( attempt == 3 )); then
      echo "FAIL $name"
    else
      sleep 4
    fi
  done
done
