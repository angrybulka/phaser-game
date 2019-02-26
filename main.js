
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {

    game.load.image('bullet', 'assets/images/bullet.png');
    game.load.image('ship', 'assets/images/player.png');
    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);
    game.load.image('starfield', 'assets/images/starfield.png');
    game.load.image('background', 'assets/images/background2.png');

}

var player;
var player2;
var aliens;
var bullets1;
var bulletTime = 0;
var bulletTime2 = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var lives;
var firingTimer = 0;
var stateText;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets1 = game.add.group();
    bullets1.enableBody = true;
    bullets1.physicsBodyType = Phaser.Physics.ARCADE;
    bullets1.createMultiple(30, 'bullet');
    bullets1.setAll('anchor.x', 0.5);
    bullets1.setAll('anchor.y', 1);
    bullets1.setAll('outOfBoundsKill', true);
    bullets1.setAll('checkWorldBounds', true);

    //  Our bullet group
    bullets2 = game.add.group();
    bullets2.enableBody = true;
    bullets2.physicsBodyType = Phaser.Physics.ARCADE;
    bullets2.createMultiple(30, 'bullet');
    bullets2.setAll('anchor.x', 0.5);
    bullets2.setAll('anchor.y', 1);
    bullets2.setAll('outOfBoundsKill', true);
    bullets2.setAll('checkWorldBounds', true);


    //  The hero!
    player = game.add.sprite(400, 570, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player2 = game.add.sprite(400, 100, 'ship');
    player2.angle = 180;
    player2.anchor.setTo(0.5, 0.5);
    game.physics.enable(player2, Phaser.Physics.ARCADE);

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 110, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    lives2 = game.add.group();
    game.add.text(game.world.width - 110, game.world.height - 100, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++)
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), game.world.height - 40, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.6;

        var ship2 = lives2.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship2.anchor.setTo(0.5, 0.5);
        ship2.angle = 90;
        ship2.alpha = 0.6;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(function(explosion) {
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        explosion.animations.add('kaboom');
    }, this);
    

    //Player 1 keys
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);

    //Player 2 keys
    player2Left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    player2Right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    fireButton2 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}


function update() {

    //  Scroll the background
    //starfield.tilePosition.y += 2;

    if (player.alive)
    {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton.isDown)
        {
            fireBullet();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets1, player2, player1Hits2, null, this);
        game.physics.arcade.overlap(bullets2, player, player2Hits1, null, this);
    }

    if (player2.alive)
    {
        //  Reset the player, then check for movement keys
        player2.body.velocity.setTo(0, 0);

        if (player2Left.isDown)
        {
            player2.body.velocity.x = -200;
        }
        else if (player2Right.isDown)
        {
            player2.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton2.isDown)
        {
            fireBullet2();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets1, player2, player1Hits2, null, this);
        game.physics.arcade.overlap(bullets2, player, player2Hits1, null, this);
    }

}

function player1Hits2 (player2, bullet) {

    bullet.kill();

    live = lives2.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    // And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player2.body.x, player2.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives2.countLiving() < 1)
    {
        player2.kill();
        bullets2.callAll('kill');

        stateText.text=" PLAYER 2 \n GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function player2Hits1 (player1, bullet) {

    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    // And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        bullets1.callAll('kill');

        stateText.text=" PLAYER 1 \n GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets1.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 500;
        }
    }

}

function fireBullet2 () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime2)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets2.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player2.x, player2.y + 30);
            bullet.body.velocity.y = 400;
            bulletTime2 = game.time.now + 500;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //resets the life count
    lives.callAll('revive');
    lives2.callAll('revive');

    //revives the player
    player.revive();
    player2.revive();
    //hides the text
    stateText.visible = false;

}