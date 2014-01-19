/// <reference path="net.js" />
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

	var otherActos = [];
	var actors = {};
	var id1 = 111;
    actors[id1]=(new Spaceship({
		userId: 'grant',
		actorId: id1,
		type: 'ship',
		width: 100,
		height: 100,
		x: 50,
		y: 50,
		vx: 0,
		vy: 0,
		maxV: 1500,
		maxA: 1000,
        rotOffset: 180,
		img: 'img/spaceship.png'
    }));
    var id2 = 222;
    actors[id2] = (new Spaceship({
		userId: 'alex',
		actorId: id2,
		type: 'ship',
		width: 100,
		height: 100,
		x: 550,
		y: 350,
		vx: 0,
		vy: 0,
		maxV: 1500,
		maxA: 1000,
		rotOffset: 180,
		img: 'img/spaceship.png'
	}));

	this.serialize = function () {
		var world = {
			actors: {}
		};
		for (var id in actors) {
			var actor = actors[id];
			var notUsers = true;
			if (notUsers) {
				world.actors[id] = actors[id].serialize();
			}
		}
		return JSON.stringify(world);
	};

	this.deserialize = function (data) {
	    var acts = JSON.parse(data);

	};

    this.UIEvent = function (uiEvent) {
        var click = uiEvent.click;
        if (click.ctrl) { //ctrl key was held down
            for (var i in click.selected) {
                var index = uiEvent.click.selected[i];
                var actor = actors[index];
                var laser = new Spaceship({
                    userId: actor.userId,
                    actorId: 100, //MAKE THIS A RANDOM NUMBER!
                    type: 'laser',
                    width: 5,
                    height: 50,
                    x: actor.x,
                    y: actor.y,
                    v: 1000000,
                    xdes: click[x],
                    ydes: click[y],
                    rotOffset: 180 + actor.rot,
                    img: 'img/laser.png'
                })
            }
        } else {
            for (var i in uiEvent.click.selected) {
                var index = uiEvent.click.selected[i];
                var actor = actors[index];
                actor.goto(click);
            }
        }
	};

	this.updateActors = function (ms) {
		for (var i in actors) {
			var actor = actors[i];
			actor.update(ms,actors);
			actor.repaint();
		}
		net.pushPull(self.serialize, function (data) {
		    self.deserialize(data);
		});
	};

	this.login = function (name, cBack) {
	    net.login(name, function (plId) {
	        playerId = plId;
	        net.getPlayers(function (pls) {
	            players = pls;
	            ui = new UI(self);
	            cBack();
	        });
	    });
	};

	// KEEP AT END
	var ms = 50;
	window.setInterval(function(){
		self.updateActors(ms);
	}, ms);
}
