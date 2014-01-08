#!/usr/bin/env bash
cd `dirname "$0"`/..

export LANG="en_US.UTF-8"
PATH="$PATH:~/.gem/ruby/1.9.1/bin"

# Clear archive months list placeholder so Git does not complain
rm ./_includes/generated/archive-months-list.html
git pull
./__generators/generate.sh
# Create placeholder so jekyll has something to include
touch ./_includes/generated/archive-months-list.html

jekyll build

# First jekyll build uses empty archive-months-list.html as proper one is generated after inclusion is performed.
# So we launch build process again so it could include proper archive-months-list.html generated in the late phase
# of first jekyll build.
jekyll build

