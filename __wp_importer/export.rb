#!/usr/bin/env ruby

# Creates _posts/ with all the posts in current working directory.

require "jekyll/jekyll-import/wordpress"

JekyllImport::WordPress.process({:dbname => "softwaremill_2013", :user => "demo", :pass => "n9srUFpgF55jbzj7jcBPC0"})
