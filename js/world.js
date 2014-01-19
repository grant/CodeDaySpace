/// <reference path="net.js" />
/// <reference path="actor.js" />
/// <reference path="spaceship.js" />
// var actors = new
function World() {
    var self = this;
    //initialization: initalize networking class
    var ui;
    var playerId;
    var players;
    var hasConnected = false;
    var conCback;
    this.onconnected = function (cBack) {
        if (hasConnected)
            cBack();
        else
            conCback = cBack;
    };
    var net = new Network(function () {
        hasConnected = true;
        if (conCback != null)
            conCback();
    });

    var otherActors = [];
    var actors = [];

    this.addActor = function (actor) {
        var id = 0;
        while (actors.filter(function (act) { return act.actorId == id; }).length > 0) 
            id++;
        actor.actorId = id;
        actors.push(actor);
    };

    this.spawnShip = function () {
        newShip = new Spaceship({
            userId: playerId,
            type: 0,
            width: 100,
            height: 100,
            x: Math.random() * 500,
            y: Math.random() * 500,
            vx: 0,
            vy: 0,
            maxV: 1500,
            maxA: 1000,
            img: 'img/spaceship.png'
        });
        self.addActor(newShip);
    };

    var spawnLaser = function (actor) {
        newLaser = new Laser({
            width: 10,
            height: 50,
            userId: actor.userId,
            type: Actor.LASER,
            x: actor.x,
            y: actor.y,
            img: 'img/laser.png',
            rot: actor.rot,
            rotOffset: 180,
            v: 100000,
            xdes: actor.xdes,
            ydes: actor.ydes,
            frameLife: 5
        });
        self.addActor(newLaser);
    }

    var serialize = function () {
        return actors.reduce(function (cur, act) {
            return cur + String.fromCharCode(playerId, act.type) + act.serialize();
        }, "");;
    };

    var unpackActors = function (data) {
        var ind = { ind: 0 };
        var acts = [];
        while (ind.ind < data.length) {
            var uId = data.charCodeAt(ind.ind++);
            var actType = data.charCodeAt(ind.ind++);
            switch (actType) {
                case 0: //spaceship
                    var act = new Spaceship(Spaceship.deserialize(data, ind));
                    act.userId = uId;
                    act.type = actType;
                    acts.push(act);
                    break;
            }
        }
        return acts;
    };

    var deserialize = function (data) {
        var acts = unpackActors(data);
        acts.forEach(function (act) { act.repaint(); })
        otherActors.forEach(function (act) { act.dom.remove(); });
        otherActors = acts;
    };

    this.UIEvent = function (uiEvent) {
        var click = uiEvent.click;
        uiEvent.click.selected.reduce(function (cur, i) {
            return cur.concat(actors.filter(function (act) { return act.actorId == i; }));
        }, []).forEach(function (act) {
            if (click.ctrl) 
                spawnLaser(act);
            else
                act.goto(click);
        });
    };

    this.updateActors = function (ms) {
        actors = actors.filter(function (act) {
            return (act.type != Actor.LASER) || (act.frameLife >= 0);
        });
        actors.forEach(function (act) {
            act.update(ms, actors);
            act.repaint();
        });
        var dta = serialize();
        net.pushPull(dta, function (data) {
            deserialize(data);
        });
    };

    this.login = function (name, cBack) {
        net.login(name, function (plId) {
            playerId = plId;
            net.getPlayers(function (pls) {
                players = pls;

                net.getAllActors(function (allData) {

                    var acts = unpackActors(allData);

                    actors = acts.filter(function (act) { return act.userId == playerId; });
                    otherActors = acts.filter(function (act) { return act.userId != playerId; });

                    ui = new UI(self);

                    // KEEP AT END
                    var ms = 100;
                    window.setInterval(function () {
                        self.updateActors(ms);
                    }, ms);

                    cBack();
                });
            });
        });
    };

    this.offline = function () {
        playerId = 0;
        players = [{ name: "sda", id: 0 }];
        ui = new UI(self);
        var ms = 100;
        window.setInterval(function () {
            self.updateActors(ms);
        }, ms);
        net = {
            pushPull: function (data, cBack) { cBack(""); }
        };
    };
};
