/// <reference path="actor.js" />

function Base(params) {
    Actor.call(this, params);

    var self = this;
    this.health = params.health || 1000;

    this.repaint();

    var parentSer = this.serialize;
    this.serialize = function () {
        return parentSer() +
            Helpers.packFloat(this.health);
    };
};

Base.deserialize = function (data, ind) {
    var params = Actor.deserialize(data, ind);
    params.health = Helpers.parseFloat(data, ind);
    return params;
};