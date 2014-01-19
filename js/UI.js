function UI(world) {
    var $spaceArea = $('.spaceArea');
    var selected = [];
	$spaceArea.click(function(event) {
		var x = event.clientX;
		var y = event.clientY;
		if (event.which == 3) { //right click
		    world.UIEvent({
		        "click": {
		            x: x,
		            y: y
		        }
		    })
		}
		if (event.which == 1) { //left click
		    //determine which actor was clicked on
            //select this actor
		}
    });
}