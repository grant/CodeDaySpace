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
	//var actors = [new Spaceship({
	//    userId: 'grant',
	//    actorId: 1,
	//    type: 0,
	//    width: 100,
	//    height: 100,
	//    x: 50,
	//    y: 50,
	//    vx: 0,
	//    vy: 0,
	//    maxV: 100,
	//    maxA: 2,
	//    scale: 1,
	//    img: 'img/spaceship.png'
	//}), new Spaceship({
	//    userId: 'alex',
	//    actorId: 2,
	//    type: 0,
	//    width: 100,
	//    height: 100,
	//    x: 550,
	//    y: 350,
	//    vx: 0,
	//    vy: 0,
	//    maxV: 100,
	//    maxA: 2,
	//    scale: 1,
	//    img: 'img/spaceship.png'
    //})];

	this.spawnShip = function () {
	    actors.push(new Spaceship({
	        userId: playerId,
	        actorId: actors.length,
	        type: 0,
	        width: 100,
	        height: 100,
	        x: Math.random() * 500,
	        y: Math.random() * 500,
	        vx: 0,
	        vy: 0,
	        maxV: 100,
	        maxA: 2,
	        scale: 1,
	        img: 'img/spaceship.png'
	    }));
	};

	var serialize = function () {
	    var ret = actors.reduce(function (cur, act) {
	        return cur + String.fromCharCode(playerId, act.type) + act.serialize();
	    }, "");
	    return ret;
	};

	var deserialize = function (data) {
	    var ind = { ind : 0 };
	    var acts = [];
	    while (ind.ind < data.length) {
	        var uId = data[ind.ind++];
	        var actType = data[ind.ind++];
	        switch (actType) {
	            case 0: //spaceship
	                var newAct = Actor.deserialize(data, ind);
	                acts.push(newAct);
	                newAct.repaint();
	                break;
	        }
	    }
	    otherActors.forEach(function (act) { act.dom.remove(); });
	    otherActors = acts;
	};

    this.UIEvent = function (uiEvent) {
        var click = uiEvent.click;
        uiEvent.click.selected.reduce(function (cur, i) {
            return cur.concat(actors.filter(function (act) { return act.actorId == i; }));
        }, []).forEach(function (act) { act.goto(click); });
	};

	this.updateActors = function (ms) {
	    actors.forEach(function (act) { act.update(ms, actors); act.repaint(); });
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
	            ui = new UI(self);

	            // KEEP AT END
	            var ms = 1000;
	            window.setInterval(function () {
	                self.updateActors(ms);
	            }, ms);

	            cBack();
	        });
	    });
	};

}