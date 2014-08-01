#!/usr/bin/env ruby

require 'json'
require 'tilt'
require 'action_view'
require 'action_view/helpers'
require 'rmagick'

include Magick

json_config = `php php2json.php`
people = JSON.parse json_config

people.each_with_index { |person, idx |
  img = Image.read("../img/members/"+person['image'])[0]
  pixel = img.get_pixels(0,0,1,1)[0]
  if pixel.blue > pixel.green
      person['color'] = 'blue'
  else
      person['color'] = 'green'
  end
}

class Context
  include ActionView::Helpers::NumberHelper
  include ActionView::Helpers::AssetTagHelper
  include ActionView::Helpers::UrlHelper
end

template = Tilt.new 'meet-team.html.erb'
puts template.render Context.new, :people => people
