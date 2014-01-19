function UI(world) {
    var self = this;
    var scrollEnabled = true;
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
		// if press space
    	if (event.charCode === 32) {
    		scrollEnabled = !scrollEnabled;
    	} else {
	        world.spawnShip();
    	}
    });

    $viewFrame.click(function (event) {
        if (event.which === 3) { //right click
            rightClick(event);
        }
        if (event.which === 1) { //left click
            leftClick(event);
        }
    });

    $viewFrame.dblclick(function() {
    	self.selected = [];
    	var $ships = $spaceArea.find('img');
    	var yours = world.getActors().yours;
    	yours.forEach(function(actor) {
    		if (actor.type === Actor.SPACESHIP) {
    			self.selected.push(actor.actorId);
    		}
    	});
    	updateSelectedUI();
    });

    function updateSelectedUI () {
        // change select state UI
        $spaceArea.children().removeClass('selected');
        for (var i in self.selected) {
            var index = self.selected[i];
            $spaceArea.find('img').filter(function (i) {
                return $(this).data('id') === index;
            }).addClass('selected');
        }
    }

    function leftClick(event) {
        var $clickedObj = $(event.target);
        var actorId = $clickedObj.data("id");
        var index = self.selected.indexOf(actorId);
        var isImg = $clickedObj.prop('tagName') === 'IMG';
        var isShip = $clickedObj.hasClass('ship');
        if (isImg && isShip) {
            if (index == -1) {
                self.selected.push(actorId);
            } else {
                self.selected.splice(index, 1);
            }
        } else {
        	// Don't unselect if using hashmap
		    var winWid = $(window).width();
		    var winHei = $(window).height();
        	if (!(mouseX > winWid - 200 && mouseY > winHei - 200)) {
	            self.selected = [];
	        }
        }
        updateSelectedUI();
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
        $('.minerals .data').html(data.minerals);
        $('.gas .data').html(data.gas);
    };

    var mapWidth = 10000;
    var mapHeight = 10000;
    this.updateMinimap = function (actors) {
		var others = actors.others;
		var yours = actors.yours;

		var currMapX = -parseInt($('.spaceArea').css('left'), 10);
		var currMapY = -parseInt($('.spaceArea').css('top'), 10);
		var minX = currMapX - (mapWidth/2);
		var maxX = currMapX + (mapWidth/2);
		var minY = currMapY - (mapWidth/2);
		var maxY = currMapY + (mapWidth/2);

		$('.minimap').empty();
		if (yours) {
			yours.forEach(function(actor) {
				if (actor.type === Actor.SPACESHIP) {
					addActorToMinimap(actor, ['ally', 'ship']);
				} else if (actor.type === Actor.BASE) {
					addActorToMinimap(actor, ['ally', 'base']);
				}
			});
		}

		if (others) {
			others.forEach(function(actor) {
				if (actor.type === Actor.SPACESHIP) {
					addActorToMinimap(actor, ['enemy', 'ship']);
				} else if (actor.type === Actor.BASE) {
					addActorToMinimap(actor, ['enemy', 'base']);
				}
			});
		}

		function addActorToMinimap(actor, classes) {
			var x = actor.x;
			var y = actor.y;
			var percentX = (x - minX)/mapWidth;
			var percentY = (y - minY)/mapWidth;
			var $rect = $('<div/>');
			$rect.addClass('mapElement');
			classes.forEach(function(name) {
				$rect.addClass(name);
			});
			$rect.css('left', percentX*100 + '%');
			$rect.css('top', percentY*100 + '%');
			$('.minimap').append($rect);
		}
    };

    // Scroll the world
    var mouseX = $(window).width()/2;
    var mouseY = $(window).height()/2;
	window.setInterval(function () {
	    var winWid = $(window).width();
	    var winHei = $(window).height();
		if (scrollEnabled) {
			var percentX = mouseX/winWid;
	    	var percentY = mouseY/winHei;
	    	var currMapX = parseInt($('.spaceArea').css('left'));
	    	var currMapY = parseInt($('.spaceArea').css('top'));
	    	var edgeDetection = 0.2;
	    	var scrollSpeed = 20;
	    	if (mouseX > winWid - 200 && mouseY > winHei - 200) {
	    		// Use minimap, no scroll
	    	} else {
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
		}
	}, 50);
    $('.viewFrame').mousemove(function (event) {
    	mouseX = event.clientX;
    	mouseY = event.clientY;
    });

    // Click on the minimap
    // var mouseDown = false;
    // $('.minimap').mousemove(function(event) {
    // 	if (mouseDown) {
    // 		scrollMap(event);
    // 	}
    // });
    // $(window).mouseup(function() {
    // 	mouseDown = false;
    // });
    $('.minimap').mousedown(function(event) {
    	scrollMap(event);
    	event.preventDefault();
    	return false;
    });

    function scrollMap (event) {
    	var x = event.offsetX;
    	var y = event.offsetY;
    	var percentX = x/$('.minimap').width() - .5;
    	var percentY = y/$('.minimap').height() - .5;

		var currMapX = parseInt($('.spaceArea').css('left'), 10);
		var currMapY = parseInt($('.spaceArea').css('top'), 10);
		var minX = currMapX - (mapWidth/2);
		var maxX = currMapX + (mapWidth/2);
		var minY = currMapY - (mapWidth/2);
		var maxY = currMapY + (mapWidth/2);

		$spaceArea.css('left', currMapX - percentX*mapWidth + 'px');
		$spaceArea.css('top', currMapY - percentY*mapHeight + 'px');
    }

    this.centerTo = function(x, y) {
		$spaceArea.css('left', x);
		$spaceArea.css('top', y - $(window).height()/2);
    };
};