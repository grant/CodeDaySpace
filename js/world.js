/// <reference path="net.js" />
/// <reference path="actor.js" />
/// <reference path="spaceship.js" />
/// <reference path="resources.js" />
/// <reference path="ui.js" />
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
    var base;

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

        if ((resources.minerals >= cost.minerals) &&
            (resources.gas >= cost.gas)) {
            resources.minerals -= cost.minerals;
            resources.gas -= cost.gas;
            var newShip = new Spaceship({
                userId: playerId,
                type: type,
                width: 100,
                height: 100,
                laserFired: false,
                x: Math.random() * 500 - 250 + base.x,
                y: Math.random() * 500 - 250 + base.y,
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
            x: actor.x + 0.5 * actor.width,
            y: actor.y + 0.5 * actor.height,
            img: 'img/laser'+String(actor.userId%3)+'.png',
            rot: actor.rot,
            rotOffset: 150,
            v: 10000,
            xdes: p[0],
            ydes: p[1],
            frameLife: 5,
            damage: 30
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
            var act;
            switch (actType) {
                case Actor.SPACESHIP: //spaceship
                    act = new Spaceship(Spaceship.deserialize(data, ind));
                    break;
                case Actor.LASER:
                    var act = new Laser(Laser.deserialize(data, ind));
                    break;
                case Actor.RESOURCES:
                    var act = new Resources(Resources.deserialize(data, ind));
                    break;
                case Actor.BASE:
                    var act = new Base(Base.deserialize(data, ind));
                    break;
            }
            act.userId = uId;
            act.type = actType;
            acts.push(act);
        }
        return acts;
    };

    var deserialize = function (data) {
        var acts = unpackActors(data);
        acts.forEach(function (act) {
            if ((act.type == Actor.LASER) || (act.type == Actor.SPACESHIP) || (act.type == Actor.BASE)) {
                act.repaint();
            }
            if (act.type == Actor.LASER) {
                for (var i = actors.length - 1; i >= 0; i--) {
                    var cact = actors[i];
                    if ((cact.type == Actor.SPACESHIP) || (act.type == Actor.BASE)) {
                        if ((cact.x - act.x) * (cact.x - act.x) + (cact.y - act.y) * (cact.y - act.y) < 3000) {
                            cact.health -= act.dmg;
                            if (cact.health < 0) {
                                cact.dom.remove();
                                actors.pop(i);
                            }
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
            } else if (!click.ctrl) {
                if (act.goto) {
                    act.goto(click);
                }
            }
        });
    };

    this.updateActors = function (ms) {
        actors.filter(function (act) { //remove lasers that have expired
            return (act.type == Actor.LASER) && (act.frameLife <= 0);
        }).forEach(function(act) { act.dom.remove(); });

        actors = actors.filter(function (act) { //remove these lasers from the actors array
            return (act.type != Actor.LASER) || (act.frameLife > 0);
        });

        actors.forEach(function (act) {
            if (act.type == Actor.SPACESHIP) {
                baddiePos = act.closestBaddie(otherActors); //returns the closest bad guy
                if (typeof (baddiePos) != "undefined") {
                    if (!act.laserFired) {
                        act.laserFired = true;
                        spawnLaser(act, [baddiePos[0], baddiePos[1]]);
                    }
                }
            }

            if ((act.type == Actor.SPACESHIP) || (act.type == Actor.LASER)) {
                if (act.update) {
                    act.update(ms, actors);
                }
                act.repaint();
            }
        });
        ui.updateResourceUI(resources);
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
                                userId: playerId,
                                actorId: 0,
                                type: Actor.RESOURCES,
                                minerals: 1000,
                                gas: 100
                            });
                            actors.push(resources);

                            var checkLoc = function (loc) {
                                var minD = acts.reduce(function (cur, act) {
                                    if ((act.type == Actor.SPACESHIP) ||
                                        (act.type == Actor.BASE)) {
                                        var d = Math.sqrt((loc.x - act.x) * (loc.x - act.x) + (loc.y - act.y) * (loc.y - act.y));
                                        return Math.min(cur, d);
                                    }
                                    return cur;
                                }, 999999);
                                return minD > 700;
                            };

                            var genLoc = function (acts) {
                                var rad = Math.random() * 1000 + 500;
                                var theta = Math.random() * Math.PI * 2;
                                var ind = Math.floor(Math.random() * acts.length);
                                return {
                                    x: acts[ind].x + rad * Math.cos(theta),
                                    y: acts[ind].y + rad * Math.sin(theta)
                                };
                            };
                            var baseLoc = { x: 0, y: 0 }
                            var enActs = acts.filter(function (act) { return (act.type == Actor.SPACESHIP) || (act.type == Actor.BASE); });
                            if (enActs.length > 0) {
                                baseLoc = genLoc(enActs);
                                while (!checkLoc(baseLoc)) {
                                    baseLoc = genLoc(enActs);
                                }
                            }

                            base = new Base({
                                userId: playerId,
                                actorId: 0,
                                type: Actor.BASE,
                                img: "img/base.jpg",
                                width: 200,
                                height: 200,
                                x: baseLoc.x,
                                y: baseLoc.y,
                                health: 1000
                            });
                            actors.push(base);
                        } else {
                            resources = res[0];
                            base = actors.filter(function (act) { return act.type == Actor.BASE; })[0];
                        }
                        
                        otherActors = acts.filter(function (act) { return act.userId != playerId; });

                        ui = new UI(self);

                        ui.centerTo(base.x, base.y);

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

    // Used for minimap
    function getActors() {
        return {
            other: otherActors,
            yours: actors
        };
    };
    function updateMinimap () {
        var actors = getActors();
        if (ui) {
            ui.updateMinimap(actors);
        }
    }
    window.setInterval(function () {
        updateMinimap();
    }, 50);


    this.offline = function () {
        playerId = 0;
        players = [{ name: "sda", id: 0 }];
        ui = new UI(self);
        var ms = 100;
        resources = new Resources({
            userId: 0,
            actorId: 0,
            type: Actor.RESOURCES,
            minerals: 10000,
            gas: 1000
        });
        actors.push(resources);


        base = new Base({
            userId: playerId,
            actorId: 0,
            type: Actor.BASE,
            img: "img/base.jpg",
            width: 200,
            height: 200,
            x: 500,
            y: 500,
            health: 1000
        });
        actors.push(base);
        window.setInterval(function () {
            self.updateActors(ms);
        }, ms);
        net = {
            pushPull: function (data, cBack) { cBack(""); }
        };
    };
};
