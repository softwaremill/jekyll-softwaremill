#!/usr/bin/env bash
cd `dirname "$0"`/..

export LANG="en_US.UTF-8"
PATH="$PATH:~/.gem/ruby/1.9.1/bin"

git pull
./__generators/generate.sh
jekyll build

