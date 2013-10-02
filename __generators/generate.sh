#!/usr/bin/env bash

cd `dirname "$0"`

log() {
  echo "[`date --rfc-3339=seconds`] $1" | tee log
}

finish() {
  if [ $1 -eq 0 ]; then
    cp "$tmp" "$dest"
    log "$2 generated"
  else
    log "$2 FAILED"
  fi
  rm "$tmp"
}


log "Generate triggered"
for file in twitter-blog twitter-home; do
  tmp="../_includes/generated/$file.html.tmp"
  dest="../_includes/generated/$file.html"

  php "$file.php" > "$tmp"
  finish "$?" "$file"
done


for tuple in home:1 blog:30; do
  read file limit <<< $(IFS=':'; echo $tuple)

  tmp="../_includes/generated/team-posts-$file.html.tmp"
  dest="../_includes/generated/team-posts-$file.html"

  bundle exec ./team-posts.rb $limit > "$tmp"
  finish "$?" "team-posts"
done
