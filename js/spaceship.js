function Spaceship(params) {
    Actor.call(this,params);

    var self = this;
    this.xdes = params.xdes || params.x || 0;
    this.ydes = params.ydes || params.y || 0;
    this.vx = params.vx || 0;// x velocity
    this.vy = params.vy || 0;// y velocity
    this.maxV = params.maxV;
    this.maxA = params.maxA || 1;
    this.angle = 0;

    this.update = function (deltaT, actors) {
        self.x += self.vx * (deltaT / 1000);
        self.y += -self.vy * (deltaT / 1000);

        var ydiff = self.y - self.ydes;
        var xdiff = self.xdes - self.x;
        var angle = Math.atan2(ydiff, xdiff);

        console.log(-(180 / Math.PI) * angle);
        //determine total force due to other actors
        forces = this.force(actors);
        console.log(forces);

        // v accelerates in direction towards destination
        self.vx += self.maxA * deltaT * Math.cos(angle);// + forces[0] * deltaT;
        self.vy += self.maxA * deltaT * Math.sin(angle);// + forces[1] * deltaT;
        if (self.vx > self.maxV) {
            self.vx = self.maxV;
        }
        if (self.vy > self.maxV) {
            self.vy = self.maxV;
        }
        self.angle = angle;
        self.rot = -(180 / Math.PI) * angle + self.rotOffset;

        // if close
        if (Math.sqrt(xdiff * xdiff + ydiff * ydiff) < 50) {
            var minV = 1;
            if (self.vx < minV) {
                self.vx = 0;
            }
            if (self.vy < minV) {
                self.vy = 0;
            }
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
    }


    this.getV = function () {
        return Math.sqrt(self.vx * self.vx + self.vy * self.vy);
    };


    this.goto = function (point) {
        self.xdes = point.x;
        self.ydes = point.y;
    };

}