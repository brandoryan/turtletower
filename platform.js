function Platform(x, y, width, color) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color;

    this.onScreen = true;
}

Platform.prototype.draw = function(altitude) {

    stroke(255);
    strokeWeight(3);
    fill(this.color);
    rect(this.x, this.y, this.width, 15);
    /*if(altitude - this.altitude < height / 2) {
        rect(this.x, (altitude - this.altitude + height / 2), this.size, 15);
    }
    else {
        this.onScreen = false;
    }
    */
};

Platform.prototype.collidesWith = function(sprite) {

    var pT = this.y - 15; // Top of platform
    var dB = sprite.y + sprite.h/2 + 15;  // Bottom of bunny

    if(Math.abs(pT - dB) < 5) {
        var lX = this.x-sprite.w+5;
        var rX = this.x + this.width-10;

        var x = sprite.x;
       
        if(x >= lX && x <= rX) {
            return true;
        }
    }

    return false;
}