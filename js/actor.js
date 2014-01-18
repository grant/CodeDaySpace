var $spaceArea = $('.spaceArea');

function Actor (params) {
    var self = this;
    this.xdestination = xdestination;
    this.ydestination = ydestination;
    this.userId = params.userId;
    this.actorId = params.actorId;
    this.type = params.type;
    this.x = params.x;
    this.y = params.y;
    this.xvelocity = params.xvelocity;
    this.yvelocity = params.yvelocity;
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
        self.x += self.xvelocity * (deltaT/1000);
        self.y += self.yvelocity * (deltaT/1000);
    };

    this.repaint = function () {
        self.dom.css('top', self.x);
        self.dom.css('left', self.y);
    };

    this.update_destination = function (mouseX, mouseY) {
        self.xdestination = mouseX;
        self.ydestination = mouseY;
        var velocityLength = Math.sqrt(self.xvelocity * self.xvelocity + self.yvelocity * self.yvelocity);
        var angle = Math.atan2(self.ydestination - self.y, self.xdestination - self.x);
        self.yvelocity = velocityLength * Math.sin(angle);
        self.xvelocity = velocityLength * Math.cos(angle);
    }

    this.dom = createShip();
}

// function actor() {
//     this.userId = "undefined";
//     this.x = 0;
//     this.y = 0;
//     this.type = "undefined";
//     this.xvelocity = 0;
//     this.yvelocity = 0;
//     this.img = "undefined";
//     this.size = 1;
// }