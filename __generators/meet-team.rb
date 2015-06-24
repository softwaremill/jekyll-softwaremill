#!/usr/bin/env ruby

require 'json'
require 'tilt'
require 'action_view'
require 'action_view/helpers'
require 'RMagick'

include Magick

json_config = `php php2json.php`
people = JSON.parse json_config

people.each_with_index { |person, idx |
  if idx % 2 == 0
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
