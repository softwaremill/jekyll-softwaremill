#!/usr/bin/env ruby

require 'json'
require 'tilt'
require 'action_view'
require 'action_view/helpers'

json_config = `php php2json.php`
people = JSON.parse json_config

people.each_with_index { |person, idx |
  case idx % 4
    when 0,3
      person['color'] = 'blue'
    when 1,2
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
