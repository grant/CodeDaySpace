function UI(world) {
	var self = this;
    var $spaceArea = $('.spaceArea');
    this.selected = [];

    document.oncontextmenu = function() {return false;};
	$(document).mousedown(function(event){
		if (event.button === 2) {
			rightClick(event);
			return false;
		}
		return true;
	});

	$(document).keypress(function (event) {
	    world.spawnShip();
	});

	$spaceArea.click(function(event) {
	    if (event.which === 3) { //right click
			rightClick(event);
		}
		if (event.which === 1) { //left click
		    leftClick(event);
		}
    });

    function leftClick (event) {
        var $clickedObj = $(event.target);
        var actorId = $clickedObj.data("id");
        var index = self.selected.indexOf(actorId);
        var isImg = $clickedObj.prop('tagName') === 'IMG';
        if (isImg) {
	        if (index == -1) {
	            self.selected.push(actorId);
	        } else {
	            self.selected.splice(index, 1);
	        }
		} else {
			self.selected = [];
		}
		// change select state UI
		$spaceArea.children().removeClass('selected');
		for (var i in self.selected) {
			var index = self.selected[i];
			$spaceArea.find('img').filter(function(i) {
				return $(this).data('id') === index;
			}).addClass('selected');
		}
    }

    function rightClick (event) {
		var x = event.clientX;
		var y = event.clientY;
		world.UIEvent({
	        "click": {
	            x: x,
	            y: y,
	            selected: self.selected,
	            ctrl: event.ctrlKey
	        }
	    });
    }
}