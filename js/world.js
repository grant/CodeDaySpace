/// <reference path="net.js" />
/// <reference path="actor.js" />
/// <reference path="spaceship.js" />
/// <reference path="resources.js" />
// var actors = new
function World() {
    var self = this;
    //initialization: initalize networking class
    var ui;
    var playerId;
    var players;
    var net;

    var otherActors = [];
    var actors = [];
    var resources;

    this.addActor = function (actor) {
        var id = 0;
        while (actors.filter(function (act) { return act.actorId == id; }).length > 0)
            id++;
        actor.setId(id);
        actors.push(actor);
    };

    this.spawnShip = function () {
        var type = Actor.SPACESHIP;
        var cost = COSTS[type];

        if ((resources.minerals > cost.minerals) &&
            (resources.gas > cost.gas)) {
            resources.minerals -= cost.minerals;
            resources.gas -= cost.gas;
            var newShip = new Spaceship({
                userId: playerId,
                type: type,
                width: 100,
                height: 100,
                laserFired: false,
                x: Math.random() * 500,
                y: Math.random() * 500,
                vx: 0,
                vy: 0,
                maxV: 1500,
                maxA: 1000,
                img: 'img/spaceship' + String(playerId % 3) + '.png',
                health: 200
            });
            self.addActor(newShip);
        }
    };

    var spawnLaser = function (actor,p) {
        var newLaser = new Laser({
            width: 5,
            height: 50,
            userId: actor.userId,
            type: Actor.LASER,
            x: actor.x+0.5*actor.width,
            y: actor.y + 0.5 * actor.height,
            img: 'img/laser'+String(actor.userId%3)+'.png',
            rot: actor.rot,
            rotOffset: 150,
            v: 10000,
            xdes: p[0],
            ydes: p[1],
            frameLife: 5
        });
        self.addActor(newLaser);
    }

    var serialize = function () {
        return actors.reduce(function (cur, act) {            
            return cur + String.fromCharCode(playerId, act.type) + act.serialize();
        }, "");
    };

    var unpackActors = function (data) {
        var ind = { ind: 0 };
        var acts = [];
        while (ind.ind < data.length) {
            var uId = data.charCodeAt(ind.ind++);
            var actType = data.charCodeAt(ind.ind++);
            switch (actType) {
                case Actor.SPACESHIP: //spaceship
                    var act = new Spaceship(Spaceship.deserialize(data, ind));
                    act.userId = uId;
                    act.type = actType;
                    acts.push(act);
                    break;
                case Actor.LASER:
                    var act = new Laser(Laser.deserialize(data, ind));
                    act.userId = uId;
                    act.type = actType;
                    acts.push(act);
                    break;
                case Actor.RESOURCES:
                    var act = new Resources(Resources.deserialize(data, ind));
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
        acts.forEach(function (act) {
            if ((act.type == Actor.LASER) || (act.type == Actor.SPACESHIP)) {
                act.repaint();
            }
            if (act.type == Actor.LASER) {
                for (var i = actors.length - 1; i >= 0; i--)
                    var cact = actors[i];
                if (cact.type == Actor.SPACESHIP) {
                    if ((cact.x - act.x) * (cact.x - act.x) + (cact.y - act.y) * (cact.y - act.y) < 30) {
                        cact.health -= act.dmg;
                        if (cact.health < 0) {
                            cact.dom.remove();
                            actors.pop(i);
                        }
                    }
                }
            }
        });
        otherActors.forEach(function (act) { act.dom.remove(); });
        otherActors = acts;
    };

    this.UIEvent = function (uiEvent) {
        var click = uiEvent.click;
        uiEvent.click.selected.reduce(function (cur, i) {
            return cur.concat(actors.filter(function (act) { return act.actorId == i; }));
        }, []).forEach(function (act) {
            if (click.ctrl && !act.laserFired) {
                act.laserFired = true;
                spawnLaser(act, [click.x, click.y]);
            }
            else
                act.goto(click);
        });
    };

    this.updateActors = function (ms) {
        actors.filter(function (act) {
            return (act.type == Actor.LASER) && (act.frameLife <= 0);
        }).forEach(function(act) { act.dom.remove(); });

        actors = actors.filter(function (act) {
            return (act.type != Actor.LASER) || (act.frameLife > 0);
        });

        actors.forEach(function (act) {
            if ((act.type == Actor.SPACESHIP) || (act.type == Actor.LASER)) {
                act.update(ms, actors);
                act.repaint();
            }
        });
        var dta = serialize();
        net.pushPull(dta, function (data) {
            deserialize(data);
        });
    };

    this.login = function (name, cBack) {
        net = new Network(function () {
            net.login(name, function (plId) {
                playerId = plId;
                net.getPlayers(function (pls) {
                    players = pls;

                    net.getAllActors(function (allData) {

                        var acts = unpackActors(allData);

                        actors = acts.filter(function (act) { return act.userId == playerId; });
                        var res = actors.filter(function (act) { return act.type == Actor.RESOURCES; });
                        if (res.length == 0) {
                            resources = new Resources({
                                minerals: 1000,
                                gas: 100
                            });
                            actors.push(resources);
                        } else {
                            resources = res[0];
                        }
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
        });
    };

    this.offline = function () {
        playerId = 0;
        players = [{ name: "sda", id: 0 }];
        ui = new UI(self);
        var ms = 100;
        resources = new Resources({
            minerals: 1000,
            gas: 100
        });
        actors = [resources];
        window.setInterval(function () {
            self.updateActors(ms);
        }, ms);
        net = {
            pushPull: function (data, cBack) { cBack(""); }
        };
    };
};
