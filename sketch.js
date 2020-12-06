let shells = 0;
let score = 0;

var GRAVITY = 2;
var platforms = [];
let animation_data = [];
let sheet_data = [];
let snowball = [];
let snowball_ammo = 1;
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
    snowball.push(new Snowball(getAnimationVector(animation_data[8].frames, sheet_data[8]), width, height, true, 0.6));

    // Initial Platform 
    platforms.push(new Platform(bunny_warrior.x, bunny_warrior.y + 80, 65, color("#FF80F0")));
    platforms.push(new Platform(width/4, height/4, 65, color("#a1c4e4")));
    platforms.push(new Platform(width/4+200, height/4+83, 120, color("#000080")));
    platforms.push(new Platform(width/4+120, height/4-45, 65, color("#90ee90")));

    for(var y = 0; y < height-50; y += 50) {
        for(var i = 0; i < 3; i++) {
            var x = noise(i, y) * width;
            if(noise(y, i) > 0.5) {
                platforms.push(new Platform(x, y, 55, color("#f0ead6")));
            }
        }
    }
}

function draw() {
    if(bunny_warrior.dead == false) {
        background(bg);
    }

    if(checkIfInHitbox(bunny_warrior, turtle_minion) || checkIfInHitbox(bunny_warrior, turtle_gatekeeper) || checkIfInHitbox(bunny_warrior, turtle_king)) {
        endGame();
    }
    if(bunny_warrior.y > height) {
        endGame();
    }    

    handleEnemies();
    handleBunny();
    handleSnowball();
    handleScore();

    //var collided = false;

    for(var i = 0; i < platforms.length; i++) {
        
        platforms[i].draw();
        
        if(platforms[i].collidesWith(bunny_warrior)) {// && !collided) {
            //bunny_warrior.applyForce(0, -100);
            //collided = true;
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
    bunny_warrior.death();
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

    if(bunny_warrior.dead == false) {
        bunny_warrior.applyForce(0, GRAVITY);
    }

}

function handleSnowball() {
    for(var i = 0; i < snowball.length; i++) {
        snowball[i].show();
        snowball[i].animate();

        if(snowball[i].thrown == true && abs(snowball[i].x - snowball[i].target.x) > 5 || abs(snowball[i].y - snowball[i].target.y) > 5) {
            snowball[i].applyForce((snowball[i].target.x - snowball[i].x) / snowball[i].flyspeed, (snowball[i].target.y - snowball[i].y) / snowball[i].flyspeed);
        }
        else {
            snowball[i].thrown = false;
            if(checkIfInHitbox(snowball[i], turtle_minion)) {
                turtle_minion.death();

            }
            else if(checkIfInHitbox(snowball[i], turtle_gatekeeper)) {
                turtle_gatekeeper.death();
                //turtle_gatekeeper.hide();
            }
            else if(checkIfInHitbox(snowball[i], turtle_king)) {
                turtle_king.death();
                //turtle_king.hide();
            }
            
            snowball[i].changeState(animation_data[9].frames, sheet_data[9]);
            if(floor(snowball[i].index) % 40 == 0) {
                snowball[i].reload();
                snowball.splice(i, 1);
            }
        }
    }
}

function checkIfInHitbox(sprite, enemy) {
    let leeway_w = sprite.w/2;
    let leeway_h = sprite.h/2;
    return !(enemy.x > (sprite.x + sprite.w - leeway_w) || 
            (enemy.x + enemy.w - leeway_w) <  sprite.x  || 
             enemy.y > (sprite.y + sprite.h - leeway_h) ||
            (enemy.y + enemy.h - leeway_h) <  sprite.y);
}

function handleScore() {
    // Creating Scoreboard
    stroke(2);
    textAlign(LEFT);
    strokeWeight(3);
    textSize(18);
    fill("#509fff");
    rect(0, height-50, 150, 50, 20, 20, 20, 5);
    fill("#ffffff");
    text("Shells = "+ shells, 10, height -18);
    image(shellImage, 105, height- 42);

    stroke(2);
    strokeWeight(3);
    textSize(18);
    fill("#ffffff");
    rect(width-150, height-50, 150, 50, 20, 20, 5, 20);
    fill("#a1c4e4");
    text("Score = " + score, width-130, height -18);
}

function handleKeys() {
    if(bunny_warrior.dead == false) {
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
}

function mouseClicked() {
    // Gain the ability to fire more snowballs based on how many
    // shells youve collected. Every 50 shells you gain 1 more
    // snowball ammo.
    if(bunny_warrior.dead == false) {
        snowball_ammo = shells / 50;
        if(snowball.length < floor(snowball_ammo) + 1) {
            snowball.push(new Snowball(getAnimationVector(animation_data[8].frames, sheet_data[8]), bunny_warrior.x+10, bunny_warrior.y+20, true, 0.6));
            snowball[snowball.length-1].thrown = true;
            snowball[snowball.length-1].target = createVector(mouseX, mouseY);
        }
    }
}
