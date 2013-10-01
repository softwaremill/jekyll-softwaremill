#!/usr/bin/env zsh

cd `dirname "$0"`

log() {
  echo "[`date --rfc-3339=seconds`] $1" >> log
}

log "Generate triggered"
for file in twitter-blog twitter-home; do
  tmp="../_includes/generated/$file.html.tmp"
  dest="../_includes/generated/$file.html"

  php "$file.php" > "$tmp"

  if [ $? -eq 0 ]; then
    cp "$tmp" "$dest"
    log "$file generated"
  else
    log "$file FAILED"
  fi
  rm "$tmp"
done
