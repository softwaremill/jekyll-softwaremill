#!/usr/bin/env ruby

require 'active_support'
require 'feedzirra'
require 'json'
require 'columbus'
require 'tilt'
require 'action_view'
require 'action_view/helpers'
require 'sanitize'

class Entry
  def initialize entry, feed, url, person
    @entry = entry
    @feed = feed
    @url = url
    @person = person
  end

  def to_s
    author = (@feed.respond_to? :author) ? @feed.author : @url
    author + ': ' + @entry.title
  end

  def method_missing method_name
    return @entry.send method_name if @entry.respond_to? method_name
    return @feed.send method_name if @feed.respond_to? method_name
    "Not found: #{method_name}"
  end

  def excerpt
    summary = if @entry.summary.nil?
      Sanitize.clean @entry.content
    else
      Sanitize.clean(@entry.summary.sanitize).split('&hellip;')[0].strip + '...'
    end
    Class.new.extend(ActionView::Helpers::TextHelper).truncate summary, length: 150, separator: ' '
  end

  def author
    @person['name']
  end

  def username
    @person['username']
  end
end

json_config = `php php2json.php`
people = JSON.parse json_config

entries = []

people.each do |person|
  next if person['blog'].nil?
  person['feed'] = Columbus.new(person['blog']).primary.url rescue nil
end

feed_urls = people.reject { |person| person['feed'].nil? }.map { |person| person['feed'] }

# limit for test
# feed_urls = [feed_urls.first]

feeds = Feedzirra::Feed.fetch_and_parse feed_urls

feeds.each do |url, blog|
  next if blog.is_a? Integer
  person = people.find { |person| person['feed'] == url }
  blog.entries.each do |entry|
    entries << Entry.new(entry, blog, url, person)
  end
end

entries.sort_by! { |e| e.published }.reverse!

limit = ARGV[0].to_i || 30
entries = entries.first limit


class Context
  include ActionView::Helpers::NumberHelper
  include ActionView::Helpers::AssetTagHelper
  include ActionView::Helpers::UrlHelper
end

template = Tilt.new 'blogs.html.erb'
puts template.render Context.new, :entries => entries
