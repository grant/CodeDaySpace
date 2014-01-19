// var actors = new
function World() {
	var self = this;
    //initialization: initalize networking class
	var actors = {};
	var id1 = 111;
    actors[id1]=(new Actor({
		userId: 'grant',
		actorId: id1,
		type: 'ship',
		x: 50,
		y: 50,
		vx: 0,
		vy: 0,
		maxV: 100,
		maxA: 10,
		scale: 1,
		img: 'img/spaceship.png'
    }));
    var id2 = 222;
    actors[id2]=(new Actor({
		userId: 'alex',
		actorId: id2,
		type: 'ship',
		width: 100,
		height: 1500,
		x: 450,
		y: 450,
		vx: 0,
		vy: 0,
		maxV: 100,
		maxA: 10,
		scale: 1,
		img: 'img/spaceship.png'
	}));

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
			actor.update(ms);
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