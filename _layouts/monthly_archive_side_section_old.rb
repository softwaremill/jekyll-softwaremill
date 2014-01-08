module Jekyll

  class ArchiveSectionPage < Page
    def initialize(site, base, dir)
      @site = site
      @base = base
      @dir = dir
      @name = 'archives-post-section.html'
      @content = 'I am the Content'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'archive_section.html')
      @header_data = 'Test Header'
    end
  end

  class CategoryPageGenerator < Generator
    safe true

    ATTRIBUTES_FOR_LIQUID = %w[
      content,
      month,
      month_year_string,
      date,
      content
    ]

    def generate(site)
        page_item = ArchiveSectionPage.new(site, site.source, '_includes/')
        page_item.render(site.layouts, site.site_payload)
        page_item.write(site.dest + "/../")

        site.pages << page_item
    end

    def render(layouts, site_payload)
      puts 'render'
      payload = {
          'page' => self.to_liquid,
          'paginator' => pager.to_liquid
      }.deep_merge(site_payload)
      do_layout(payload, layouts)
    end

    def to_liquid(attr = nil)
      puts "content " + self.content
      self.data.deep_merge({
                               'content' => 'I am content',
                               'header_data' => 'XYZ Test'
                           })
    end
  end

end