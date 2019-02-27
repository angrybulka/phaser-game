var game = new Phaser.Game(400, 490, Phaser.AUTO, 'phaser-example');

var styleText = { font: "30px Arial", fill: "#ffffff" };

var mainState = {
    preload: function() {
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // game.scale.pageAlignHorizontally = true;
        // game.scale.pageAlighVertically = true;
        game.load.image('bird', 'assets/monnkey.png');
        game.load.image('pipe', 'assets/snake-wall.png');
        game.load.image('background', 'assets/back.jpg');
        game.load.image('banana', 'assets/banana.png');

        game.load.audio('jump', 'assets/jump.wav');
    },

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
            this.restartGame();
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
game.state.add('main', mainState);
game.state.start('main');

