$(function () {

    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext("2d");
    class SnakePart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    let tileCount = 20;
    let tileSize = canvas.width / tileCount - 1;

    let headX = 10;
    let headY = 10;

    const snakeParts = [];
    let tailLength = 0;

    let foodX = 5;
    let foodY = 5;
    let foodGodX = Math.floor(Math.random() * tileCount);
    let foodGodY = Math.floor(Math.random() * tileCount);

    let wall = [
        { x: 50, y: 60 },
        { x: 70, y: 60 },
        { x: 90, y: 60 },
        { x: 110, y: 60 },
        { x: 130, y: 60 },
        { x: 150, y: 60 },
        { x: 170, y: 60 },
        { x: 190, y: 60 },
        { x: 210, y: 60 },
        { x: 230, y: 60 },
        { x: 250, y: 60 },
        { x: 270, y: 60 },
        { x: 290, y: 60 },
        { x: 310, y: 60 },
        { x: 330, y: 60 },


        { x: 110, y: 140 },
        { x: 130, y: 140 },
        { x: 150, y: 140 },
        { x: 170, y: 140 },
        { x: 190, y: 140 },
        { x: 210, y: 140 },
        { x: 230, y: 140 },
        { x: 250, y: 140 },
        { x: 270, y: 140 },
        { x: 290, y: 140 },


    ];

    let BoomX = Math.floor(Math.random() * tileCount);
    let BoomY = Math.floor(Math.random() * tileCount);

    let inputXVelocity = 0;
    let inputYVelocity = 0;

    let xVelocity = 0;
    let yVelocity = 0;


    var score = 0;
    let speed = 5;
    let keyPressed = DOWN;
    var game;
    const EatSound = new Audio("./sounds/eat.wav");
    const EatGodSound = new Audio("./sounds/eatGod.wav");
    const DieSound = new Audio("./sounds/die.wav");
    const IntroSound = new Audio("./sounds/intro.wav");

    function drawGame() {
        xVelocity = inputXVelocity;
        yVelocity = inputYVelocity;

        changeSnakePosition();
        let result = isGameOver();
        if (result) {
            return;
        }
        clearCanvas();
        checkFoodCollied();
        drawFood();
        drawSnake();
        if (level == 3 || level == 4) {
            drawBoom();
            if (score == 20||score==50||score==100) {
                checkFoodGodCollied();
                drawFoodGod();
            }
        }
        if (level == 5) {
            drawWall();
        }
        setTimeout(drawGame, 1000 / speed);


    }
    function drawSnake() {
        ctx.fillStyle = "yellow";
        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            ctx.fillStroke = "black";
        }
        snakeParts.push(new SnakePart(headX, headY));
        while (snakeParts.length > tailLength) {
            snakeParts.shift();

        }
        var img = document.getElementById("head");
        var pat = ctx.createPattern(img, "");
        ctx.fillStyle = pat;
        ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);


    }
    function drawFood() {
        var img = document.getElementById("food");
        var pat = ctx.createPattern(img, "");
        ctx.fillStyle = pat;
        ctx.fillRect(foodX * tileCount, foodY * tileCount, tileSize, tileSize);


    }
    function drawFoodGod() {
        ctx.fillStyle = 'red';
        ctx.fillRect(foodGodX * tileCount, foodGodY * tileCount, tileSize, tileSize);


    }
    function drawBoom() {
        var img = document.getElementById("boom");
        var pat = ctx.createPattern(img, "");
        ctx.fillStyle = pat;
        ctx.fillRect(BoomX * tileCount, BoomY * tileCount, tileSize, tileSize);


    }
    function drawWall() {
        $.each(wall, function (index, value) {
            var img = document.getElementById("walls");
            var pat = ctx.createPattern(img, "");
            ctx.fillStyle = pat;
            ctx.fillRect(value.x, value.y, tileSize, tileSize);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(value.x, value.y, tileSize, tileSize)
            if (index == 0) {
                return;
            }

        });
    }
    function changeSnakePosition() {
        headX = headX + xVelocity;
        headY = headY + yVelocity;

    }

    function checkFoodCollied() {
        if (foodX === headX && foodY === headY) {
            foodX = Math.floor(Math.random() * tileCount);
            foodY = Math.floor(Math.random() * tileCount);
            tailLength++;
            score += 5;
            EatSound.play();
            $('#points').text(score);


        }



    }
    function checkFoodGodCollied() {
        if (foodGodX === headX && foodGodY === headY) {
            EatGodSound.play();
            score += 10;
            $('#points').text(score);

        }
    }


    function clearCanvas() {
        ctx.fillStyle = "black";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }
    $(document).keydown(function (e) {
        if ($.inArray(e.which, [DOWN, UP, LEFT, RIGHT]) != -1)
            keyPressed = checkKeyIsAllowed(e.which);


    });
    function checkKeyIsAllowed(tempKey) {
        let key;
        if (tempKey == DOWN) {
            key = (keyPressed != UP) ? tempKey : keyPressed;
        } else if (tempKey == UP) {
            key = (keyPressed != DOWN) ? tempKey : keyPressed;
        }
        else if (tempKey == RIGHT) {
            key = (keyPressed != LEFT) ? tempKey : keyPressed;
        }
        else if (tempKey == LEFT) {
            key = (keyPressed != RIGHT) ? tempKey : keyPressed;
        }
        return key;

    }
    function isGameOver() {
        let gameOver = false;
        $.each(wall, function (index, value) {
            if (value.x === headX && value.y === headY) {
                gameOver = true;
                if(index==0){
                    return;
                }
            }
        });


        if (xVelocity === 0 && yVelocity === 0) {
            return false;
        }
        if (headX < 0) {
            gameOver = true;
        } else if (headY < 0) {
            gameOver = true;
        }
        else if (headX === tileCount) {
            gameOver = true;
        } else if (headY === tileCount) {
            gameOver = true;
        } else if (BoomX === headX && BoomY === headY) {
            gameOver = true;
        }

        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            if (part.x === headX && part.y === headY) {
                gameOver = true;
                break;
            }
        }
        if (gameOver) {
            DieSound.play();
            clearInterval(game);
            ctx.font = "50px Verdana"
            var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop("0", "#00a323");
            gradient.addColorStop("0.5", "#00a2e2");
            gradient.addColorStop("1.0", "#09c5d8");
            ctx.fillStyle = gradient;
            ctx.fillText("Game Over", canvas.width / 6.5, canvas.height / 2)
            $('#picsnake').css('animation-name', 'stretch');
            $('#picsnake').css('animation-duration', '0.1s');
            $('#picsnake').css('pointer-events', 'none');
            $('#picsnake').css('-ms-user-select', 'none');
            $('#picsnake').css('user-select', 'none');
        }
        return gameOver;


    }
    document.body.addEventListener("keydown", keyDown);
    function keyDown(e) {
        // turn up
        if (e.keyCode == UP) {
            if (inputYVelocity == 1) return;
            inputYVelocity = -1;
            inputXVelocity = 0;
        }
        //turn down
        if (e.keyCode == DOWN) {
            if (inputYVelocity == -1) return;
            inputYVelocity = 1;
            inputXVelocity = 0;
        }
        //turn left
        if (e.keyCode == LEFT) {
            if (inputXVelocity == 1) return;
            inputYVelocity = 0;
            inputXVelocity = -1;
        }
        //turn right
        if (e.keyCode == RIGHT) {
            if (inputXVelocity == -1) return;
            inputYVelocity = 0;
            inputXVelocity = 1;
        }

    }
    $('#new').click(function () {
        $('#menu').css('display', 'none');
        $('#startGame').css('display', 'inline');
        $('#level_show').css('display', 'none');





    });
    $('#start').click(function () {
        $('#menu').css('display', 'none');
        $('#startGame').css('display', 'none');
        $('#level_show').css('display', 'inline-grid');
    });
    // $('#cancel').click(function () {
    //     $('#menu').css('display', 'inline-grid')
    //     $('#startGame').css('display', 'none');
    // });
    $('.btncancel').click(function () {
        $('#menu').css('display', 'inline-grid');
        $('#level_show').css('display', 'none');
        IntroSound.play();
    });
    $('.level1').click(function () {
        IntroSound.play();
        $('#startGame').css('display', 'inline');
        $('#level_show').css('display', 'none');
        level = 1;
        $('#level').text(level);
    });
    $('.level2').click(function () {
        IntroSound.play();
        $('#startGame').css('display', 'inline');
        $('#level_show').css('display', 'none');
        level = 2;
        $('#level').text(level);
        speed = 9;

    });
    $('.level3').click(function () {
        IntroSound.play();
        $('#startGame').css('display', 'inline');
        $('#level_show').css('display', 'none');
        level = 3;
        $('#level').text(level);

    });
    $('.level4').click(function () {
        IntroSound.play();
        $('#startGame').css('display', 'inline');
        $('#level_show').css('display', 'none');
        level = 4;
        $('#level').text(level);
        speed = 9;
    });
    $('.level5').click(function () {
        IntroSound.play();
        $('#startGame').css('display', 'inline');
        $('#level_show').css('display', 'none');
        level = 5;
        $('#level').text(level);
    });

    drawGame();

});

