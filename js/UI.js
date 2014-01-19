function UI(world) {
    var $spaceArea = $('.spaceArea');
    this.selected = [];
    self = this;

    document.oncontextmenu = function() {return false;};
	$(document).mousedown(function(event){
		if (event.button === 2) {
			rightClick(event);
			return false;
		}
		return true;
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
        console.log($clickedObj.prop("tagName"));
        $clickedObj.prop("tagName") === "IMG";
        var actorId = $clickedObj.data("id");
        console.log(actorId);
        var index = self.selected.indexOf(actorId);
        console.log(index);
        if (index == -1) {
            self.selected.push(actorId);
            console.log("selected");
        } else {
            self.selected.splice(index, 1);
            console.log("deselected");
        }

    }

    function rightClick (event) {
		var x = event.clientX;
		var y = event.clientY;
		console.log(self.selected);
		world.UIEvent({
	        "click": {
	            x: x,
	            y: y,
	            selected: self.selected
	        }
	    });
    }
}