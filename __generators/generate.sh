#!/usr/bin/env zsh

cd `dirname "$0"`

php twitter-blog.php > ../_includes/generated/twitter-blog.html
php twitter-home.php > ../_includes/generated/twitter-home.html
