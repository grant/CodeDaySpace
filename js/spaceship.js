/// <reference path="actor.js" />

function Spaceship(params) {
    Actor.call(this, params);

    var self = this;
    this.xdes = params.xdes || params.x + params.width * 0.5 || 0;
    this.ydes = params.ydes || params.y + params.height * 0.5 || 0;
    this.vx = params.vx || 0; // x velocity
    this.vy = params.vy || 0; // y velocity
    this.maxV = params.maxV;
    this.maxA = params.maxA || 1;
    this.still = 0;
    this.health = params.health || 100;
    this.laserFired = false;

    var cooldown= 15;
    var timeSinceLaser = cooldown;
    this.dom.addClass('ship');

    this.update = function (deltaT, actors) {
        if (this.laserFired) {
            timeSinceLaser--;
            if (timeSinceLaser == 0) {
                timeSinceLaser = cooldown;
                this.laserFired = false;
            }
        }

        var ydiff = self.ydes - (self.y + 0.5 * self.height);
        var xdiff = self.xdes - (self.x + 0.5 * self.width);
        if (xdiff * xdiff + ydiff * ydiff < 3) {
            self.vx = 0;
            self.vy = 0;
        } else if (xdiff * xdiff + ydiff * ydiff < 50) {
            self.vx /= 2;
            self.vy /= 2;
        } else {

            var angle = Math.atan2(xdiff, ydiff);
            //forces = this.force(actors);

            // v accelerates in direction towards destination
            var deltaLen = xdiff * xdiff + ydiff * ydiff;
            var acceleration = deltaLen * deltaT;
            if (acceleration > self.maxA)
                acceleration = self.maxA;

            self.vx += xdiff * acceleration / deltaLen * deltaT;
            self.vy += ydiff * acceleration / deltaLen * deltaT;

            var vlen = Math.sqrt(self.vx * self.vx + self.vy * self.vy);
            if (vlen > self.maxV) {
                self.vx = self.vx / vlen * self.maxV;
                self.vy = self.vy / vlen * self.maxV;
            }
        }
        self.rot = -(180 / Math.PI) * angle + self.rotOffset;

        var prevPos = [self.x, self.y]; //position before updating
            
        if ((Math.pow(self.x - prevPos[0], 2) + Math.pow(self.y - prevPos[1], 2) > 700) || (xdiff * xdiff + ydiff * ydiff > 50)) {
            self.still = 0;
        } else {
            self.still++;
        }

        if (self.still < 20000000000000) {
            self.x += self.vx * deltaT / 10000;
            self.y += self.vy * deltaT / 10000;
        } else {
            self.vx = 0;
            self.vy = 0;
        }
    };

    this.force = function (actors) {
        return actors.reduce(function (cur, act) {
            var dis = Math.sqrt((act.x - self.x) * (act.x - self.x) + (act.y - self.y) * (act.y - self.y));
            
        }, [0, 0]);
    };

    var parentSer = this.serialize;
    this.serialize = function () {
        return parentSer() +
            Helpers.packFloat(this.maxV) +
            Helpers.packFloat(this.maxA) +
            Helpers.packFloat(this.health);
    };


    this.getV = function () {
        return Math.sqrt(self.vx * self.vx + self.vy * self.vy);
    };


    this.goto = function (point) {
        var randomScale = 300;
        var randx = Math.random() * randomScale - (randomScale/2);
        var randy = Math.random() * randomScale - (randomScale/2);

        self.xdes = point.x + randx;
        self.ydes = point.y + randy;
    };

};

Spaceship.deserialize = function (data, ind) {
    var params = Actor.deserialize(data, ind);
    params.maxV = Helpers.parseFloat(data, ind);
    params.maxA = Helpers.parseFloat(data, ind);
    params.health = Helpers.parseFloat(data, ind);
    return params;
};