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
    }

    setX(x) { this.x = x; }
    setY(y) { this.y = y; } 
    
    show() {
        let index = floor(this.index) % this.length;
        image(this.animation[index], this.x, this.y);
    }

    animate() {
        this.index += this.speed;
        // Movement in -x direction
        //this.x -= this.speed * 5;
    
        if(this.y < -90) {
            this.y = height;
        }
        if(this.x < -50) {
            this.x = width;
        }
        if(this.x > width) {
            this.x = -50;
        }
    }

    changeState(data, sheet) {
        this.animation = getAnimationVector(data, sheet);
    }

    hide() {
        this.x = -200;
        this.y = -200;
    }

    applyForce(x, y) {
        this.x += x;
        this.y += y;
    }
}

class Bunny_Warrior extends Sprite {
    jump() {
        this.vel.mult(0);
        this.applyForce(0, -10);
    }
}

class Turtle_King extends Sprite {

}

class Turtle_Gatekeeper extends Sprite {

}

class Turtle_Minion extends Sprite {

}

class Snowball extends Sprite {
    flyspeed = 5;
    thrown = false;
    fly(targX, targY) {
        let diffX = targX - this.x;
        let diffY = targY - this.y;
        let stepX = diffX / this.flyspeed;
        let stepY = diffY / this.flyspeed;
        while(abs(this.x - targX) > 5 && abs(this.y - targY) > 5) {
            this.applyForce(stepX, stepY)
        }
        this.thrown = false;
    }
}