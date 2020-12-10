let shells = 0;
let score = 0;
let level = 0;
var y1 = 0;
var y2;
var scrollSpeed = 2;
var GRAVITY = 2;
var platforms = [];
let animation_data = [];
let sheet_data = [];
let snowball = [];
let snowball_ammo = 1;
let snowball_mod = 10;
let velocity = 0;

function preload() {
    
    var filepath = 'assets/sprites/';
    var sprites = ['bunny_warrior', 'turtle_minion', 'turtle_gatekeeper', 'turtle_king'];
    var states = ['resting', 'attacking1', 'dying'];
    
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
    snowballImage = loadImage('assets/sprites/snowball/snowball_ammo.png');
    createCanvas(500, 700);
    y2 = height;

    for(var y = 0; y < height-60; y += 40) {
        for(var i = 0; i < 5; i++) {
            var x = noise(i, y) * width;
            if(noise(y, i) > 0.5) {
                platforms.push(new Platform(x, y, 55, color("#f0ead6")));
            }
        }
    }

    // Creating Sprites
    bunny_warrior = new Bunny_Warrior(getAnimationVector(animation_data[0].frames, sheet_data[0]), width / 2 - 30, height - 90, false, 0.25);
    turtle_minion = new Turtle_Minion(getAnimationVector(animation_data[3].frames, sheet_data[3]), width/4, height/4-40, true, 0.1);
    turtle_gatekeeper = new Turtle_Gatekeeper(getAnimationVector(animation_data[6].frames, sheet_data[6]), width/4+200, height/4-30, true, 0.1);
    turtle_king = new Turtle_King(getAnimationVector(animation_data[9].frames, sheet_data[9]), width/4+120, height/4-120, true, 0.1);
    snowball.push(new Snowball(getAnimationVector(animation_data[12].frames, sheet_data[12]), width, height, true, 0.6));

    // Initialize Platforms
    platforms.push(new Platform(bunny_warrior.x-50, bunny_warrior.y + 80, 160, color("#f0ead6")));
    platforms.push(new Platform(turtle_minion.x, turtle_minion.y + turtle_minion.h, 65, color("#a1c4e4")));
    platforms.push(new Platform(turtle_gatekeeper.x, turtle_gatekeeper.y + turtle_gatekeeper.h, 120, color("#000080")));
    platforms.push(new Platform(turtle_king.x, turtle_king.y + turtle_king.h, 65, color("#90ee90")));
}

function draw() {

    if(bunny_warrior.y < bunny_warrior.maxAltitude) {
        y1 += scrollSpeed;
        y2 += scrollSpeed;
        bunny_warrior.maxAltitude = bunny_warrior.y;
    }

    // In the order that they're drawn overlapping
    handleBackground();
    handlePlatforms();
    handleBunny();
    handleEnemies();
    handleSnowball();
    handleScore();
    
    if(bunny_warrior.y < -50) {
        generateNewLevel();
    }
    
    bunny_warrior.onPlatform = false;

    handleKeys();
}

function endGame() {
    textAlign(CENTER);
    textSize(60);
    strokeWeight(3);
    fill("70FFF0");
    text("Game Over!", width / 2, height / 2);
    textSize(18);
    text("Don't give up, Refresh to try again!", width / 2, height / 2 + 30);
    bunny_warrior.death();
}

