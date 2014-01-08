# Jekyll Module to create 'Archives' section displayed in the right column of every blog post
#
# Author: Tomek Dziurko

module Jekyll

  # Generator class invoked from Jekyll
  class MonthlyArchiveGenerator < Generator
    priority :highest

    def generate(site)
      year_month_month_string = []
      posts_group_by_year_and_month(site).each do |ym, list|
        year_month_month_string << [ym[0], "%02d" % ym[1], Date::MONTHNAMES[ym[1]].to_s]
      end

      site.pages << MonthlyArchiveSectionPage.new(site, year_month_month_string.reverse!)
    end

    def posts_group_by_year_and_month(site)
      site.posts.each.group_by { |post| [post.date.year, post.date.month] }
    end

  end

  # Actual page instances
  class MonthlyArchiveSectionPage < Page
    def initialize(site, year_month_month_string_array)

      @site = site
      @archive_dir_name = '/../_includes/generated'

      @layout =  'archive_section'
      self.content = <<-EOS
        {% for data in page.months_with_posts %}
          <li>
            <a href='https://softwaremill.com/{{data[0]}}/{{data[1]}}/' title='{{data[2]}} {{data[0]}}'>{{data[2]}} {{data[0]}}</a>
          </li>
        {% endfor %}
      EOS
      self.data = {
          'layout' => @layout,
          'months_with_posts' => year_month_month_string_array
      }
    end

    def to_liquid(attr = nil)
      self.data.deep_merge(
          {
              'content' => self.content
          }
      )
    end

    def destination(dest)
      File.join('/', dest, @archive_dir_name, 'archive-months-list.html')
    end

  end
end
