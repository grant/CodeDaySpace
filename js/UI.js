function UI(world) {
    var self = this;
    var $spaceArea = $('.spaceArea');
    var $viewFrame = $('.viewFrame');
    this.selected = [];

    document.oncontextmenu = function () { return false; };
    $(document).mousedown(function (event) {
        if (event.button === 2) {
            rightClick(event);
            return false;
        }
        return true;
    });

    $(document).keypress(function (event) {
        world.spawnShip();
    });

    $viewFrame.click(function (event) {
        if (event.which === 3) { //right click
            rightClick(event);
        }
        if (event.which === 1) { //left click
            leftClick(event);
        }
    });

    function leftClick(event) {
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
            $spaceArea.find('img').filter(function (i) {
                return $(this).data('id') === index;
            }).addClass('selected');
        }
    }

    function rightClick(event) {
    	var currMapX = parseInt($('.spaceArea').css('left'));
    	var currMapY = parseInt($('.spaceArea').css('top'));

        var x = event.clientX - currMapX;
        var y = event.clientY - currMapY;
        world.UIEvent({
            "click": {
                x: x,
                y: y,
                selected: self.selected,
                ctrl: event.ctrlKey
            }
        });
    }

    this.updateResourceUI = function (data) {
        $('.minerals').html(data.minerals);
        $('.gas').html(data.gas);
    };

    this.updateMinimap = function (actors) {
    	var others = actors.others;
    	var yours = actors.yours;
    };

    // Scroll the world
    var scrollEnabled = false;
    var mouseX = $(window).width()/2;
    var mouseY = $(window).height()/2;
	window.setInterval(function () {
		if (scrollEnabled) {
			var percentX = mouseX/$(window).width();
	    	var percentY = mouseY/$(window).height();
	    	var currMapX = parseInt($('.spaceArea').css('left'));
	    	var currMapY = parseInt($('.spaceArea').css('top'));
	    	var edgeDetection = 0.2;
	    	var scrollSpeed = 20;
	    	if (percentX < edgeDetection) {
	    		var scale = 1 - (percentX/edgeDetection);
	    		$('.spaceArea').css('left', currMapX + (Math.pow(1+scale,2)-1)*scrollSpeed);
	    	} else if (percentX > 1 - edgeDetection) {
	    		var scale = (percentX - (1 - edgeDetection))/edgeDetection;
	    		$('.spaceArea').css('left', currMapX - (Math.pow(1+scale,2)-1)*scrollSpeed);
	    	}
	    	if (percentY < edgeDetection) {
	    		var scale = 1 - (percentY/edgeDetection);
	    		$('.spaceArea').css('top', currMapY + (Math.pow(1+scale,2)-1)*scrollSpeed);
	    	} else if (percentY > 1 - edgeDetection) {
	    		var scale = (percentY - (1 - edgeDetection))/edgeDetection;
	    		$('.spaceArea').css('top', currMapY - (Math.pow(1+scale,2)-1)*scrollSpeed);
	    	}
		}
	}, 50);

    $('.viewFrame').mousemove(function (event) {
    	mouseX = event.clientX;
    	mouseY = event.clientY;
    });
};