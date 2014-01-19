// var actors = new
function World() {
	var self = this;
    //initialization: initalize networking class
    var actors = [];
    actors.push(new Actor({
		userId: 'grant',
		actorId: 23,
		type: 'ship',
		x: 10,
		y: 10,
		vx: 0,
		vy: 0,
		maxV: 100,
		maxA: 10,
		scale: 1,
		img: 'img/spaceship.png'
    }));
    actors.push(new Actor({
         userId: 'alex',
         actorId: 23,
         type: 'ship',
         width: 100,
         height: 1500,
         x: 550,
         y: 550,
         vx: 10,
         vy: 20,
         size: 1,
         img: '/img/spaceship.png'
     }));

    this.UIEvent = function (uiEvent) {
        var click = uiEvent.click;
        for (var i in actors) {
            var actor = actors[i];
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