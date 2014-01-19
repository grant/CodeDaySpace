var $spaceArea = $('.spaceArea');

function Actor (params) {
    var self = this;
    this.width = params.width;
    this.height = params.height;
    this.userId = params.userId;
    this.actorId = params.actorId;
    this.type = params.type;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.img = params.img;
    this.rot = 0; // rotation in degrees
    this.rotOffset = params.rotOffset || 0 ;

    this.serialize = function () {
        return {
            width: this.width,
            height: this.height,
            userId: this.userId,
            actorId: this.actorId,
            type: this.type,
            x: this.x,
            y: this.y,
            img: this.img,
            rot: this.rot,
            rotOffset: this.rotOffset
        };
    };

    var createActor = function () {
        var $ship = $('<img/>');
        $ship.addClass(self.type);
        $ship.data('id', self.actorId);
        $ship.attr('src', self.img);
        $ship.css("height",self.height);
        $ship.css("width", self.width);
        $ship.css("position", "absolute");
        $spaceArea.append($ship);
        return $ship;
    };

    this.repaint = function () {
        self.dom.css('left', self.x);
        self.dom.css('top', self.y);
        var rotText = 'rotate('+self.rot+'deg)';
        self.dom.css('transform', rotText);
    };

    this.dom = createActor();
}