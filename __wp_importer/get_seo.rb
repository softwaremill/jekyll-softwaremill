#!/usr/bin/env ruby

require 'nokogiri'
require 'shellwords'

def get_meta doc, dump_file, id, tag_name
  css = "meta[name='#{tag_name}']"
  node = doc.css css
  value = node[0]
  if value.nil?
    puts "#{css} does not exist for ID #{id} in #{dump_file}"
    throw :next
  end

  html = value.attr 'content'
  if html.nil? or html.empty?
    puts "#{css} empty for ID #{id} in #{dump_file}"
    throw :next
  end

  html
end

Dir['../_posts/company/*.markdown'].each do |post_file|
  catch :next do
    File.open post_file, 'r' do |f|
      f.each_line do |line|
        next unless line.include? 'wordpress_id'
        id = line.match('wordpress_id: (\d+)')[1]

        dump_file = "dumps/#{id}.html"
        unless File.exist? dump_file
          puts "#{post_file}: Content file for ID #{id} does not exist: #{dump_file}"
          throw :next
        end

        description, keywords = File.open dump_file, 'r' do |f|
          doc = Nokogiri::HTML f
          description = get_meta doc, dump_file, id, 'description'
          keywords =  get_meta doc, dump_file, id, 'keywords'
          [description, keywords]
        end

        description = description.gsub '"', '\"'
        keywords = keywords.gsub '"', '\"'

        puts `sed -i '/title: /a keywords: "#{keywords}"' #{post_file}` unless keywords.empty?
        puts `sed -i '/title: /a description: "#{description}"' #{post_file}`

        throw :next
      end
    end
  end
end

