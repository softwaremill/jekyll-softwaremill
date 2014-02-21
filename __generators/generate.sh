#!/usr/bin/env bash

cd `dirname "$0"`

log() {
	if [[ `uname` == 'Darwin' ]]; then
		echo "[`date`] $1" | tee -a log
	else
		echo "[`date --rfc-3339=seconds`] $1" | tee -a log
	fi
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
  [ -f "$tmp" ] && (log 'still in progress, skipped'; break)

  php "$file.php" > "$tmp"
  finish "$?" "$file"
done


for tuple in home:1 blog:30; do
  read file limit <<< $(IFS=':'; echo $tuple)

  tmp="../_includes/generated/team-posts-$file.html.tmp"
  dest="../_includes/generated/team-posts-$file.html"
  [ -f "$tmp" ] && (log 'still in progress, skipped'; break)

  bundle exec ./team-posts.rb $limit > "$tmp"
  finish "$?" "team-posts"
done
