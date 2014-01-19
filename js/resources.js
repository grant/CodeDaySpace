/// <reference path="actor.js"/>
var Resources = function (params) {
    Actor.call(this, params);

    this.minerals = params.minerals;
    this.gas = params.gas;

    var parentSer = this.serialize;
    this.serialize = function () {
        return parentSer() +
            Helpers.packFloat(this.minerals) +
            Helpers.packFloat(this.gas);
    };
};


Resources.deserialize = function (data, ind) {
    var params = Actor.deserialize(data, ind);
    params.minerals = Helpers.parseFloat(data, ind);
    params.gas = Helpers.parseFloat(data, ind);
    return params;
};