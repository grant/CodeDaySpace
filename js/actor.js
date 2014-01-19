/// <reference path="helpers.js" />

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
    this.rot = params.rot || 0; // rotation in degrees
    this.rotOffset = params.rotOffset || 0;


    var createActor = function () {
        var $ship = $('<img/>');
        $ship.addClass(self.type);
        $ship.data('id', self.actorId);
        $ship.attr('src', self.img);
        $ship.css("height",self.height);
        $ship.css("width", self.width);
        $ship.css("position", "absolute")
        $spaceArea.append($ship);
        return $ship;
    };



    this.setId = function (id) {
        self.dom.data('id', this.actorId = id);
    };

    this.repaint = function () {
        self.dom.css('left', self.x);
        self.dom.css('top', self.y);
        var rotText = 'rotate('+self.rot+'deg)';
        self.dom.css('transform', rotText);
    };

    this.dom = createActor();

    this.serialize = function () {
        return (Helpers.packFloat(self.x) +
            Helpers.packFloat(self.y) +
            Helpers.packFloat(self.width) +
            Helpers.packFloat(self.height) +
            Helpers.packFloat(self.rot) +
            Helpers.packFloat(self.rotOffset) +
            Helpers.packInt(self.actorId) +
            Helpers.packInt(self.img.length) +
            self.img);
    };
}

Actor.deserialize = function (data, ind) {
    var params = {
        x: Helpers.parseFloat(data, ind),
        y: Helpers.parseFloat(data, ind),
        width: Helpers.parseFloat(data, ind),
        height: Helpers.parseFloat(data, ind),
        rot: Helpers.parseFloat(data, ind),
        rotOffset: Helpers.parseFloat(data, ind),
        actorId : Helpers.parseInt(data, ind)
    };
    imgLen = Helpers.parseInt(data, ind);
    params.img = data.substr(ind.ind, imgLen);
    ind.ind += imgLen;
    return params;
};

Actor.SPACESHIP = 0;
Actor.LASER = 1;
Actor.RESOURCES = 2;

var COSTS = {};
COSTS[Actor.SPACESHIP] =
    {
        minerals: 200,
        gas: 10
    };
