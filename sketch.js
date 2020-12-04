let bunny_data;
let bunny_sheet;
let turtle_king_data;
let turtle_king_sheet;
let turtle_minion_data;
let turtle_minion_sheet;
let snowball_data;
let snowball_sheet;
let turtle_gatekeeper_data;
let turtle_gatekeeper_sheet;
let shells = 0;
let score = 0;

var GRAVITY = 2;
var platforms = [];
//let animation_data = [];

function preload() {
    /*
    var filepath = 'assets/sprites/';
    var sprites = ['bunny_warrior', 'turtle_gatekeeper', 'turtle_king', 'turtle_minion'];
    var states = ['resting', 'dying'];

    for (sprite in sprites) {
        for (state in states) {
            animation_data.push(loadJSON(filepath+sprites[sprite]+'/'+states[state]+'.json'));
            animation_data.push(loadImage(filepath+sprites[sprite]+'/'+states[state]+'.png'));
        }
    }
    console.log(animation_data.length);
    // Loading Bunny Warrior States
    //bunny_warrior.animation_data = loadJSON(filepath+'bunny_warrior/resting.json');
    */

    bunny_data = loadJSON('assets/sprites/bunny_warrior/jumping.json');
    bunny_sheet = loadImage('assets/sprites/bunny_warrior/jumping.png');
    turtle_minion_data = loadJSON('assets/sprites/turtle_minion/resting.json');
    turtle_minion_sheet = loadImage('assets/sprites/turtle_minion/resting.png');
    turtle_gatekeeper_data = loadJSON('assets/sprites/turtle_gatekeeper/resting.json');
    turtle_gatekeeper_sheet = loadImage('assets/sprites/turtle_gatekeeper/resting.png');
    turtle_king_data = loadJSON('assets/sprites/turtle_king/resting.json');
    turtle_king_sheet = loadImage('assets/sprites/turtle_king/resting.png');
    snowball_data = loadJSON('assets/sprites/snowball/flying.json');
    snowball_sheet = loadImage('assets/sprites/snowball/flying.png');
    
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
    bunny_warrior = new Bunny_Warrior(getAnimationVector(bunny_data.frames, bunny_sheet), width / 2 - 30, height - 90, false, 0.25);
    snowball = new Snowball(getAnimationVector(snowball_data.frames, snowball_sheet), -200, -200, true, 0.6);
    turtle_minion = new Turtle_Minion(getAnimationVector(turtle_minion_data.frames, turtle_minion_sheet), -200, -200, true, 0.1);
    turtle_gatekeeper = new Turtle_Gatekeeper(getAnimationVector(turtle_gatekeeper_data.frames, turtle_gatekeeper_sheet), -200, -200, true, 0.1);
    turtle_king = new Turtle_King(getAnimationVector(turtle_king_data.frames, turtle_king_sheet), -200, -200, true, 0.1);

    // Initial Platform 
    platforms.push(new Platform(bunny_warrior.x, bunny_warrior.y + 80, 65, color("#FF80F0")));
    for(var y = 0; y < height; y += 50) {
        for(var i = 0; i < 3; i++) {
            var x = noise(i, y) * width;
            if(noise(y, i) > 0.5) {
                platforms.push(new Platform(x, y, 55, color("#FF8000")));
            }
        }
    }
}

function draw() {
    background(bg);

    bunny_warrior.show();
    bunny_warrior.animate();

    snowball.show();
    snowball.animate();

    turtle_minion.show();
    turtle_minion.animate();

    turtle_gatekeeper.show();
    turtle_gatekeeper.animate();
    
    turtle_king.show();
    turtle_king.animate();

    bunny_warrior.applyForce(0, GRAVITY);

    if(bunny_warrior.y > height) {
        endGame();
    }

    if(snowball.thrown == true) {
        snowball.fly(mouseX, mouseY);
    }

    var collided = false;

    for(var i = 0; i < platforms.length; i++) {
        
        platforms[i].draw();
        
        if(platforms[i].collidesWith(bunny_warrior) && !collided) {
            bunny_warrior.applyForce(0, -GRAVITY);
            collided = true;
            bunny_warrior.onPlatform = true;
        }
    }

    // Creating Scoreboard
    stroke(2);
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

function handleKeys() {
    // Left
    if(keyIsDown(65)) {
        bunny_warrior.applyForce(-5, 0); 
    }
    // Right
    else if(keyIsDown(68)) { 
        bunny_warrior.applyForce(5, 0);
    }
    else if(keyIsDown(LEFT_ARROW)) {
        bunny_warrior.applyForce(-5, 0); 
    }
    // Right
    else if(keyIsDown(RIGHT_ARROW)) { 
        bunny_warrior.applyForce(5, 0);
        var newJSON = loadJSON('assets/sprites/bunny_warrior/attacking.json');
        var newIMG = loadImage('assets/sprites/bunny_warrior/attacking.png');
        console.log(newJSON);
        //bunny_warrior = new Bunny_Warrior(getAnimationVector(newJSON.frames, newIMG), width / 2 - 30, height - 90, false, 0.25);
        bunny_warrior.changeState('bunny_warrior', 'jumping');
    }
    // Jump
    if(keyIsDown(32)) {
        bunny_warrior.applyForce(0, -10);
        bunny_warrior.onPlatform = false;
    }   
}

function mouseClicked() {
    snowball = new Snowball(getAnimationVector(snowball_data.frames, snowball_sheet), bunny_warrior.x+10, bunny_warrior.y+20, true, 0.6);
    snowball.show();
    snowball.animate();
    snowball.thrown = true;
    //snowball.hide();
}