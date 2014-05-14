// remap jQuery to $
(function($){})(window.jQuery);


/* trigger when page is ready */
$(document).ready(function (){

	if ($.cookie("cookie-agree") == 'true'){
		$('.cookies').css('display', 'none');
	}

	$('.cookies-agree').click(function(event){
		event.preventDefault();
		$.cookie("cookie-agree", "true", { path: '/' });
		$('.cookies').css('display', 'none');
	});

	/*$('#baner .block').not(':last-child').hover(function(){
		$('#baner').toggleClass('switch');
	}, function() {

	}); */

	$('#contact-form').submit(function(e) {
		e.preventDefault();
		var form = $(this);
		if ( form.find('input[name=name]').val() != '' &&  form.find('input[name=email]').val() != '' && form.find('textarea').val() != ''){
			form.addClass('loading').removeClass('submitted');
			form.find('input,textarea').attr('readonly','readonly');
			form.find('.error,.success').fadeOut(0);
			
			try{ _gaq.push(['_trackPageview', '/cele/formularz']); }catch(e){ }

			$.ajax({
				url: form.attr('action'),
				type: form.attr('method'),
				data: form.serialize(),
				dataType: 'json',
				success: function(response) {
					form.removeClass('loading');
					form.find('input[type=text],input[type=email],textarea').removeAttr('readonly');
					if (response == 1) {
						form.find('input[type=text],input[type=email],textarea').val('');
						form.find('.success').fadeIn().delay(5000).fadeOut();
					} else {
						form.find('.error').fadeIn().delay(5000).fadeOut();
					}
					form.removeClass('submitted');

				}
			});
		}else{
			form.find('.error').fadeIn().delay(5000).fadeOut();
		}
	});

	$('form.newsletter').submit(function(e) {
		e.preventDefault();
		var form = $(this);

		form.addClass('loading').removeClass('submitted');
		form.find('input,textarea').attr('readonly','readonly');
		form.find('.message').fadeOut(0);

		try{ _gaq.push(['_trackPageview', '/cele/newsletter']); }catch(e){ }
		
		$.ajax({
			url: form.attr('action'),
			type: form.attr('method'),
			data: form.serialize(),
			dataType: 'json',
			success: function(response) {
				form.removeClass('loading');
				form.find('input[type=text],input[type=email],textarea').removeAttr('readonly');
				if (response.result == true) {
					form.find('input[type=text],input[type=email],textarea').val('');
					form.find('.message').html(response.message).fadeIn().delay(5000).fadeOut();
				} else {
					form.find('.message').html(response.message).fadeIn().delay(5000).fadeOut();
				}
				form.removeClass('submitted');
			}
		});
	});

	$('#baner-home .clickable').click(function(){
		$(this).addClass('active');
		if ($(this).hasClass('resize-claim')){
			$(this).parents('.baner').find('.claim').addClass('small');
		}
	});


	$('.blog-list-link').click(function(event){
		event.preventDefault();

		if ( $(this).parent().find('.blog-list-container').hasClass('show') ){
			$(this).html('See all');
		}else{
			$(this).html('Close');
		}
		$(this).parent().find('.blog-list-container').toggleClass('show');
		$(this).parent().find('nav').toggleClass('show');

		var offset = Math.max($(this).parents('section').offset().top, 0);
		$('html,body').animate({
			scrollTop: offset
		},600, 'easeOutExpo', function(){
			$('html,body').scrollTop(offset);
		});
	});

	$('.work-item .read-more, .work-item .title-read-more').click(function(event){
    event.preventDefault();

    var workItem = $(this).closest('.work-item');

    if (workItem.hasClass('open')) {
      workItem.find('.close').click();
    } else {
      workItem.addClass('open');
      workItem.find('.content').slideDown('slow');
    }
  });


	$('.work-item .close').click(function(event){
		event.preventDefault();
		$(this).parent().removeClass('open');
		$(this).parent().find('.content').slideUp('slow');
	});


	/* HOME */
	$('#baner-home').cycle({
		fx: 'fade',
		speed: 1000,
		timeout:  0,
		speed: 0,
		easing: 'easeOutExpo',
		prev: '#baner-nav .prev',
		next: '#baner-nav .next',
		before:  function(currSlideElement, nextSlideElement, options, forwardFlag){
			$(nextSlideElement).find('.appear').css('display', 'none')
		},
		after: function(currSlideElement, nextSlideElement, options, forwardFlag){

			$('#baner-home .clickable').removeClass('active');
			$('#baner-home .claim').removeClass('small');
			var maxAppear = 0;
			$(nextSlideElement).find('.appear').each(function(){
				var appear = $(this).attr('data-appear')-1;
				$(this).delay(appear*800).fadeIn(800);
				if (appear > maxAppear){
					maxAppear = appear;
				}
			});

			if ($(nextSlideElement).hasClass('top01')){
				$(nextSlideElement).find('.clickable').each(function(){
					var color = $(this).css('background-color');
					var order = parseInt($(this).attr('data-order'))-1;
					var appear = parseInt($(this).attr('data-appear'))-1;
					var $figure = $(this).find('figure');

					setTimeout(function() {
						$figure.addClass('highlight');
						setTimeout(function() {
							$figure.removeClass('highlight');
						}, 450);
					}, maxAppear*800+order*800+appear*800);


					// $(this).find('figure').delay(maxAppear*800+order*800+appear*800).animate({
					// 	opacity: 0
					// }, 300, function(){
					// 	$(this).delay(150).animate({
					// 		opacity: 1
					// 	}, 350);
					// });
				});
			}
		}
	});

	$('#blogs-slider').cycle({
		fx: 'fade',
		speed: 600,
		timeout:  0,
		easing: 'easeOutExpo',
		prev: '#blogs-slider-nav .prev',
		next: '#blogs-slider-nav .next'
	});

	$('#members-blogs-slider').cycle({
		fx: 'fade',
		speed: 600,
		timeout:  0,
		easing: 'easeOutExpo',
		prev: '#members-blogs-slider-nav .prev',
		next: '#members-blogs-slider-nav .next'
	});

    $('#members-presentations-slider').cycle({
        fx: 'fade',
        speed: 600,
        timeout:  0,
        easing: 'easeOutExpo',
        prev: '#members-presentations-slider-nav .prev',
        next: '#members-presentations-slider-nav .next'
    });

	var now = new Date();
	var startSlide = parseInt((now.getMonth() + 3) / 3);
	var div = $('div[data-quarter="'+startSlide+'-'+now.getFullYear()+'"]').index();
	var isFirstTime = true;
	$('.timeline-slider').cycle({
		fx: 'fade',
		speed: 1000,
		timeout:  0,
		startingSlide: div,
		easing: 'easeOutExpo',
		prev: '.timeline nav .prev',
		next: '.timeline nav .next',
		after: function() {
			if (isFirstTime) {
				isFirstTime = false;
			} else {
				if ($(window).width() <= 1024) {
					var offset = Math.max($('.timeline-slider').offset().top - 60, 0);
					$('html,body').animate({
						scrollTop: offset
					},600, 'easeOutExpo', function(){
						$('html,body').scrollTop(offset);
					});
				}
			}
		}
	});

	$('.cases').cycle({
		fx: 'scrollHorz',
		speed: 1000,
		timeout:  0,
		easing: 'easeOutExpo',
		prev: '.cases-nav .prev',
		next: '.cases-nav .next'
	});

	$('.twitter-slider').cycle({
		fx: 'scrollHorz',
		speed: 1000,
		timeout:  0,
		easing: 'easeOutExpo'
	});

	$('.twitter-nav .prev, .twitter-nav .next').click(function(event){
		event.preventDefault();
		var self = $(this);
		$('.tweet').each(function(){
			if ($(this).css('display') == 'block'){
				$(this).find('figure').addClass('rotate');
			}
		});

		if (self.hasClass('prev')){
			setTimeout(function(){
				$('.twitter-slider').cycle('prev');
			}, 600);
			setTimeout(function(){
				$('.tweet').each(function(){
					if ($(this).css('display') == 'block' && $(this).find("figure").hasClass("rotate")){
						$(this).find('figure').removeClass('rotate');
					}
				});
			}, 1100);
		}else{
			setTimeout(function(){
				$('.twitter-slider').cycle('next');
			}, 600);
			setTimeout(function(){
				$('.tweet').each(function(){
					if ($(this).css('display') == 'block' && $(this).find("figure").hasClass("rotate")){
						$(this).find('figure').removeClass('rotate');
					}
				});
			}, 700);
		}

	});

	$('.our-tweets').cycle({
		fx: 'scrollHorz',
		speed: 1000,
		timeout:  0,
		easing: 'easeOutExpo',
		prev: '.our-tweets-nav .prev',
		next: '.our-tweets-nav .next',
		timeout: 0
	});

	$('.our-teams-tweets').cycle({
		fx: 'scrollHorz',
		speed: 1000,
		timeout:  0,
		easing: 'easeOutExpo',
		prev: '.our-teams-tweets-nav .prev',
		next: '.our-teams-tweets-nav .next',
		timeout: 0
	});

if ($(window).width() > 1024){
	$('.cases .case').each(function() {
		var $case     = $(this);
		var $view     = $('.cases-views .view[case="' + $case.attr('case') +'"]');
		var isHover   = false;
		var isVisible = false;
		var timeout   = null;

		function over() {
			isHover = true;
			if (timeout !== null) {
				clearTimeout(timeout);
				timeout = null;
			}

			if (!isVisible) {
				$view.stop(true, true).css({
					'display': 'block',
					'opacity': 0,
					'margin-top': $case.index()%2 ? -20 : 20
				}).animate({
					'opacity': 1,
					'margin-top': 0
				});
			}

			isVisible = true;
		}

		function out() {
			isHover = false;
			if (timeout !== null) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(function() {
				timeout = null;

				if (!isHover) {
					isVisible = false;
					$view.fadeOut();
				}
			}, 10);

		}

		$view.hover(over, out);
		$case.hover(over, out);
	});
}






	/* THE TEAM*/

	$('.member .description p:last-child').append('<a class="more-info"></a>');

	$('#our-team').css('height', $('#our-team').innerHeight()-60);

	(function() {
		var wh = $(window).height();
		var fold = wh - 170;
		var st;
		if($.browser.webkit){
			var $body = $("body");
		}else{
			var $body = $("html,body");
		}
		var $members = $('.member');

		function scaleMembers() {
			st = $body.scrollTop();
			$members.each(function() {
				var $member = $(this);
				var ot = $member.offset().top;
				var add = parseInt($member.attr('member'))%2 ? 30 : 0;
				if (ot - st - (fold + add) > 0) {
					$member.addClass('small');
				} else {
					$member.removeClass('small');
				}
			});
		}

		$(document).scroll($.throttle(100, scaleMembers));
		$(window).resize($.throttle(100, function() {
			wh = $(window).height();
			fold = wh - 100;
		}));
		scaleMembers();
	})();

	/* SUBMENU */
	$(document).scroll(function(){
		if($.browser.webkit) bodyelem = $("body")
		else bodyelem = $("html,body")
		var top = bodyelem.scrollTop();

		if (top > 520){
			if (!$('#submenu nav').hasClass('fixed')){
				$('#submenu nav').addClass('fixed');
			}
		}else{
			$('#submenu nav').removeClass('fixed');
		}
	});

	$('#submenu nav ul a').click(function() {
		var href = $(this).attr('href');
		if (href.indexOf('#') >= 0) {
			$('#submenu nav li').removeClass('active');
			$(this).parent().addClass('active');
			var offset = Math.max($(href).offset().top, 0)-50;
			$('html,body').animate({
				scrollTop: offset
			},1000, 'easeOutExpo', function(){
				$('html,body').scrollTop(offset);
			});
			return false;
		}
	});

	$('#submenu nav .top').click(function() {
		$('#submenu nav li').removeClass('active');
		var offset = 0;
		$('html,body').animate({
			scrollTop: offset
		},1000, 'easeOutExpo', function(){
			$('html,body').scrollTop(offset);
		});
		return false;
	});



	/* TEAM MEMBERS */
	$('.member').click(function(){
		$('.member').removeClass('active');
		$('.member-more').css('display', 'none');
		$(this).addClass('active');
		$(this).parent().find('.member-more').fadeIn(300);
	});

	$('.member-more .close').click(function(event){
		event.preventDefault();
		$(this).parent().fadeOut(function(){
			$('.member').removeClass('active');
		});
	});

	$('.member').each(function(){
		$(this).append('<div class="triangle"></div>');
	});

});


$(window).load(function() {
	$('#coming-events').css('min-height', ($(window).height() - $('footer').outerHeight() - $('aside').outerHeight()-160)+'px');
	$('#baner').addClass('loaded');
	$('body').addClass('loaded');
});

$(window).resize(function() {
	$('#coming-events').css('min-height', ($(window).height() - $('footer').outerHeight() - $('aside').outerHeight()-160)+'px');
});