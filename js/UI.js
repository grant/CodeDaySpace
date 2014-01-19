function UI(world) {
    var $spaceArea = $('.spaceArea');
    var selected = [];

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
        var clickedObj = $(event.target);
        var actorId = clickedObj.data("id");
        var index = selected.indexOf(actorId);
        console.log(actorId);
        if (index == -1) {
            selected.push(actorId);
            console.log("selected");
        } else {
            selected.splice(index, 1);
            console.log("deselected");
        }

    }

    function rightClick (event) {
		var x = event.clientX;
		var y = event.clientY;
	    world.UIEvent({
	        "click": {
	            x: x,
	            y: y,
	            selected: selected
	        }
	    });
    }
}