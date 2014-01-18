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
		xvelocity: 10,
		yvelocity: 20,
		size: 1,
		img: '/img/spaceship.png'
    }));

	this.updateActors = function (ms) {
		for (var i in actors) {
			var actor = actors[i];
			actor.update(ms);
			actor.repaint();
		}
	};

	var ms = 100;
	window.setInterval(function(){
		self.updateActors(ms);
	}, ms);
}

function pushToServer() {
    //tell the newtorking class what to push to the server
}