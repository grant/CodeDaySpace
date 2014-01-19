function Laser(params) {
    Actor.call(this, params);

    var self = this;
    this.v = params.v || 100000;
    this.xdes = params.xdes || 0;
    this.ydes = params.ydes || 0;
    this.frameLife = params.frameLife;
    var ydiff = self.ydes - (self.y + 0.5 * self.height);
    var xdiff = self.xdes - (self.x + 0.5 * self.width);
    var angle = Math.atan2(ydiff, xdiff);
    this.rot = 90 + angle * (180 / Math.PI);
    this.dmg = params.damage;

    this.vx = this.v * Math.cos(angle);
    this.vy = this.v * Math.sin(angle);

    this.update = function (deltaT, actors) {
        self.x += self.vx * deltaT / 10000;
        self.y += self.vy * deltaT / 10000;
    };

    var parentSer = this.serialize;
    this.serialize = function () {
        return parentSer() +
            Helpers.packFloat(this.dmg);
    };
}

Laser.deserialize = function (data, ind) {
    var params = Actor.deserialize(data, ind);
    params.damage = Helpers.parseFloat(data, ind);
    return params;
};