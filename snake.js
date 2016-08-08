(function() {

	//get game area within closure
	var game = document.getElementById('game');

	var dimensions = function(val) {
		return val - (val % 100);
	};

	game.width = 600;
	game.height = 600;

	//determine playing area dimensions
	var w = 600;
	var l = 600 / 2 - w / 2;

	var h = 600;
	var t = 600 / 2 - h / 2;

	var board = {
		width: w,
		height: h,
		top: t,
		left: l
	};

	//get context
	var ctx = game.getContext('2d');

	//set colors
	ctx.strokeStyle = '#FFF';
	ctx.fillStyle = '#FFF';

	function random(from, to) {
	    return Math.floor(Math.random()*(to-from+1)+from);
	};

	//draw the border of the game area
	var drawPerimeter = function() {
		ctx.strokeRect(board.left + 0.5, board.top + 0.5, board.width, board.height);
	};

	//set box size
	var size = 20;

	//set speed
	var direction = [size, 0];

	//build initial snake
	var snake = (function() {
		var s = [];
		for (var i = 0; i < 6; i++) {
			var x = (board.width / 2 - (board.width / 2 % 100)) - size * i;
			var y = (board.height / 2 - (board.height / 2 % 100));
			s.push([x,y]);
		}
		return s;
	})();

	//determines if there is a collion with the snake
	var collision = function(pos, s) {

		s = s ? s : 0;

		for (var i = s; i < snake.length; i++) {
			if (pos[0] == snake[i][0] && pos[1] == snake[i][1]) {
				return true;
			}
		}

		return false;
	};

	//handles drawing the snake onto the canvas
	var drawSnake = function() {
		for (var i = 0; i < snake.length; i++) {
			ctx.fillRect(board.left + snake[i][0], board.top + snake[i][1], size, size);
		}
	};

	var moveSnake = function(add) {

		var n = [snake[snake.length-1][0], snake[snake.length-1][1]];

		for (var i = snake.length - 1; i >= 0; i--) {
			if (i > 0) {
				snake[i][0] = snake[i-1][0];
				snake[i][1] = snake[i-1][1];
			} else {
				snake[i][0] += direction[0];
				snake[i][1] += direction[1];
			}
		}

		if (add) {
			snake.push(n);
		}
	};

	var deadSnake = function() {

		if (collision(snake[0], 1) ||
			(snake[0][0] < 0 || snake[0][0] + size > board.width) ||
			(snake[0][1] < 0 || snake[0][1] + size > board.height)) {
			return true;
		}

		return false;
	}

	//generates a random position for the apple on the canvas
	var getApple = function() {

		var x, y, ok = true;

		do {
			x = random(0, board.width - size);
			y = random(0, board.height - size);

			x -= x % size;
			y -= y % size;

			ok = ! collision([x, y]);

		} while( ! ok);

		return [x,y];
	};

	//get an initial apple position
	var apple = getApple();

	//handles drawing the apple
	var drawApple = function() {
		var col = ctx.fillStyle;
		ctx.fillStyle = '#FF0000';
		ctx.fillRect(board.left + apple[0], board.top + apple[1], size, size);
		ctx.fillStyle = col;
	};

	//keylocker variable
	var keypress = false;

	//main step loop
	var main = setInterval(function() {
		//dead on step?
		var dead = deadSnake();

		if ( ! dead) {
			//clear the rectange
			ctx.clearRect(0,0,game.width,game.height);

			//draw the perimeter
			drawPerimeter();

			//collision on step?
			var collided = collision(apple);

			if (collided) {
				//apple eaten, get new one
				apple = getApple();
			}

			//draw the apple
			drawApple();

			//move the snake
			moveSnake(collided);

			//draw the snake
			drawSnake();

			//reset keypress for next step
			keypress = false;

			//set main again
			// main();

		} else {
			var score = snake.length * 100;
			clearInterval(main);
			alert('Your snake is dead! You scored <' + score + '> points');
		}
	}, 120);

	//let player change the direction!
	var changeDirection = function(key) {
		if ( ! keypress) {
			keypress = true;
			switch (key) {
				case 37:
					//left
					if (direction[0] == 0) {
						direction = [-size, 0];
					}
					break;
				case 38:
					//up
					if (direction[1] == 0) {
						direction = [0, -size];
					}
					break;
				case 39:
					//right
					if (direction[0] == 0) {
						direction = [size, 0];
					}
					break;
				case 40:
					//down
					if (direction[1] == 0) {
						direction = [0, size];
					}
					break;
			}
		}
	}

	//set keypress capture
	document.onkeydown = function(e) {
		var key = window.event? event.keyCode : e.keyCode;
		changeDirection(key);
	}

})();
