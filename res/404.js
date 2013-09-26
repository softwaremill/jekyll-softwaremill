(function() {
    var invaders;
    var gamepad;
    var $splash = $('.splash-404');
    var $score = $('.score .ctr');
    var $credit = $('.credit .ctr');
    var score = 0;
    var credit = 99;

    window.addEventListener("MozGamepadConnected", function(e) {
      gamepad = new Input.Device(e.gamepad);
    });

    function play() {
        $splash.css({
            display : 'none',
            opacity : 0
        });

        credit--;
        if (credit < 0) {
            credit = 99;
        }
        $credit.html(credit);

        score = 0;
        $score.html(score);

        invaders.start();
    }

    function showSplash() {
        invaders.drawSplash(function() {
            $splash.removeClass('win');
            $splash.css({
                display : 'block'
            });

            setInterval(function() {
                var opa = parseFloat($splash.css('opacity')) || 0;
                if (opa < 1) {
                    $splash.css('opacity', opa + 0.2);
                }
            }, 200);
        });
    }

    function showSplashWin() {
        invaders.drawSplash(function() {
            $splash.addClass('win');
            $splash.css({
                display : 'block'
            });

            setInterval(function() {
                var opa = parseFloat($splash.css('opacity')) || 0;
                if (opa < 1) {
                    $splash.css('opacity', opa + 0.2);
                }
            }, 200);
        });
    }

    function initInvaders404() {
        invaders = new Invaders404({
            onLoose: function() {
                showSplash();
            },
            onWin: function() {
                showSplashWin();
            },
            onScore: function() {
                score++;
                $score.html(score);
            }
        });

        invaders.start();
    }

    $(window).load(function() {
        initInvaders404();
    });

    $splash.click(function() {
        play();
    });

})();
