  $('#toc').toc({
    'selectors': 'h1', //elements to use as headings
    'container': '.text', //element to find all selectors in
    'smoothScrolling': true, //enable or disable smooth scrolling on click
    'prefix': 'toc', //prefix for anchor tags and class names
    'highlightOnScroll': true, //add class to heading that is currently in focus
    'highlightOffset': 100 //offset to trigger the next headline
  });
  $(function() {
    if ($(window).scrollTop() > ($('.text').offset().top + $('.text').outerHeight() - $('.toc').outerHeight()) ) {
      $('.toc').addClass('stick-bottom');
    } else if ($(window).scrollTop() > $('.text').offset().top) {
      $('.toc').addClass('fixed');
    } else {
      $('.toc').addClass('stick-top');
    }

    $(document).on("scroll", function() {
      if ($(window).scrollTop() > ($('.text').offset().top + $('.text').outerHeight() - $('.toc').outerHeight()) ) {
        $('.toc').removeClass('stick-top').removeClass('fixed').addClass('stick-bottom');
      } else if ($(window).scrollTop() > $('.text').offset().top) {
        $('.toc').removeClass('stick-top').removeClass('stick-bottom').addClass('fixed');
      } else {
        $('.toc').removeClass('stick-bottom').removeClass('fixed').addClass('stick-top');
      }
    });
  })