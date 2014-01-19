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
		    //determine which actor was clicked on
            //select this actor
		}
    });

    function leftClick (event) {
    }

    function rightClick (event) {
		var x = event.clientX;
		var y = event.clientY;
	    world.UIEvent({
	        "click": {
	            x: x,
	            y: y
	        }
	    });
    }
}