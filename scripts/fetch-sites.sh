#!/bin/zsh
# Pulls placeholder screenshots for the marquee (replace with real work later).
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
)

for item in $sites; do
  name="${item%%|*}"
  url="${item#*|}"
  out="assets/sites/$name.png"
  code=$(curl -sL --max-time 60 -o "$out" -w "%{http_code}" "https://image.thum.io/get/width/1200/crop/750/$url")
  kind=$(file -b "$out")
  if [[ "$kind" != PNG* ]]; then
    echo "FAIL $name $code $kind"
    rm -f "$out"
    continue
  fi
  sips -s format jpeg -s formatOptions 80 "$out" --out "assets/sites/$name.jpg" >/dev/null
  rm -f "$out"
  echo "ok $name $(du -h "assets/sites/$name.jpg" | cut -f1)"
  sleep 1
done
