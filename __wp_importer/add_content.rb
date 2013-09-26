#!/usr/bin/env ruby

require 'nokogiri'

%x[mkdir -p ../_posts/company]
Dir['_posts/*.markdown'].each do |post_file|
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

        content = File.open dump_file, 'r' do |f|
          doc = Nokogiri::HTML f
          node = doc.css('div.post-content div.post')
          value = node[0]
          if value.nil?
            puts "div.post-content does not exist for ID #{id} in #{dump_file}"
            throw :next
          end

          html = value.inner_html
          if html.nil? or html.empty?
            puts "div.post-content empty for ID #{id} in #{dump_file}"
            throw :next
          end
              
          html
        end

        post_file_name = File.basename f
        new_post_file = "../_posts/company/#{post_file_name}"
        
        if File.exist? new_post_file
          puts "Output post: #{new_post_file} already exists. Skipping."
          throw :next
        end

        %x[cp #{post_file} #{new_post_file}]

        File.open new_post_file, 'a' do |f|
          f.puts content
        end
        
        throw :next
      end
    end
  end  
end

