/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();
/**
 * @author pjnovas
 */

function Controls() { throw 'Controls class is Static.'; };
Controls.Left = "Left";
Controls.Right = "Right";
Controls.Shoot = "Shoot";

function Keyboard() { throw 'KeyboardCode class is Static.'; };
Keyboard.Left = 37;
Keyboard.Right = 39;
Keyboard.Up = 38;
Keyboard.Down = 40;
Keyboard.Space = 32;
/**
 * @author pjnovas
 */

function ImageMapper() { throw 'ImageMapper class is Static.'; };
ImageMapper.Ship = function(){
	return [
		[0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
		[0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
		[0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
		[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
		[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
		[0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0],
		[0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0],
		[0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0]
	];
};
ImageMapper.ShipShoot = function(){
	return [
		[1],
		[1],
		[1],
		[1],
		[1],
		[1],
		[1]
	];
};
ImageMapper.Invasion = function(){
	return [
		[1,0,1,0,2,2,2,0,3,0,3],
		[1,1,1,0,2,0,2,0,3,3,3],
		[0,0,1,0,2,0,2,0,0,0,3],
		[0,0,1,0,2,2,2,0,0,0,3]
	];
};
ImageMapper.AlienCrab = function(){
	return [
		[0,0,1,0,0,0,0,0,1,0,0],
		[3,0,0,1,0,0,0,1,0,0,3],
		[3,0,0,1,0,0,0,1,0,0,3],
		[3,0,1,1,1,1,1,1,1,0,3],
		[3,0,1,0,1,1,1,0,1,0,3],
		[3,1,1,1,1,1,1,1,1,1,3],
		[2,1,1,1,1,1,1,1,1,1,2],
		[2,0,1,1,1,1,1,1,1,0,2],
		[2,0,1,1,1,1,1,1,1,0,2],
		[2,0,1,0,0,0,0,0,1,0,2],
		[2,0,1,0,0,0,0,0,1,0,2],
		[0,3,0,2,2,0,2,2,0,3,0]
	];
};
ImageMapper.AlienSquid = function(){
	return [
		[0,0,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,1,1,1,0,0,0,0],
		[0,0,0,1,1,1,1,1,0,0,0],
		[0,0,1,1,1,1,1,1,1,0,0],
		[0,1,1,0,1,1,1,0,1,1,0],
		[1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1],
		[0,0,1,0,0,0,0,0,1,0,0],
		[0,0,1,0,0,0,0,0,1,0,0],
		[0,1,0,3,0,0,0,3,0,1,0],
		[3,0,1,0,3,0,3,0,1,0,3]
	];
};
ImageMapper.DeadAlien = function(){
	return [
		[1,0,0,0,0,0,0,0,0,0,1],
		[0,1,0,0,0,1,0,0,0,1,0],
		[0,0,1,0,0,1,0,0,1,0,0],
		[0,0,0,1,0,1,0,1,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,0,0,0,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,0,1,0,1,0,0,0],
		[0,0,1,0,0,1,0,0,1,0,0],
		[0,1,0,0,0,1,0,0,0,1,0],
		[1,0,0,0,0,1,0,0,0,0,1]
	];
};
ImageMapper.AlienShoot = function(){
	return [
		[0,1,0],
		[1,0,0],
		[0,1,0],
		[0,0,1],
		[0,1,0],
		[1,0,0],
		[0,1,0]
	];
};

ImageMapper.Shield = function(){
	return [ //NOT FOUND
	];
};
ImageMapper.ShieldBrick = function(){
	return [
		[
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1]
		],
		[
			[0,1,1,1,0,1],
			[1,1,1,0,0,0],
			[1,1,0,1,1,0],
			[0,0,1,0,1,1],
			[1,0,0,1,0,1],
			[1,1,0,0,1,1]
		],
		[
			[0,0,0,1,0,1],
			[0,0,0,0,0,0],
			[1,0,0,1,0,0],
			[0,0,1,0,1,1],
			[1,0,0,1,0,1],
			[1,1,0,0,0,0]
		]
	];
};



/**
 * @author DarkUser
 * Dependencies: Brick.js
 */

function ImageCreator(){ throw 'ImageCreator class is Static.'; };

ImageCreator.getImages = function(options){

	var images = [];
	var bricks = [];

	// B - Get parameters ---------------------------------

	var mapper = options.mapper || [];
	var w = options.width || 100;
	var h = options.height || 100;

	var states = options.states || [];
	var bSize = options.brickSize || 5;

	var color = options.color || '#000';

	// E - Get parameters ---------------------------------


	// B - Create CANVAS to render ------------------------

	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext('2d');
	//TODO: delete element

	// E - Create CANVAS to render ------------------------


	// B - Create image from mapper -----------------------

	function buildBricks(){
		var arrLen = mapper.length;

		for(var i=0; i< arrLen; i++){
			var colLen = mapper[i].length;

			for(var j=0; j< colLen; j++){
				var val = mapper[i][j];

				if (val){
					var b = new Brick({
						ctx: ctx,
						x: (j * bSize),
						y: (i * bSize),
						width: bSize,
						height: bSize,
						color: color,
						value: val
					});

					bricks.push(b);
				}
			}
		}
	}

	// E - Create image from mapper -----------------------


	// B - Draw on canvas context and get image -----------

	function createImage(state){
		ctx.clearRect(0, 0, w, h);

		var bLen = bricks.length;
		for(var i=0; i< bLen; i++){
			if (bricks[i].value === 1 || bricks[i].value === state)
				bricks[i].draw();
		}

		var imgData = canvas.toDataURL("image/png");

		var image = new Image();
		image.src = imgData;

		images.push(image);
	}

	// E - Draw on canvas context and get image -----------


	//Run the build
	buildBricks();

	//Create all images for each state
	for(var i=0; i< states.length; i++){
		createImage(states[i]);
	}

	// destroy all bricks created
	var i = bricks.length - 1;
	do{ bricks[i] = null; } while(i--);

	return images;
}

/**
 * @author pjnovas
 */

var DrawableElement = Class.extend({
	init: function(options){
		this.ctx = (options.ctx) ? options.ctx : null; // throw "must provide a Canvas Context";

		this.size = {
			width: options.width || 0,
			height: options.height || 0
		};

		this.position = {
			x: options.x || 0,
			y: options.y || 0
		};

		this.brickSize = options.brickSize || 1;
		this.color = options.color || '#000';

		this.bricks = [];

		this.onDestroy = options.onDestroy || function(){};
	},
	build: function(){

	},
	update: function(){

	},
	draw: function(img){
		if (this.ctx != null)
			this.ctx.drawImage(img, this.position.x, this.position.y);
	},
	destroy: function(){
		this.ctx = null;

		if (this.size != null) {
			this.size.width = null;
			this.size.height = null;
			this.size = null;
		}

		if (this.position != null) {
			this.position.x = null;
			this.position.y = null;
			this.position = null;
		}

		this.brickSize = null;
		this.color = null;

		var bricks = this.bricks;
		if (bricks != null) {
			var bricksL = bricks.length;
			for(var i=0; i< bricksL; i++)
				bricks[i] = null;

			this.bricks = null;
		}

		//if (this.onDestroy) this.onDestroy(this);
	}
});

/**
 * @author pjnovas
 */

var Shoot = DrawableElement.extend({
	init: function(options){
		this._super(options);

		this.MOVE_FACTOR = 5;
		this.dir = options.dir;

		this.shootImage = options.shootImage;

		this.collateBricks = options.collateBricks;
		this.collateAliens = options.collateAliens;

		this.timer = null;
	},
	build: function(){

	},
	loop: function(){
		var dir = this.dir;
		var vel = this.MOVE_FACTOR;

		this.position.y += (vel * dir);

		if(this.hasCollision()){
			this.collided();
			return;
		}
	},
	update: function(){
		clearInterval(this.timer);
		var self = this;
		this.timer = setInterval(function(){ self.loop(); }, 20);
	},
	draw: function(){
		this._super(this.shootImage);
	},
	collided: function(){
		this.destroy();
	},
	destroy: function(){
		clearInterval(this.timer);

		this.collateBricks = null;
		this.collateAliens = null;

		this.onDestroy(this);

		this._super();
	},
	hasCollision: function(){
		var sX = this.position.x;
		var sY = this.position.y;

		//TODO: check shoot with

		if (sY < 0 || sY > 400)
			return true;

		function checkCollision(arr){
			var cb = arr;
			var cbLen = cb.length;

			for(var i=0; i< cbLen; i++){
				var cbO = cb[i];

				var cbL = cbO.position.x;
				var cbT = cbO.position.y;
				var cbR = cbL + cbO.size.width;
				var cbD = cbT + cbO.size.height;

				if (sX >= cbL && sX <= cbR && sY >= cbT && sY <= cbD && !cbO.destroyed){
					arr[i].collided();
					return true;
				}
			}

			return false;
		}

		if (checkCollision(this.collateBricks)) return true;
		if (this.collateAliens && checkCollision(this.collateAliens)) return true;
	}
});
/**
 * @author pjnovas
 */

var Ship = DrawableElement.extend({
	init: function(options){
	    this._super(options);

	    this.maxMove = {
			left: options.maxMoveLeft,
			right: options.maxMoveRight,
		};

		this.onShipHit = options.onShipHit || function(){};

		this.MOVE_FACTOR = 5;

		this.brickSize = 3;
		this.shootImage = null;
		this.shoots = [];

		this.imgs = [];

		this.size = {
			width: 106,
			height: 38
		};

		this.build();

		this.shield = options.shield;
		this.invasion = {};
	},
	build: function(){
		this.buildShootImage();

		var img = document.getElementById('shipmill');
		this.imgs[0] = img;
	},
	update: function(actions){
		var vel = this.MOVE_FACTOR;

		if (actions.indexOf(Controls.Left)>-1){
			if (this.position.x > this.maxMove.left){
				this.position.x -= vel;
			}
		}
		else if (actions.indexOf(Controls.Right)>-1) {
			if (this.position.x < (this.maxMove.right - this.size.width)){
				this.position.x += vel;
			}
		}

		var shootIdx = actions.indexOf(Controls.Shoot);
		if (shootIdx>-1 && this.shoots.length === 0){
	       	actions.splice(shootIdx, 1);
	       	this.makeShoot();
		}
	},
	draw: function(){
		this._super(this.imgs[0]);

		var s = this.shoots;
		var sLen = s.length;
		for(var i=0; i< sLen; i++){
			s[i].draw();
		}
	},
	collided: function(){
		this.onShipHit();
	},
	destroy: function(){
		this.onShipHit = null;

		this.shootImage = null;

		for(var i=0; i< this.shoots.length; i++){
			this.shoots[i].destroy();
		}
		this.shoots = [];

		this.imgs = [];

		this.shield = null;
		this.invasion = null;

		this._super();
	},
	makeShoot: function(){
        var self = this;

		var s = new Shoot({
			ctx: this.ctx,
			x: this.position.x + 50,
			y: this.position.y,
			dir: -1,
			shootImage: this.shootImage,
			onDestroy: function(s){
				for(var i=0; i<self.shoots.length; i++){
					if (self.shoots[i] === s){
						self.shoots.splice(i, 1);
						break;
					}
				}
			},
			collateBricks: this.shield.bricks,
			collateAliens: this.invasion.aliens
		});

		this.shoots.push(s);
		s.update();
	},
	buildShootImage: function(){
		var map = ImageMapper.ShipShoot(),
			brickSize = 3,
			width = brickSize * map[0].length,
			height = brickSize * map.length;

		var opts = {
			width: width,
			height: height,
			states: [1],
			brickSize: brickSize,
			mapper: map,
			color: '#fff'
		};

		this.shootImage = ImageCreator.getImages(opts)[0];
	},
	getShotColor: function(result) {
		result = shColors[shColor];
		shColor = (shColor+1)%shColors.length;
		return result;
	}
});
/**
 * @author pjnovas
 */

var Invasion = DrawableElement.extend({
	init: function(options){
		this._super(options);

		this.size = {
			width: 940,
			height: 320
		};

		this.shield = options.shield;
		this.ship = options.ship;

		this.MOVE_FACTOR = 10;
		this.DOWN_FACTOR = 12;
		this.CURR_VEL = 600;
		this.VEL_FACTOR = 120;

		this.dir = 1;
		this.lastDir = 1;
		this.lastPer = 100;

		this.state = 0;

		this.alienSize = 50;
		this.aliens = [];

		this.crabImages = [];
		this.squidImages = [];
		this.deadAlienImgs = [];

		this.shootImage = null;
		this.shoots = [];

		this.build();

		this.aliensAmm = this.aliens.length;
		this.hadAlienCollision = false;

		this.onAliensClean = options.onAliensClean || function(){};
		this.onScore = options.onScore || function(){};

		this.timer = null;
		this.update();
	},
	build: function(){
		var self = this;
		this.buildShootImage();
		this.buildAliensImages();

		var aSize = this.alienSize;
		var x = this.position.x;
		var y = this.position.y;
		var ctx = this.ctx;

		var aliensArr = ImageMapper.Invasion();
		var aArrLen = aliensArr.length;

		for(var i=0; i< aArrLen; i++){
			var aColLen = aliensArr[i].length;

			for(var j=0; j< aColLen; j++){

				if (aliensArr[i][j]){
					var alien;
					var opts = {
						ctx: ctx,
						x: (j * aSize) + x,
						y: (i * aSize) + y,
						width: aSize,
						height: aSize,
						destroyedImg: this.deadAlienImgs,
						shield: this.shield,
						ship: this.ship,
						onDestroy: function(alien){
							for(var i=0; i<self.aliens.length; i++){
								if (self.aliens[i] === alien){
									self.aliens.splice(i, 1);
									break;
								}
							}

							self.onScore();
						},
						onWallCollision: function(){
							self.hadAlienCollision = true;
						}
					};

					switch(aliensArr[i][j]){
						case 1:
							opts.stateImgs = this.crabImages;
							break;
						case 2:
							opts.stateImgs = this.squidImages;
							break;
						case 3:
							opts.stateImgs = this.crabImages2;
							break;
					}

					alien = new Alien(opts);
					this.aliens.push(alien);
				}
			}
		}
	},
	loop: function(){
		this.state = !this.state;

		var vel = this.MOVE_FACTOR;
		var hMove = 0;
		var vMove = 0;

		var arr = this.aliens;
		var arrLen = arr.length;

		if (arrLen === 0){
			clearInterval(this.timer);
			this.onAliensClean();
		}

		if (this.hadAlienCollision){
			this.dir *= -1;
			this.hadAlienCollision = false;

			vMove = this.DOWN_FACTOR;
			this.lastDir = this.dir;
		}

		hMove = (vel * this.dir);

		if (this.position !== null) {
			this.position.x += hMove;
			this.position.y += vMove;
		}


		var shooterIdx = Math.floor(Math.random()*arrLen);

		var shoot = false;
		if (this.state && Math.floor(Math.random()*2))
			shoot = true;

		for(var i=0; i< arrLen; i++){
			if (arr[i] !== null) {
				arr[i].position.x += hMove;
				arr[i].position.y += vMove;

				if (shoot && shooterIdx === i)
					this.makeShoot(arr[i]);

				arr[i].update();
			}
		}

		if (this.vMove > 0) this.vMove = 0;

		var cPer = (arrLen * 100) / this.aliensAmm;
		if((this.lastPer - cPer) > 9){
			this.CURR_VEL -= this.VEL_FACTOR;
			if (this.CURR_VEL < 200) this.CURR_VEL = 200;
			this.lastPer = cPer;
			this.update();
			return;
		}
	},
	update: function(){
		clearInterval(this.timer);
		var self = this;
		this.timer = setInterval(function(){ self.loop(); }, this.CURR_VEL);
	},
	draw: function(){
		var state = this.state;

		var arr = this.aliens;
		var arrLen = arr.length;
		for(var i=0; i< arrLen; i++){
			if (arr[i] !== undefined)
				arr[i].draw(state);
		}

		var shoots = this.shoots;
		var shootsLen = shoots.length;
		for(var i=0; i< shootsLen; i++){
			shoots[i].draw();
		}
	},
	destroy: function(){
		clearInterval(this.timer);

		this.shield = null;
		this.ship = null;

		for(var i=0; i< this.shoots.length; i++){
			this.shoots[i].destroy();
		}
		this.shoots = [];

		this._super();
	},
	makeShoot: function(alien){
		var shield = this.shield;
		var ship = this.ship;

		var self = this;

		var s = new Shoot({
			ctx: this.ctx,
			x: alien.position.x + (alien.size.width /2),
			y: alien.position.y,
			dir: 1,
			shootImage: this.shootImage,
			onDestroy: function(s){
				for(var i=0; i<self.shoots.length; i++){
					if (self.shoots[i] === s){
						self.shoots.splice(i, 1);
						break;
					}
				}
			},
			collateBricks: shield.bricks,
			collateAliens: [ship]
		});

		this.shoots.push(s);
		s.update();
	},
	buildShootImage: function(){
		var map = ImageMapper.AlienShoot(),
			brickSize = 3,
			width = brickSize * map[0].length,
			height = brickSize * map.length;

		var opts = {
			width: width,
			height: height,
			states: [1],
			brickSize: brickSize,
			mapper: map,
			color: '#fff'
		};

		this.shootImage = ImageCreator.getImages(opts)[0];
	},
	buildAliensImages: function(){
		var opts = {
			width: 45,
			height: 45,
			states: [1],
			brickSize: 3
		};

		opts.mapper = ImageMapper.DeadAlien();
		opts.color = 'white';
		this.deadAlienImgs = ImageCreator.getImages(opts);

		opts.states = [2,3];

		opts.mapper = ImageMapper.AlienCrab();
		opts.color = '#75c5df';
		this.crabImages = ImageCreator.getImages(opts);

		opts.mapper = ImageMapper.AlienSquid();
		opts.color = '#ec66a2';
		this.squidImages = ImageCreator.getImages(opts);

		opts.mapper = ImageMapper.AlienCrab();
		opts.color = '#bccf02';
		this.crabImages2 = ImageCreator.getImages(opts);
	}
});
/**
 * @author pjnovas
 */

var Alien = DrawableElement.extend({
	init: function(options){
		this._super(options);

		this.images = options.stateImgs || [];
		this.destroyedImg = options.destroyedImg || [];

		this.onWallCollision = options.onWallCollision || [];

		this.shield = options.shield || null;
		this.ship = options.ship || null;

		this.destroyed = false;
		this.shoots = [];
	},
	build: function(){

	},
	update: function(){
		this.hasCollision();

		var sX = this.position.x;
		if (sX < 20 || sX > (980-20 - this.size.width))
			this.onWallCollision();

		var sY = this.position.y + this.size.height;
		if (sY < 0) this.ship.collided();
	},
	draw: function(state){
		if (!this.destroyed){
			var idx = (state) ? 0: 1;
			this._super(this.images[idx]);
		}
		else {
			this._super(this.destroyedImg[0]);
			this.destroy();
			this.onDestroy(this);
		}
	},
	hasCollision: function(){
		var sX = this.position.x + this.size.width/2;
		var sY = this.position.y + this.size.height*0.8;

		function checkCollision(arr){
			var cb = arr;
			var cbLen = cb.length;

			for(var i=0; i< cbLen; i++){
				var cbO = cb[i];

				var cbL = cbO.position.x;
				var cbT = cbO.position.y;
				var cbR = cbL + cbO.size.width;
				var cbD = cbT + cbO.size.height;

				if (sX >= cbL && sX <= cbR && sY >= cbT && sY <= cbD && !cbO.destroyed){
					arr[i].collided(true);
					return true;
				}
			}

			return false;
		}

		if (checkCollision(this.shield.bricks)) return true;
		if (checkCollision([this.ship])) return true;
	},
	collided: function(){
		this.destroyed = true;
	},
	destroy: function(){
		this._super();
	}
});
/**
 * @author pjnovas
 */

var Brick = DrawableElement.extend({
	init: function(options){
		this._super(options);

		this.destroyed = false;
		this.value = options.value || 1;
	},
	build: function(){

	},
	update: function(){

	},
	draw: function(){
		if (!this.destroyed){
			this.ctx.beginPath();
		    this.ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);

		    this.ctx.fillStyle = this.color;
		    this.ctx.fill();
	   }
	},
	destroy: function(){
		this.destroyed = true;
	}
});
/**
 * @author pjnovas
 */

var ShieldBrick = DrawableElement.extend({
	init: function(options){
		this._super(options);

		this.state = 0;
		this.imgsState = options.imgsState;
		this.destroyed = false;
	},
	build: function(){

	},
	update: function(){

	},
	draw: function(){
		if (!this.destroyed){
			this._super(this.imgsState[this.state]);
	   }
	},
	collided: function(full){
		if (full) this.state = 3;
		else this.state++;

		if (this.state > 2){
			this.destroyed = true;
		}
	},
	destroy: function(){
		this._super();
	}
});
/**
 * @author pjnovas
 */

var Shield = DrawableElement.extend({
	init: function(options){
		this._super(options);

		this.imgs = [];
		this.build();
	},
	build: function(){
		this.createImagesStateBricks();

		var bSize = this.brickSize;
		var x = this.position.x;
		var y = this.position.y;
		var ctx = this.ctx;
		var color = this.color;

		var fernetArr = ImageMapper.Shield();
		var fArrLen = fernetArr.length;

		for(var i=0; i< fArrLen; i++){
			var fColLen = fernetArr[i].length;

			for(var j=0; j< fColLen; j++){

				if (fernetArr[i][j]){
					var b = new ShieldBrick({
						ctx: ctx,
						x: (j * bSize) + x,
						y: (i * bSize) + y,
						width: bSize,
						height: bSize,
						color: color,
						imgsState: this.imgs
					});

					this.bricks.push(b);
				}
			}
		}
	},
	update: function(){

	},
	draw: function(){
		var b = this.bricks;

		if (b !== null) {
			var bLen = b.length;

			for(var i=0; i< bLen; i++){
				b[i].draw();
			}
		}
	},
	destroy: function(){
		var b = this.bricks;
		if (b !== null) {
			var bLen = b.length;
			for(var i=0; i< bLen; i++){
				b[i].destroy();
			}
			this.bricks = [];
		}

		this._super();
	},
	createImagesStateBricks: function(){
		var opts = {
			width: this.brickSize,
			height: this.brickSize,
			states: [1],
			brickSize: 2,
			color: this.color
		};

		var states = ImageMapper.ShieldBrick();

		for (var i=0; i< states.length; i++){
			opts.mapper = states[i];
			this.imgs.push(ImageCreator.getImages(opts)[0]);
		}
	}
});
/**
 * @author pjnovas
 */

/* TODO:

- fix the removeEventListener

 */

var Invaders404 = Class.extend({
	init : function(options) {
		this.canvas = null;
		this.ctx = null;

		this.loopInterval = 30;
		this.currentDir = [];

		this.shield = {};
		this.ship = {};
		this.invasion = {};

		this.initCanvas();

		this.onLoose = options.onLoose || function(){};
		this.onWin = options.onWin || function(){};
		this.onScore = options.onScore || function(){};

		this.isOnGame = false;
	},
	initCanvas : function() {
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
	},
	start : function() {
		this.build();
		this.loop();
	},
	build : function() {
		var self = this;

		this.shield = new Shield({
			ctx : this.ctx,
			x : 80,
			y : 290,
			brickSize : 12,
			color : '#fff'
		});

		var cnvW = this.canvas.width;

		this.ship = new Ship({
			ctx : this.ctx,
			shield : this.shield,
			maxMoveLeft : 5,
			maxMoveRight : cnvW - 10,
			x : ((cnvW - 10) / 2),
			y : 400,
			color : '#1be400',
			onShipHit : function() {
				self.stop();
				self.onLoose();
			}
		});

		this.invasion = new Invasion({
			ctx : this.ctx,
			x : 20,
			y : 10,
			shield : this.shield,
			ship : this.ship,
			onAliensClean : function() {
				self.stop();
				self.onWin();
			},
			onScore : function() {
				self.onScore();
			}
		});

		this.ship.invasion = this.invasion;

		this.currentDir = [];

		this.isOnGame = true;
		this.bindControls();
	},
	loop : function() {
		this.update();
		this.draw();

		if(this.isOnGame) {
			var self = this;
			setTimeout(function() {
				self.loop();
			}, self.loopInterval);
		}
	},
	update : function() {
		this.shield.update();
		this.ship.update(this.currentDir);
	},
	draw : function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.shield.draw();
		this.ship.draw();
		this.invasion.draw();

		/* FPS Info */
		var thisFrameFPS = 1000 / ((this.now = new Date) - this.lastUpdate);
		this.fps += (thisFrameFPS - this.fps) / this.fpsFilter;
		this.lastUpdate = this.now;
		/* End FPS Info */
	},
	bindControls : function(params) {
		var self = this;
		var gameKeys = [Keyboard.Space, Keyboard.Left, Keyboard.Right];

		function getAction(code) {
			switch (code) {
				case Keyboard.Space:
					return Controls.Shoot;
				case Keyboard.Left:
					return Controls.Left;
				case Keyboard.Right:
					return Controls.Right;
			}

			return null;
		}

		function setGamePadAction() {
			var keysPressed = [];

			if (gamepad.buttons.A_Button || gamepad.buttons.X_Button ||
				gamepad.buttons.B_Button || gamepad.buttons.Y_Button)
				keysPressed.push(Controls.Shoot);

			if (gamepad.axes.Left_Stick_X || gamepad.axes.Pad_Left)
				keysPressed.push(Controls.Left);

			if (gamepad.axes.Right_Stick_X || gamepad.axes.Pad_Right)
				keysPressed.push(Controls.Right);

			for(var i=0; i< keysPressed.length; i++){
				if(self.currentDir.indexOf(keysPressed[i]) === -1)
					self.currentDir.push(keysPressed[i]);
			}
		}

		window.addEventListener("MozGamepadAxisMove", setGamePadAction , false);
		window.addEventListener("MozGamepadButtonDown", setGamePadAction , false);
		window.addEventListener("MozGamepadButtonUp", function(){
			var pos = -1;

			if (!gamepad.axes.Left_Stick_X && !gamepad.axes.Pad_Left){
				pos = self.currentDir.indexOf(Controls.Left);
				if(pos > -1) self.currentDir.splice(pos, 1);
			}

			if (!gamepad.axes.Right_Stick_X && !gamepad.axes.Pad_Right){
				pos = self.currentDir.indexOf(Controls.Right);
				if(pos > -1) self.currentDir.splice(pos, 1);
			}

		} , false);


		/* REMOVE FOR FAKE GAMEPAD */

		document.addEventListener('keydown', function(event) {
			if(self.isOnGame) {
				var key = event.keyCode;

				if(gameKeys.indexOf(key) > -1) {
					var dir = getAction(key);

					if(self.currentDir.indexOf(dir) === -1)
						self.currentDir.push(dir);

					event.stopPropagation();
					event.preventDefault();
					return false;
				}
			}
		});

		document.addEventListener('keyup', function(event) {
			if(self.isOnGame) {
				var key = event.keyCode;

				var dir = getAction(key);
				var pos = self.currentDir.indexOf(dir);
				if(pos > -1)
					self.currentDir.splice(pos, 1);
			}
		});

		/* END REMOVE FOR FAKE GAMEPAD */
	},
	unbindControls : function(params) {
		document.removeEventListener('keydown', function() {
		});
		document.removeEventListener('keyup', function() {
		});
	},
	destroy : function() {
		this.shield.destroy();
		this.invasion.destroy();
		this.ship.destroy();
	},
	stop : function() {
		//this.unbindControls();
		this.isOnGame = false;

		for(var i = 0; i < this.currentDir.length; i++)
		this.currentDir[i] = null;

		this.currentDir = [];

		this.destroy();
	},
	drawSplash : function(callback) {
		var ctx = this.ctx,
			cellSize = 1,
			cols = this.canvas.height/cellSize,
			colsL = this.canvas.width/cellSize,
			colIdx = 0;

		function drawColumn(idx, color){
			for(j=0; j< colsL; j++){
				ctx.save();
				ctx.fillStyle = color;
				ctx.fillRect(idx*(cellSize+20),j*cellSize , cellSize+20, cellSize);
				ctx.restore();
			}
		}

		var timerAux = setInterval(function() {
			if(colIdx < colsL/10){
				drawColumn(colIdx, "#000");
				drawColumn(colIdx+1, "#287dbe");
				drawColumn(colIdx+2, "#75c5df");
				drawColumn(colIdx+3, "#9e579e");
				drawColumn(colIdx+4, "#ec66a2");
				drawColumn(colIdx+5, "#5bb12f");
				colIdx++;
			}
			else {
				clearInterval(timerAux);
				callback();
			}
		}, this.loopInterval);
	}
});
/*
Input.js is MIT-licensed software
Copyright (c) 2011 Jon Buckley
*/

(function() {
  // Holds all of the physical device to USB enumeration mappings
  var keymapBlob = {
    '45e' : { /* Microsoft */
      '28e' : { /* Xbox 360 controller */
        'Mac' : {
          'axes' : {
            'Left_Stick_X': 0,
            'Left_Stick_Y': 1,
            'Right_Stick_X': 2,
            'Right_Stick_Y': 3,
            'Left_Trigger_2': [4, -1, 1],
            'Right_Trigger_2': [5, -1, 1]
          },
          'buttons' : {
            'A_Button': 0,
            'B_Button': 1,
            'X_Button': 2,
            'Y_Button': 3,
            'Left_Trigger_1': 4,
            'Right_Trigger_1': 5,
            'Left_Stick_Button': 6,
            'Right_Stick_Button': 7,
            'Start_Button': 8,
            'Back_Button': 9,
            'Home_Button': 10,
            'Pad_Up': 11,
            'Pad_Down': 12,
            'Pad_Left': 13,
            'Pad_Right': 14
          }
        },
        "Win": {
          "axes": {
            "Left_Stick_X": 0,
            "Left_Stick_Y": 1,
            "Right_Stick_X": 3,
            "Right_Stick_Y": 4,
            "Pad_Left": [5, 0, -1],
            "Pad_Right": [5, 0, 1],
            "Pad_Up": [6, 0, -1],
            "Pad_Down": [6, 0, 1],
            "Left_Trigger_2": [2, 0, 1],
            "Right_Trigger_2": [2, 0, -1]
          },
          "buttons": {
            "A_Button": 0,
            "B_Button": 1,
            "X_Button": 2,
            "Y_Button": 3,
            "Left_Trigger_1": 4,
            "Right_Trigger_1": 5,
            "Back_Button": 6,
            "Start_Button": 7,
            "Left_Stick_Button": 8,
            "Right_Stick_Button": 9
          }
        }
      }
    },
    "54c": { /* Sony */
      "268": { /* PS3 Controller */
        "Mac": {
          "axes": {
            "Left_Stick_X": 0,
            "Left_Stick_Y": 1,
            "Right_Stick_X": 2,
            "Right_Stick_Y": 3
          },
          "buttons": {
            "Back_Button": 0,
            "Left_Stick_Button": 1,
            "Right_Stick_Button": 2,
            "Start_Button": 3,
            "Pad_Up": 4,
            "Pad_Down": 6,
            "Pad_Right": 5,
            "Pad_Left": 7,
            "Left_Trigger_2": 8,
            "Right_Trigger_2": 9,
            "Left_Trigger_1": 10,
            "Right_Trigger_1": 11,
            "Y_Button": 12,
            "B_Button": 13,
            "A_Button": 14,
            "X_Button": 15,
            "Home_Button": 16
          }
        }
      }
    },
    "46d": { /* Logitech */
      "c242": { /* Chillstream */
        "Win": {
          "axes": {
            "Left_Stick_X": 0,
            "Left_Stick_Y": 1,
            "Right_Stick_Y": 4,
            "Right_Stick_X": 3,
            "Left_Trigger_2": [2, 0, 1],
            "Right_Trigger_2": [2, -1, 0],
            "Pad_Left": [5, -1, 0],
            "Pad_Right": [5, 0, 1],
            "Pad_Up": [6, -1, 0],
            "Pad_Down": [6, 0, 1]
          },
          "buttons": {
            "A_Button": 0,
            "X_Button": 2,
            "B_Button": 1,
            "Y_Button": 3,
            "Left_Trigger_1": 4,
            "Right_Trigger_1": 5,
            "Back_Button": 6,
            "Start_Button": 7,
            "Left_Stick_Button": 8,
            "Right_Stick_Button": 9
          }
        }
      },
      "c216": { /* Dual Action */
        "Mac": {
          "axes": {
            "Left_Stick_X": 1,
            "Left_Stick_Y": 2,
            "Right_Stick_X": 3,
            "Right_Stick_Y": 4,
            "Pad_Left": [1, 0, -1],
            "Pad_Right": [1, 0, 1],
            "Pad_Up": [2, 0, -1],
            "Pad_Down": [2, 0, 1]
          },
          "buttons": {
            "X_Button": 0,
            "A_Button": 1,
            "B_Button": 2,
            "Y_Button": 3,
            "Left_Trigger_1": 4,
            "Right_Trigger_1": 5,
            "Left_Trigger_2": 6,
            "Right_Trigger_2": 7,
            "Back_Button": 8,
            "Start_Button": 9,
            "Left_Stick_Button": 10,
            "Right_Stick_Button": 11
          }
        }
      }
    },
    "40b": {
      "6533": { /* USB 2A4K GamePad */
        "Mac": {
          "axes": {
            "Pad_Left": [0, 0, -1],
            "Pad_Right": [0, 0, 1],
            "Pad_Up": [1, 0, -1],
            "Pad_Down": [1, 0, 1]
          },
          "buttons": {
            "A_Button": 0,
            "B_Button": 1,
            "X_Button": 2,
            "Y_Button": 3
          }
        }
      }
    },
    "Firefox": {
      "Fake Gamepad": {
        "Mac": {
          "axes": {

          },
          "buttons": {
            'A_Button' : 0,
            'B_Button' : 1,
            'X_Button' : 2,
            'Y_Button' : 3,
            'Pad_Up' : 4,
            'Pad_Down': 5,
            'Pad_Left': 6,
            'Pad_Right': 7
          }
        }
      }
    }
  };

  // Our ideal gamepad that we present to the developer
  var ImaginaryGamepad = {
    'axes' : [
      'Left_Stick_X',
      'Left_Stick_Y',
      'Right_Stick_X',
      'Right_Stick_Y'
    ],
    'buttons' : [
      'A_Button',
      'B_Button',
      'X_Button',
      'Y_Button',
      'Left_Stick_Button',
      'Right_Stick_Button',
      'Start_Button',
      'Back_Button',
      'Home_Button',
      'Pad_Up',
      'Pad_Down',
      'Pad_Left',
      'Pad_Right',
      'Left_Trigger_1',
      'Right_Trigger_1',
      'Left_Trigger_2',
      'Right_Trigger_2'
    ]
  };

  var osList = ['Win', 'Mac', 'Linux'];
  function detectOS() {
    for (var i in osList) {
      if (navigator.platform.indexOf(osList[i]) !== -1) {
        return osList[i];
      }
    }
    return 'Unknown';
  }

  function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  };

  // Map imaginary device action to physical device action
  function mapAxisToAxis(device, keymap, axes, prop) {
    Object.defineProperty(axes, prop, {
      enumerable: true,
      get: function() { return device.axes[keymap.axes[prop]]; }
    });
  }

  function mapAxisToButton(device, keymap, axes, prop) {
    Object.defineProperty(axes, prop, {
      enumerable: true,
      get: function() { return 0; }
    });
  }

  function mapButtonToButton(device, keymap, buttons, prop) {
    Object.defineProperty(buttons, prop, {
      enumerable: true,
      get: function() { return device.buttons[keymap.buttons[prop]]; }
    });
  }

  function mapButtonToAxis(device, keymap, buttons, prop) {
    var transform = keymap.axes[prop] instanceof Array;

    Object.defineProperty(buttons, prop, {
      enumerable: true,
      get: function() {
        if (transform) {
          return map(device.axes[keymap.axes[prop][0]], keymap.axes[prop][1], keymap.axes[prop][2], 0, 1);
        } else {
          return device.axes[keymap.axes[prop]];
        }
      }
    });
  }

  function mapZero(type, prop) {
    Object.defineProperty(type, prop, {
      enumerable: true,
      get: function() { return 0; }
    });
  }

  var Input = window.Input = {};
  var Device = Input.Device = function(domGamepad) {
    if (!domGamepad) {
      throw "You didn't pass a valid gamepad to the constructor";
    }

    var device = domGamepad,
        usbVendor = domGamepad.id.split('-')[0],
        usbDevice = domGamepad.id.split('-')[1],
        os = detectOS(),
        keymap = keymapBlob,
        axes = this.axes = {},
        buttons = this.buttons = {};

    if (keymap && keymap[usbVendor] && keymap[usbVendor][usbDevice] && keymap[usbVendor][usbDevice][os]) {
      keymap = keymap[usbVendor][usbDevice][os];
    } else {
      throw "A physical device layout for " + usbVendor + "-" + usbDevice + "-" + os + " isn't available";
    }

    // Wire the axes and buttons up
    for (var a in ImaginaryGamepad.axes) {
      if (keymap.axes[ImaginaryGamepad.axes[a]] !== undefined) {
        mapAxisToAxis(device, keymap, axes, ImaginaryGamepad.axes[a]);
      } else if (keymap.buttons[ImaginaryGamepad.axes[a]] !== undefined) {
        mapAxisToButton(device, keymap, axes, ImaginaryGamepad.axes[a]);
      } else {
        mapZero(axes, ImaginaryGamepad.axes[a]);
      }
    }

    for (var b in ImaginaryGamepad.buttons) {
      if (keymap.buttons[ImaginaryGamepad.buttons[b]] !== undefined) {
        mapButtonToButton(device, keymap, buttons, ImaginaryGamepad.buttons[b]);
      } else if (keymap.axes[ImaginaryGamepad.buttons[b]] !== undefined) {
        mapButtonToAxis(device, keymap, buttons, ImaginaryGamepad.buttons[b]);
      } else {
        mapZero(buttons, ImaginaryGamepad.buttons[b]);
      }
    }

    // Add some useful properties from the DOMGamepad object
    Object.defineProperty(this, "connected", {
      enumerable: true,
      get: function() { return device.connected; }
    });

    Object.defineProperty(this, "id", {
      enumerable: true,
      get: function() { return device.id; }
    });

    Object.defineProperty(this, "index", {
      enumerable: true,
      get: function() { return device.index; }
    });
  };
}());
