(function($, undefined){
	$(window).load(function() {

		if ($(window).width() > 1024){

			var $agile = $('#services .agile');
			if (!$agile.length) {
				return;
			}
			var sprites = {
				$yourIdea              : $agile.find('.sprite.your-idea'),
				$yourIdeaToBacklog     : $agile.find('.sprite.your-idea-to-backlog.arrow'),
				$backlog               : $agile.find('.sprite.backlog:not(.over)'),
				$backlogOver           : $agile.find('.sprite.backlog.over'),
				$backlogToCaat         : $agile.find('.sprite.backlog-to-caat.arrow'),
				$caat                  : $agile.find('.sprite.caat:not(.over)'),
				$caatOver              : $agile.find('.sprite.caat.over'),
				$caatToDemo            : $agile.find('.sprite.caat-to-demo.arrow'),
				$demo                  : $agile.find('.sprite.demo:not(.over)'),
				$demoOver              : $agile.find('.sprite.demo.over'),
				$demoToShipit          : $agile.find('.sprite.demo-to-shipit.arrow'),
				$shipit                : $agile.find('.sprite.shipit:not(.over)'),
				$shipitOver            : $agile.find('.sprite.shipit.over'),
				$shipitToBacklog       : $agile.find('.sprite.shipit-to-backlog.arrow'),
				$shfbk                 : $agile.find('.sprite.shfbk'),
				$greatProduct          : $agile.find('.sprite.great-product'),
				$backlogToGreatProduct : $agile.find('.sprite.backlog-to-great-product.arrow'),
				$scrollDown            : $agile.find('.sprite.scroll-down')
			};

			$agile.find('.sprite').css({
				display: 'block',
				opacity: 0
			});

			var timeline = new TimelineMax;
			var baseDuration = 200;

			timeline.makeBlockAnimation = function($block, $blockOver) {
				this.add(TweenMax.fromTo($block.get(0), baseDuration, {
					useFrames : true,
					paused    : true,
					css       : {
						opacity             : 0,
						scale               : .8
						// backgroundPositionY : '200%'
					}
				}, {
					//ease  : 'Back.easeOut',
					css   : {
						opacity             : 1,
						scale               : 1
						// backgroundPositionY : '50%'
					}
				}));

				this.add(TweenMax.fromTo($blockOver.get(0), 0, {
					useFrames : true,
					paused    : true,
					css       : {
						display    : 0,
						marginTop  : 0,
						marginLeft : 0
					}
				}, {
					//ease : 'Back.easeOut',
					delay : baseDuration*2,
					css  : {
						opacity    : 1,
						marginTop  : $blockOver.css('margin-top'),
						marginLeft : $blockOver.css('margin-left')
					}
				}));

				// this.add(TweenMax.fromTo($blockOver.get(0), baseDuration, {
				// 	useFrames : true,
				// 	paused    : true,
				// 	css       : {
				// 		backgroundPositionY: '-200%'
				// 	}
				// }, {
				// 	//ease : 'Back.easeOut',
				// 	css  : {
				// 		backgroundPositionY: '50%'
				// 	}
				// }));
			};

			timeline.makeFadeAnimation = function($element) {
				this.add(TweenMax.fromTo($element.get(0), baseDuration, {
					useFrames : true,
					paused    : true,
					ease      : Power1.easeInOut,
					css       : {
						opacity   : 0
					}
				}, {
					delay : baseDuration*2,
					css   : {
						opacity   : 1
					}
				}));
			};

			timeline.add(TweenMax.fromTo(sprites.$shfbk.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					opacity : 0,
					scale   : .8
				}
			}, {
				delay: baseDuration*1,
				css  : {
					opacity : 1,
					scale   : 1
				}
			}));

			timeline.add(TweenMax.fromTo(sprites.$scrollDown.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					opacity : 1
				}
			}, {
				delay: baseDuration*1,
				css       : {
					opacity : 0
				}
			}));

			timeline.add(TweenMax.fromTo(sprites.$yourIdea.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					opacity : 0,
					scale   : .8
				}
			}, {
				//ease : 'Back.easeOut',
				css  : {
					opacity : 1,
					scale   : 1
				}
			}));

			timeline.add(TweenMax.fromTo(sprites.$yourIdeaToBacklog.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					opacity   : 0,
					marginTop : -10
				}
			}, {
				//ease : 'Power1.easeInOut',
				css  : {
					opacity   : 1,
					marginTop : 0
				}
			}));

			timeline.makeBlockAnimation(sprites.$backlog, sprites.$backlogOver);
			timeline.makeFadeAnimation(sprites.$backlogToCaat);
			timeline.makeBlockAnimation(sprites.$caat, sprites.$caatOver);
			timeline.makeFadeAnimation(sprites.$caatToDemo);
			timeline.makeBlockAnimation(sprites.$demo, sprites.$demoOver);
			timeline.makeFadeAnimation(sprites.$demoToShipit);
			timeline.makeBlockAnimation(sprites.$shipit, sprites.$shipitOver);
			timeline.makeFadeAnimation(sprites.$shipitToBacklog);

			timeline.add(TweenMax.fromTo(sprites.$yourIdeaToBacklog.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					// opacity : 1
				}
			}, {
				//ease : 'Power1.easeInOut',
				css  : {
					opacity : 0
				}
			}));

			timeline.add(TweenMax.fromTo(sprites.$yourIdea.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					// opacity : 1,
					scale   : 1
				}
			}, {
				//ease : 'Back.easeIn',
				css  : {
					opacity : 0,
					scale   : .8
				}
			}));

			timeline.add(TweenMax.fromTo(sprites.$backlogToGreatProduct.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					opacity   : 0,
					marginTop : 10
				}
			}, {
				//ease : 'Power1.easeInOut',
				css  : {
					opacity   : 1,
					marginTop : 0
				}
			}));

			timeline.add(TweenMax.fromTo(sprites.$greatProduct.get(0), baseDuration, {
				useFrames : true,
				paused    : true,
				css       : {
					opacity : 0,
					scale   : .8
				}
			}, {
				//ease : 'Back.easeOut',
				css : {
					opacity : 1,
					scale   : 1
				}
			}));

			var $w = $(window);

			var $body = $('body');
			var $wrapper = $('<div>');
			$body.children().appendTo($wrapper);
			$wrapper.appendTo($body);

			var agileOffset = 10;
			var agileEarlyStart = $agile.outerHeight();
			var agileTop = $agile.offset().top - agileOffset;
			var timelineDuration = timeline.duration() + baseDuration + agileOffset;

			$('body').css({
				height : (timelineDuration + $('body').height() - agileEarlyStart)+'px'
			});

			$('html').addClass('agile-animation-injected');

			$wrapper.css({
				top      : 0,
				left     : 0,
				right    : 0
			}).addClass('agile-fixed-wrapper');

			$body.append('<div class="wrapper"></div>');

			var onScroll = function(top) {
				top = $w.scrollTop();

				if (top <= agileTop) {
					$wrapper.css('top', -top);
				} else if (top >= agileTop + timelineDuration - agileEarlyStart) {
					$wrapper.css('top', -top + timelineDuration - agileEarlyStart);
				} else {
					$wrapper.css('top', -agileTop);
				}

				if (top <= agileTop - agileEarlyStart) {
					timeline.seek(1);
					$agile.css('visibility', 'hidden');
				} else if (top >= agileTop + timelineDuration - agileEarlyStart) {
					timeline.seek(timelineDuration);
					$agile.css('visibility', 'visible');
				} else {
					$agile.css('visibility', 'visible');
					timeline.seek(top - agileTop + agileEarlyStart);
				}
			};
			$w.scroll(onScroll);
			onScroll();

			if (document.location.hash.replace('#', '') == 'how-we-work') {
				var offset = Math.max($('#how-we-work').offset().top, 0);
				$('html,body').animate({
					scrollTop: offset
				},1000, 'easeOutExpo', function(){
					$('html,body').scrollTop(offset);
				});
			}

		}

	});

})(window.jQuery);

