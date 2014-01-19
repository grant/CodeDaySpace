var $spaceArea = $('.spaceArea');

function Actor (params) {
    var self = this;
    this.width = params.width;
    this.height = params.height;
    this.xdes = params.xdes || 0;
    this.ydes = params.ydes || 0;
    this.userId = params.userId;
    this.actorId = params.actorId;
    this.type = params.type;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.vx = params.vx || 0;// x velocity
    this.vy = params.vy || 0;// y velocity
    this.maxV = params.maxV;
    this.maxA = params.maxA || 1;
    this.img = params.img;
    this.scale = params.scale;
    this.angle = 0;
    this.rot = 0; // rotation in degrees
    this.rotOffset = 90;

    var createShip = function () {
        var $ship = $('<img/>');
        $ship.addClass(self.type);
        $ship.data('id', self.actorId);
        $ship.attr('src', self.img);
        $spaceArea.append($ship);
        return $ship;
    };

    this.update = function (deltaT) {
        self.x += self.vx * (deltaT/1000);
        self.y += -self.vy * (deltaT/1000);

        var ydiff = self.y - self.ydes;
        var xdiff = self.xdes - self.x;
        var angle = Math.atan2(ydiff, xdiff);

        // Accelerate v
        self.vx += self.maxA * Math.cos(angle);
        self.vy += self.maxA * Math.sin(angle);
        if (self.vx > self.maxV) {
            self.vx = self.maxV;
        }
        if (self.vy > self.maxV) {
            self.vy = self.maxV;
        }
        self.angle = angle;
        self.rot = -(180/Math.PI) * angle + self.rotOffset;

        // if close
        if (Math.sqrt(xdiff*xdiff + ydiff*ydiff) < 100) {
            self.vx *= .9;
            self.vy *= .9;

            if (self.vx < 3) {
                self.vx = 0;
            }
            if (self.vy < 3) {
                self.vy = 0;
            }
        }

    };

    this.repaint = function () {
        self.dom.css('left', self.x);
        self.dom.css('top', self.y);
        var rotText = 'rotate('+self.rot+'deg)';
        self.dom.css('transform', rotText);
    };

    this.getV = function () {
        return Math.sqrt(self.vx * self.vx + self.vy * self.vy);
    };

    this.goto = function (point) {
        self.xdes = point.x;
        self.ydes = point.y;
    };

    this.dom = createShip();
}