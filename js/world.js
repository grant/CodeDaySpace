// var actors = new
function World() {
	var self = this;
    //initialization: initalize networking class
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
		maxV: 100,
		maxA: 2,
		scale: 1,
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
		maxV: 100,
		maxA: 2,
		scale: 1,
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
		return world;
	};

    this.UIEvent = function (uiEvent) {
        var click = uiEvent.click;
        for (var i in uiEvent.click.selected) {
			var index = uiEvent.click.selected[i];
            var actor = actors[index];
            actor.goto(click);
		}
	};

	this.updateActors = function (ms) {
		for (var i in actors) {
			var actor = actors[i];
			actor.update(ms,actors);
			actor.repaint();
		}
	};

	// KEEP AT END
	var ms = 50;
	window.setInterval(function(){
		self.updateActors(ms);
	}, ms);
}

function pushToServer() {
    //tell the newtorking class what to push to the server
}