function generateNewLevel() {
    level++;
    score += level * 5;
    bunny_warrior.maxAltitude = height;

    // Deleting previous platforms
    while(platforms.length > 0) {
        platforms.pop();
    }

    delete turtle_minion;
    delete turtle_gatekeeper;
    delete turtle_king;

    for(var i = 0; i < snowball.length; i++) {
        snowball[i].reload();
    }

    // Generate new platforms
    var randColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    for(var y = 0; y < height-40; y += 35) {
        for(var i = 0; i < 5; i++) {
            var x = noise(i, y) * width;
            if(noise(y, i) > 0.5) {
                platforms.push(new Platform(x, y, 55, color(randColor)));
            }
        }
    }

    // Creating Sprites
    var ran_x = rand_between(0, width-100);
    var ran_y = rand_between(0, height-300);
    bunny_warrior.move(width / 2 - 30, height - 90);
    turtle_minion = new Turtle_Minion(getAnimationVector(animation_data[3].frames, sheet_data[3]), ran_x, ran_y, true, 0.1);
    turtle_gatekeeper = new Turtle_Gatekeeper(getAnimationVector(animation_data[6].frames, sheet_data[6]), ran_x, ran_y, true, 0.1);
    turtle_king = new Turtle_King(getAnimationVector(animation_data[9].frames, sheet_data[9]), ran_x, ran_y, true, 0.1);

    // Generate enemy platforms
    platforms.push(new Platform(bunny_warrior.x-50, bunny_warrior.y + 80, 160, color("#f0ead6")));
    platforms.push(new Platform(turtle_minion.x, turtle_minion.y + turtle_minion.h, 65, color("#a1c4e4")));
    platforms.push(new Platform(turtle_gatekeeper.x, turtle_gatekeeper.y + turtle_gatekeeper.h, 120, color("#000080")));
    platforms.push(new Platform(turtle_king.x, turtle_king.y + turtle_king.h, 65, color("#90ee90")));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function rand_between(min,max) {
    return Math.floor(Math.random() * max) + min;
} 

function handleBackground() {
    if(bunny_warrior.dead == false) {
        image(bg, 0, y1, width, height);
        image(bg, 0, y2, width, height);
    }
    else {
        tint(100,255);
        image(bg, 0, y1, width, height);
        image(bg, 0, y2, width, height);
        tint(255,255);
    }
    
    if (y1 >= height){
      y1 = -height;
    }
    if (y2 >= height){
      y2 = -height;
    }
}

function handleEnemies() {
    turtle_minion.show();
    turtle_minion.animate();
    // Play death animation one time before hiding the enemy sprite
    if(!turtle_minion.onScreen && floor(turtle_minion.index) >= turtle_minion.animation.length) {
        turtle_minion.move(width, height);
    }

    turtle_gatekeeper.show();
    turtle_gatekeeper.animate();
    if(!turtle_gatekeeper.onScreen && floor(turtle_gatekeeper.index) >= turtle_gatekeeper.animation.length) {
        turtle_gatekeeper.move(width, height);
    }

    turtle_king.show();
    turtle_king.animate();
    if(!turtle_king.onScreen && floor(turtle_king.index) >= turtle_king.animation.length) {
        turtle_king.move(width, height);
    }
}

function handleBunny() {
    // If player is on a platform apply negative gravity 
    if(bunny_warrior.onPlatform == true) {
        bunny_warrior.applyForce(0, -GRAVITY);
    }

    if(bunny_warrior.dead == false) {
        bunny_warrior.applyForce(0, -bunny_warrior.force);
        bunny_warrior.force *= 0.9;
    }

    // If player has touched an enemy
    if (checkIfInHitbox(bunny_warrior, turtle_minion) && turtle_minion.onScreen || 
        checkIfInHitbox(bunny_warrior, turtle_gatekeeper) && turtle_gatekeeper.onScreen || 
        checkIfInHitbox(bunny_warrior, turtle_king) && turtle_king.onScreen) {
        endGame();
    }
    // If player has fallen off the map
    if(bunny_warrior.y > height) {
        endGame();
    }

    bunny_warrior.show();
    bunny_warrior.animate();

    // If player dies then the sprite will remain in place
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
            }
            else if(checkIfInHitbox(snowball[i], turtle_king)) {
                turtle_king.death();
            }
            
            snowball[i].changeState(animation_data[13].frames, sheet_data[13]);
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
    // Shell display
    stroke(2);
    textAlign(LEFT);
    strokeWeight(3);
    textSize(18);
    fill("#509fff");
    rect(0, height-50, 150, 50, 20, 20, 20, 5);
    fill("#ffffff");
    text("Shells = "+ shells, 10, height -18);
    image(shellImage, 105, height- 42);

    // Score display
    stroke(2);
    strokeWeight(3);
    textSize(18);
    fill("#ffffff");
    rect(width-150, height-50, 150, 50, 20, 20, 5, 20);
    fill("#a1c4e4");
    text("Score = " + score, width-130, height -18);

    // Levels display
    stroke(2);
    strokeWeight(3);
    textSize(20);
    fill("#ffffff");
    text("Level: " + level, 10, 25);

    let offset_x = 6;
    // Snowball ammo display
    for(var i = 0; i < floor(shells / snowball_mod) + 1; i++) {
        image(snowballImage, offset_x, height- 90, 20,40);
        offset_x+= 18;
    }
        
}

function handlePlatforms() {
    for(var i = 0; i < platforms.length; i++) {
        
        platforms[i].draw();

        if(platforms[i].collidesWith(bunny_warrior)) {
            bunny_warrior.force = 15;
            platforms[i].y += 5;

            bunny_warrior.onPlatform = true;
        }
    }
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
    }
}

function mouseClicked() {
    // Gain the ability to fire more snowballs based on how many
    // shells youve collected. Every 10 shells you gain 1 more
    // snowball ammo.
    if(bunny_warrior.dead == false) {
        snowball_ammo = shells / snowball_mod;
        if(snowball.length < floor(snowball_ammo) + 1) {
            snowball.push(new Snowball(getAnimationVector(animation_data[12].frames, sheet_data[12]), bunny_warrior.x+10, bunny_warrior.y+20, true, 0.6));
            snowball[snowball.length-1].thrown = true;
            snowball[snowball.length-1].target = createVector(mouseX, mouseY);
        }
    }
}
