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

    this.update = function (deltaT, actors) {
        var ydiff = self.ydes - (self.y + 0.5 * self.height);
        var xdiff = self.xdes - (self.x + 0.5 * self.width);
        if (xdiff * xdiff + ydiff * ydiff < 50)
            return

        var angle = Math.atan2(xdiff, ydiff);

        forces = this.force(actors);
        //console.log(forces);

        // v accelerates in direction towards destination
        var deltaLen = xdiff * xdiff + ydiff * ydiff;
        var acceleration = deltaLen * deltaT;
        if (acceleration > self.maxA)
            acceleration = self.maxA;
        //console.log(acceleration);

        self.vx += xdiff * acceleration / deltaLen * deltaT;
        self.vy += ydiff * acceleration / deltaLen * deltaT;

        var vlen = Math.sqrt(self.vx * self.vx + self.vy * self.vy);
        if (vlen > self.maxV) {
            self.vx = self.vx / vlen * self.maxV;
            self.vy = self.vy / vlen * self.maxV;
        }

        self.rot = -(180 / Math.PI) * angle + self.rotOffset;

        var prevPos = [self.x, self.y]; //position before updating
        if (self.still < 2) {
            self.x += self.vx * deltaT / 10000;
            self.y += self.vy * deltaT / 10000;
        }

        if (Math.pow(self.x - prevPos[0], 2) + Math.pow(self.y - prevPos[1], 2) > 100 || xdiff * xdiff + ydiff * ydiff > 50) {
            self.still = 0;
        } else {
            self.still++;
        }

        if (self.still > 2) {
            self.vx = 0;
            self.vy = 0;
        }
    };

    this.force = function (actors) {
        var forcex = 0;
        var forcey = 0;
        //        var thisRadius = Math.sqrt(Math.pow(self.width * 0.5,2) + Math.pow(self.height*0.5,2));
        for (var i in actors) {
            curActor = actors[i];
            if (curActor.userId != self.userId || curActor.actorId != self.actorId) {
                //                var curRadius = Math.sqrt(Math.pow(curActor.width * 0.5,2) + Math.pow(curActor.height*0.5,2));
                var xToAdd = 1 / Math.exp((Math.abs(self.x - curActor.x) - self.width * 0.5 - curActor.width * 0.5) / 100);
                if (curActor.x < self.x)
                    xToAdd *= -1;
                var yToAdd = 1 / Math.exp((Math.abs(self.y - curActor.y) - self.height * 0.5 - curActor.height * 0.5) / 100);
                if (curActor.y < self.y)
                    yToAdd *= -1;
                forcex += xToAdd;
                forcey += yToAdd;
            }
        }
        return [forcex, forcey];
    };

    var parentSer = this.serialize;
    this.serialize = function () {
        return parentSer() +
            Helpers.packFloat(this.maxV) +
            Helpers.packFloat(this.maxA);
    };


    this.getV = function () {
        return Math.sqrt(self.vx * self.vx + self.vy * self.vy);
    };


    this.goto = function (point) {
        self.xdes = point.x;
        self.ydes = point.y;
    };

};

Spaceship.deserialize = function (data, ind) {
    var params = Actor.deserialize(data, ind);
    params.maxV = Helpers.parseFloat(data, ind);
    params.maxA = Helpers.parseFloat(data, ind);
    return params;
};