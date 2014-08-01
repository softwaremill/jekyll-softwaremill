#!/usr/bin/env ruby

require 'json'
require 'tilt'
require 'action_view'
require 'action_view/helpers'

json_config = `php php2json.php`
people = JSON.parse json_config

coding_years = 0
conference_organizers = 0
open_source_contributors = 0
active_bloggers = 0
parents = 0
community_coleaders = 0
team_members = 0

people.each do |person|
  unless person['codingSince'].nil?
    coding_years += Time.now.year - person['codingSince'].to_i
  end
  unless person['leader'].nil?
    community_coleaders += person['leader']
  end
  unless person['opensource'].nil?
    open_source_contributors += person['opensource']
  end
  unless person['blogger'].nil?
    active_bloggers += person['blogger']
  end
  unless person['parent'].nil?
    parents += person['parent']
  end
  unless person['conference'].nil?
    conference_organizers += person['conference']
  end
  team_members += 1
end

class Context
  include ActionView::Helpers::NumberHelper
  include ActionView::Helpers::AssetTagHelper
  include ActionView::Helpers::UrlHelper
end

template = Tilt.new 'stats.html.erb'
puts template.render Context.new, :coding_years => coding_years, :conference_organizers => conference_organizers,
                   :open_source_contributors => open_source_contributors, :active_bloggers => active_bloggers,
                   :parents => parents, :community_coleaders => community_coleaders, :team_members => team_members
