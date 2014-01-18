function UI(world) {
	var $spaceArea = $('.spaceArea');
	$spaceArea.click(function(event) {
		var x = event.clientX;
		var y = event.clientY;
		world.UIEvent({
			"click": {
				x: x,
				y: y
			}
		});
	});
}