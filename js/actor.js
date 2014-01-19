var $spaceArea = $('.spaceArea');

function Actor (params) {
    var self = this;
    this.xdes = params.xdes || 0;
    this.ydes = params.ydes || 0;
    this.userId = params.userId;
    this.actorId = params.actorId;
    this.type = params.type;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.vx = params.vx || 0;// x velocity
    this.vy = params.vy || 0;// y velocity
    this.img = params.img;
    this.size = params.size;

    var createShip = function () {
        var $ship = $('<img/>');
        $ship.addClass(self.type);
        $ship.attr('src', self.img);
        $spaceArea.append($ship);
        return $ship;
    };

    this.update = function (deltaT) {
        self.x += self.vx * (deltaT/1000);
        self.y += self.vy * (deltaT/1000);
    };

    this.repaint = function () {
        self.dom.css('top', self.x);
        self.dom.css('left', self.y);
    };

    this.goto = function (point) {
        self.xdes = point.x;
        self.ydes = point.y;
        var velocityLength = Math.sqrt(self.vx * self.vx + self.vy * self.vy);
        var angle = Math.atan2(self.y - self.ydes, self.xdes - self.x);
        console.log(angle);
        self.vy = velocityLength * Math.sin(angle);
        self.vx = velocityLength * Math.cos(angle);
    };

    this.forceAtPoint = function(point){
        var dist4 = Math.pow(self.x * self.x + self.y * self.y,2);
    }

    this.dom = createShip();
}

