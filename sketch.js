let shells = 0;
let score = 0;

var GRAVITY = 2;
var platforms = [];
let animation_data = [];
let sheet_data = [];
let velocity = 0;

function preload() {
    
    var filepath = 'assets/sprites/';
    var sprites = ['bunny_warrior', 'turtle_minion', 'turtle_gatekeeper', 'turtle_king'];
    var states = ['resting', 'dying'];

    for (sprite in sprites) {
        for (state in states) {
            animation_data.push(loadJSON(filepath+sprites[sprite]+'/'+states[state]+'.json'));
            sheet_data.push(loadImage(filepath+sprites[sprite]+'/'+states[state]+'.png'));
        }
    }
    
    animation_data.push(loadJSON('assets/sprites/snowball/flying.json'));
    sheet_data.push(loadImage('assets/sprites/snowball/flying.png'));
    animation_data.push(loadJSON('assets/sprites/snowball/impact.json'));
    sheet_data.push(loadImage('assets/sprites/snowball/impact.png'));
}

function getAnimationVector(frames, sheet) {
    let sprite_animation = [];
    for (let i = 0; i < frames.length; i++) {
        let pos = frames[i].frame;
        let img = sheet.get(pos.x, pos.y, pos.w, pos.h);
        sprite_animation.push(img);
    }

    return sprite_animation;
}

function setup() {
    // Loading and Creating Backgrounds
    bg = loadImage('assets/background/background.jpg');
    bg_death = loadImage('assets/background/death_background.jpg');
    shellImage = loadImage('assets/shop/turtle_shell.png');
    createCanvas(500, 700);

    // Creating Sprites
    bunny_warrior = new Bunny_Warrior(getAnimationVector(animation_data[0].frames, sheet_data[0]), width / 2 - 30, height - 90, false, 0.25);
    turtle_minion = new Turtle_Minion(getAnimationVector(animation_data[2].frames, sheet_data[2]), width/4, height/4-40, true, 0.1);
    turtle_gatekeeper = new Turtle_Gatekeeper(getAnimationVector(animation_data[4].frames, sheet_data[4]), width/4+200, height/4-30, true, 0.1);
    turtle_king = new Turtle_King(getAnimationVector(animation_data[6].frames, sheet_data[6]), width/4+120, height/4-120, true, 0.1);
    snowball = new Snowball(getAnimationVector(animation_data[8].frames, sheet_data[8]), width, height, true, 0.6);

    // Initial Platform 
    platforms.push(new Platform(bunny_warrior.x, bunny_warrior.y + 80, 65, color("#FF80F0")));
    platforms.push(new Platform(width/4, height/4, 65, color("#a1c4e4")));
    platforms.push(new Platform(width/4+200, height/4+83, 120, color("#000080")));
    platforms.push(new Platform(width/4+120, height/4-45, 65, color("#90ee90")));

    for(var y = 0; y < height; y += 50) {
        for(var i = 0; i < 3; i++) {
            var x = noise(i, y) * width;
            if(noise(y, i) > 0.5) {
                platforms.push(new Platform(x, y, 55, color("#f0ead6")));
            }
        }
    }
}

function draw() {
    background(bg);

    handleBunny();
    handleEnemies();
    handleSnowball();
    handleScore();

    var collided = false;

    for(var i = 0; i < platforms.length; i++) {
        
        platforms[i].draw();
        
        if(platforms[i].collidesWith(bunny_warrior) && !collided) {
            //bunny_warrior.applyForce(0, bunny_warrior.force*velocity);
            collided = true;
            velocity *= 0.8;
            //bunny_warrior.force*velocity;
            //bunny_warrior.jump();

            bunny_warrior.onPlatform = true;
        }
    }
    
    if(bunny_warrior.onPlatform == true) {
        bunny_warrior.applyForce(0, -GRAVITY);
    }
    
    bunny_warrior.onPlatform = false;

    handleKeys();
}

function endGame() {
    background(bg_death);
    textAlign(CENTER);
    textSize(60);
    noStroke();
    fill("70FFF0");
    text("Game Over!", width / 2, height / 2);
    noLoop();
}

function handleEnemies() {
    turtle_minion.show();
    turtle_minion.animate();

    turtle_gatekeeper.show();
    turtle_gatekeeper.animate();
    
    turtle_king.show();
    turtle_king.animate();
}

function handleBunny() {
    bunny_warrior.show();
    bunny_warrior.animate();

    bunny_warrior.applyForce(0, GRAVITY);

    if(bunny_warrior.y > height) {
        endGame();
    }


}

function handleSnowball() {
    snowball.show();
    snowball.animate();

    if(snowball.thrown == true && abs(snowball.x - snowball.target.x) > 5 || abs(snowball.y - snowball.target.y) > 5) {
        snowball.applyForce((snowball.target.x - snowball.x) / snowball.flyspeed, (snowball.target.y - snowball.y) / snowball.flyspeed);
    }
    else {
        snowball.thrown = false;
        snowball.changeState(animation_data[9].frames, sheet_data[9]);
        if(checkIfInHitbox(snowball, turtle_minion)) {
            turtle_minion.death();
            //turtle_minion.hide();
        }
        else if(checkIfInHitbox(snowball, turtle_gatekeeper)) {
            turtle_gatekeeper.changeState(animation_data[5].frames, sheet_data[5]);
            //turtle_gatekeeper.hide();
        }
        else if(checkIfInHitbox(snowball, turtle_king)) {
            turtle_king.changeState(animation_data[7].frames, sheet_data[7]);
            //turtle_king.hide();
        }
        if(floor(snowball.index) % 40 == 0) {
            snowball.reload();
        }
    }
}

function checkIfInHitbox(sprite, enemy) {
    if(sprite.x > enemy.x && sprite.x < enemy.x+enemy.w) {
        if(sprite.y > enemy.y && sprite.y < enemy.y+enemy.h) {
            return true;
        }
    }
    return false;
}

function handleScore() {
    // Creating Scoreboard
    stroke(2);
    textAlign(LEFT);
    strokeWeight(3);
    textSize(15);
    fill("#509fff");
    rect(0, height-50, 150, 50, 20, 20, 20, 5);
    fill("#ffffff");
    text("Shells = "+ shells, 10, height -20);
    image(shellImage, 105, height- 42);

    stroke(2);
    strokeWeight(3);
    textSize(15);
    fill("#ffffff");
    rect(width-150, height-50, 150, 50, 20, 20, 5, 20);
    fill("#a1c4e4");
    text("Score = " + score, width-130, height -20);
}

function handleKeys() {
    // Left
    if(keyIsDown(65)) {
        bunny_warrior.applyForce(-5, 0); 
    }
    // Right
    else if(keyIsDown(68)) { 
        bunny_warrior.applyForce(5, 0);
    }
    else if(keyIsDown(83)) { 
        bunny_warrior.applyForce(0, 5);
    }
    else if(keyIsDown(LEFT_ARROW)) {
        bunny_warrior.applyForce(-5, 0); 
    }
    // Right
    else if(keyIsDown(RIGHT_ARROW)) { 
        bunny_warrior.applyForce(5, 0);
    }
    // Jump
    if(keyIsDown(32)) {
        //if(bunny_warrior.onPlatform == true) {
            bunny_warrior.applyForce(0, -10);
        //}
        //bunny_warrior.onPlatform = false;
    }
}

function mouseClicked() {
    snowball = new Snowball(getAnimationVector(animation_data[8].frames, sheet_data[8]), bunny_warrior.x+10, bunny_warrior.y+20, true, 0.6);
    snowball.thrown = true;
    snowball.target = createVector(mouseX, mouseY);
}