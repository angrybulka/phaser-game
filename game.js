var game = new Phaser.Game(400, 490, Phaser.AUTO, null);

var styleText = { font: "30px Arial", fill: "#ffffff" };

var mainState = {
    create: function() {
        game.add.tileSprite(0, 0, 400, 490, 'background');
        game.stage.backgroundColor = '#71c5cf';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this);
        game.input.onTap.add(this.jump, this);
        this.pipes = game.add.group();
        this.bananes = game.add.group();
        var banana;
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
        styleText);
        this.labelScore.text = "Score: " + this.score;
        this.bird.anchor.set(-0.2, 0.5);
        this.jumpSound = game.add.audio('jump');
    },

    update: function() {
        if (this.bird.y < 0 || this.bird.y > 490)
            game.state.start("gameOverS");
        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);
        game.physics.arcade.overlap(
            this.bird, this.banana, this.hitBanana, null, this);
        if (this.bird.angle < 20)

        this.bird.angle += 1;
    },

    hitPipe: function() {
        if (this.bird.alive == false)
            return;
        this.bird.alive = false;
        game.time.events.remove(this.timer);
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        });
        this.banana.body.velocity = 0;
        game.state.start("gameOverS");
    },

    // render: function() {
    //     game.debug.bodyInfo(this.bird, 10, 10, 'red')
    // },

    hitBanana: function() {
        this.score += 1;
        this.banana.kill();
        this.labelScore.text = "Score: " + this.score;
    },

    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addOneBanana: function(x, y) {
        this.banana = game.add.sprite(x, y, 'banana');
        game.physics.arcade.enable(this.banana);
        this.banana.body.velocity.x = -200;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 4) + 1;
        for (var i = 0; i < 8; i++){
            if (i != hole && i != hole + 1){
                this.addOnePipe(400, i * 60 + 10);
            }
        }
        this.addOneBanana(400, hole * 60 + 35);
    },

    jump: function() {
        if (this.bird.alive == false)
            return;
        this.bird.body.velocity.y = -350;
        var animation = game.add.tween(this.bird);
        animation.to({angle: -20}, 100);
        animation.start();
        this.jumpSound.play();
    },
    restartGame: function() {
        game.state.start('main');
    }
};

var bootState = {
    preload: function() {
        game.load.image('loading', 'assets/loading.png');
    },
    create: function() {
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // game.scale.pageAlignHorizontally = true;
        // game.scale.pageAlighVertically = true;

        game.state.start('preloadState');
    }
};

var preloadState = {
    preload: function() {
        game.load.image('bird', 'assets/monnkey.png');
        game.load.image('pipe', 'assets/snake-wall.png');
        game.load.image('background', 'assets/back.jpg');
        game.load.image('banana', 'assets/banana.png');
        game.load.image('titleBack', 'assets/background.png');
        game.load.audio('jump', 'assets/jump.wav');

        var loadingBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loading');
        loadingBar.anchor.set(0.5);
        game.load.setPreloadSprite(loadingBar);
        },

    create: function() {
        game.state.start('gameTitle');
    }
};

var gameTitle = {
    create: function() {
        game.add.tileSprite(0, 0, 400, 490, 'titleBack');
        this.gameStartText = game.add.text(game.world.centerX, game.world.centerY - 100, 'Hungry Monkey', {font: '40px Arial', fill: '#00'});
        this.gameStartText.anchor.set(0.5);
        this.playBtn = game.add.text(game.world.centerX, game.world.centerY, 'Start play', {font: '24px Arial', fill: '#000'});
        this.playBtn.anchor.set(0.5);
        game.input.onTap.addOnce(
            function() {
                game.state.start('main');
            }
        );
    }
};
var gameOverState = {
    create: function() {
        game.add.tileSprite(0, 0, 400, 490, 'titleBack');
        this.gameOverText = game.add.text(game.world.centerX, game.world.centerY, ' ', {font: '24px Arial', fill: '#000'});
        this.gameOverText.visible = false;
        this.gameOverText.anchor.set(0.5);
        this.gameResult = game.add.text(game.world.centerX, game.world.centerY +100, "Your score: " + mainState.score + " bananas", {font: '18px Arial', fill: '#000'});
        this.gameResult.anchor.set(0.5);
    },
    update: function() {
        this.gameOverText.text = "GAME OVER \n Click to restart!";
        this.gameOverText.visible = true;

        game.input.onTap.addOnce(
            function() {
                game.state.start('main');
            }
        );
    }
};

game.state.add('boot', bootState);
game.state.add('preloadState', preloadState);
game.state.add('gameTitle', gameTitle);
game.state.add('main', mainState);
game.state.add('gameOverS', gameOverState);
game.state.start('boot');