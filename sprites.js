let data;
let sheet;
class Sprite {
    constructor(animation, x, y, enemy, speed) {
        this.x = x;
        this.y = y;
        this.animation = animation;
        this.onPlatform = true;
        this.enemy = enemy;
        this.w = this.animation[0].width;
        this.h = this.animation[0].height;
        this.length = this.animation.length;
        this.speed = speed;
        this.index = 0;
        this.dead = false;

        this.onScreen = true;
        this.velocity = createVector(0, 0);
        this.maxAltitude = y;
        this.force = 12;
        this.animationCounter = 0;
    }

    move(x, y) {
        this.x = x;
        this.y = y; 
    }
    
    show() {
        let index = floor(this.index) % this.length;
        image(this.animation[index], this.x, this.y);
    }

    animate() {
        this.index += this.speed;

        if(this.x < -50) {
            this.x = width;
        }
        if(this.x > width) {
            this.x = -50;
        }
    }

    hide() {
        this.x = width;
        this.y = height;
        this.onScreen = false;
    }

    changeState(data, sheet) {
        this.animation = getAnimationVector(data, sheet);
    }

    applyForce(x, y) {
        this.x += x;
        this.y += y;
    }
}

class Bunny_Warrior extends Sprite {
    death() {
        this.speed = 0.05;
        if(this.dead == false) {
            this.index = 2;
        }
        this.changeState(animation_data[2].frames, sheet_data[2]);
        this.dead = true;
    }
}

class Turtle_Minion extends Sprite {
    death() {
        this.speed = 0.03;
        this.index = 0;
        this.changeState(animation_data[5].frames, sheet_data[5]);
        if(this.onScreen == true) {
            score += 10;
            shells += 1;
        }
        this.onScreen = false;
    }
}

class Turtle_Gatekeeper extends Sprite {
    death() {
        this.speed = 0.05;
        this.index = 7;
        this.changeState(animation_data[8].frames, sheet_data[8]);
        if(this.onScreen == true) {
            score += 25;
            shells += 1;
        }
        this.onScreen = false;
    }
}

class Turtle_King extends Sprite {
    death() {
        this.speed = 0.05;
        this.index = 8;
        this.changeState(animation_data[11].frames, sheet_data[11]);
        if(this.onScreen == true) {
            score += 50;
            shells += 1;
        }
        this.onScreen = false;
    }
}

class Snowball extends Sprite {
    flyspeed = 20;
    thrown = false;
    target = createVector(width, height);
    reload() {
        this.x = width;
        this.y = height;
        this.target = createVector(width, height);
    }
}
