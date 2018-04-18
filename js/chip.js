// using d3 for convenience
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var chartHeader = graphic.select('.chart-header');
var chartHeaderText = graphic.select('.chart-header-text');
var dragContainer = d3.select('.drag-container');
var dropContainer = d3.select('.drop-container');
var chipSvg = graphic.select('#chip-svg');
var footerContainer = graphic.select('.chart-footer-container');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');
var outputContainer = d3.select('.output-container');
// initialize the scrollama
var scroller = scrollama();

// window width and height
var windowW = window.innerWidth;
var windowH = window.innerHeight;

// what size screen?
var large_screen = false;
var medium_screen = false;
var small_screen = false;

if (windowW > 1000) {
	large_screen = true;
} else if (windowW > 763) {
	medium_screen = true;
} else {
	small_screen = true;
}

//global variables

var leftTimer,
	rightTimer,
	centerTimer;

//keep track of inputs
var leftDrop = false,
	rightDrop = false,
	leftDropItem,
	rightDropItem;

var combinations;
d3.json("data/logictable.json", function(data) {
  combinations = data;
});

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');
	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;
	var textWidth = text.node().offsetWidth;
	var graphicWidth = bodyWidth - textWidth;
	graphic
		//.style('width', graphicWidth + 'px')
		.style('height', window.innerHeight + 'px');
	var chartMargin = 32;
	var chartWidth = graphic.node().offsetWidth - chartMargin;
	var chartHeight = Math.floor(window.innerHeight) * .8;
	chart
		.style('width', chartWidth + 'px')
		.style('height', chartHeight + 'px');
	chipSvg
		.attr('width', chartWidth);
	
	//createAllChipPath(chartWidth, chartHeight);
	
	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}
// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }
	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})
	// update graphic based on step
	//chart.select('p').text(response.index + 1)
	console.log(response.index);
	console.log(response.direction);
	if (response.index == 0) {
		drawChipOutline();
		
		
		d3.select('.instructions').style('display', 'none')
		d3.select('.flex-drag-container').style('display', 'none')
		d3.select('.chart-footer-container').style('display', 'none')
	} else if (response.index == 1) {
		drawChipChannels();
		
		d3.select('.instructions').style('display', 'none')
		d3.select('.flex-drag-container').style('display', 'none')
		d3.select('.chart-footer-container').style('display', 'none')
	} else if (response.index == 2) {

		d3.selectAll('.outer-chip-path-immediate').style('visibility', 'visible');
		d3.selectAll('.channel-path-immediate').style('visibility', 'visible');
		d3.select('.chart-footer-container').style('display', 'block')
		d3.select('.instructions').style('display', 'block')
		d3.select('.flex-drag-container').style('display', 'flex')
	}
	
}
function handleStepExit(response) {
	// response = { element, direction, index }
	console.log(response)
	
}
function handleContainerEnter(response) {
	// response = { direction }
}
function handleContainerExit(response) {
	// response = { direction }
}
function setupStickyfill() {
	d3.selectAll('.sticky').each(function () {
		Stickyfill.add(this);
	});
}
function init() {
	setupStickyfill();
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();
	// 2. setup the scroller passing options
	// this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		container: '#scroll',
		graphic: '.scroll__graphic',
		text: '.scroll__text',
		step: '.scroll__text .step',
		debug: false,
	})
		.onStepEnter(handleStepEnter)
		.onStepExit(handleStepExit)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);
	// setup resize event
	window.addEventListener('resize', handleResize);
}
// kick things off
init();


function drawChipOutline() {
	
	d3.select('#inner-chip-img')
	  .transition()
	  .style('opacity', '0');
	
	d3.select('#inner-chip-paths')
	  .transition()
	.style('opacity', '0');
	
	d3.select('#outer-chip-img')
	  .style('opacity', '0');
	
	var $svg = $('svg').drawsvg({
		duration: 1000,
		easing:'linear'
	});

	$svg.drawsvg('animate');
	
	d3.select('#outer-chip-paths')
		  .style('opacity', '1');
		
	d3.select('#outer-chip-img')
	  .transition()
	  .delay(1000)
	  .duration(1000)
	  .style('opacity', '1');
	
	d3.select('#outer-chip-paths')
		  .transition()
	 	  .delay(1000)
		  .duration(1000)
		  .style('opacity', '0');
	
	/*
	d3.select('.outer-chip-path').style('visibility', 'visible');
	var path = document.querySelector('.outer-chip-path');
	var length = path.getTotalLength();
	
	// Clear any previous transition
	path.style.transition = path.style.WebkitTransition =
	  'none';
	// Set up the starting positions
	path.style.strokeDasharray = length + ' ' + length;
	path.style.strokeDashoffset = length;
	// Trigger a layout so styles are calculated & the browser
	// picks up the starting position before animating
	path.getBoundingClientRect();
	// Define our transition
	path.style.transition = path.style.WebkitTransition =
	  'stroke-dashoffset 5s ease-in-out';
	// Go!
	path.style.strokeDashoffset = '0';
	*/
	
}

function drawChipChannels() {
	
	d3.select('#inner-chip-img')
	  .transition()
	  .style('opacity', '0');
	
	var $svg = $('svg').drawsvg({
		duration: 1000,
		easing:'linear'
	});

	$svg.drawsvg('animate');
	
	d3.select('#inner-chip-paths')
		  .style('opacity', '1');
		
	d3.select('#inner-chip-img')
	  .transition()
	  .delay(2000)
	  .duration(1000)
	  .style('opacity', '1');
	
	d3.select('#inner-chip-paths')
		  .transition()
	 	  .delay(2000)
		  .duration(1000)
		  .style('opacity', '0');
	
	/*
	d3.selectAll('.channel-path').style('visibility', 'visible');
	var i = 0;
	while (i < 4) {
		var path = document.getElementsByClassName('channel-path')[i];
		var length = path.getTotalLength();
		
		// Clear any previous transition
		path.style.transition = path.style.WebkitTransition =
		  'none';
		// Set up the starting positions
		path.style.strokeDasharray = length + ' ' + length;
		path.style.strokeDashoffset = length;
		// Trigger a layout so styles are calculated & the browser
		// picks up the starting position before animating
		path.getBoundingClientRect();
		// Define our transition
		path.style.transition = path.style.WebkitTransition =
		  'stroke-dashoffset 2s ease-in-out';
		// Go!
		path.style.strokeDashoffset = '0'; 
		
		i += 1;
	}
	*/
		
}

d3.selectAll('.drag-object').on('click', function() {
	thisObject = d3.select(this);
	var src = thisObject.select('img').attr('src');
	var id = thisObject.attr('id');
	thisObject.classed('drag-object-selected', true);
	
	console.log(src);
	
	if (!leftDrop) {
		d3.select('#left-drop').attr('xlink:href', src)
		leftDrop = true;
		leftDropItem = id;
		d3.select('.instructions-step-number').text('2');
		d3.select('.instructions-description').text('Choose the second input');
		generateDots('left', [leftDropItem]);
		
	} else if (!rightDrop) {
		d3.select('#right-drop').attr('xlink:href', src)
		rightDrop = true;
		rightDropItem = id;
		d3.select('.instructions-step-number').text('3');
		d3.select('.instructions-description').text('Watch them mix!');
		generateDots('right', [rightDropItem]);
		
		d3.select('.flex-drag-container').style('display', 'none');
		
		var output,
			png,
			success,
			successMessage;
		for (i in combinations) {
			if ((combinations[i].input1 == leftDropItem && combinations[i].input2 == rightDropItem) || (combinations[i].input1 == rightDropItem && combinations[i].input2 == leftDropItem)) {
				output = combinations[i].output;
				png = combinations[i].outputpng;
				success = combinations[i].success;
				successMessage = combinations[i].successtext;
				break;
			}

		}
		
		var t = d3.timer(function(elapsed) {
		  console.log(elapsed);
		  if (elapsed > 3000 && elapsed < 4000) {
			  d3.select('#mix-gif').attr('xlink:href', 'img/mixture.gif');
			  generateDots('center', [leftDropItem, rightDropItem]);
		  } else if (elapsed > 7000 && elapsed < 10000) {
		  	   d3.select('#output').attr('xlink:href', 'img/icons/PNG/' + png + '.png')
			  if (success) {
				  d3.select('#output-success').attr('xlink:href', 'img/organ_output_successful.gif');
				  
				  d3.select('.success-message-container').text(successMessage);
				  d3.select('.success-message-container').style('display', 'block');
			  } else {
				  d3.select('.success-message-container').text('Nooope! You just created ' + output);
				  d3.select('.success-message-container').style('display', 'block');
			  }
		  } else if (elapsed > 10000){
			  
			 reset();

			 t.stop();
		  }
		});
		
	}
})

function generateDots(side, inputs) {
	
	d3.selectAll('.' + side + '-dot').remove();
	
	var chipH = $('#chip-svg').height();
	var chipW = $('#chip-svg').width();
	var outerChipPathW = document.getElementById("outer-chip-paths").getBoundingClientRect().width;
	var outerChipPathH = document.getElementById("outer-chip-paths").getBoundingClientRect().height;
	
	var channelOffsetX;
	var channelOffsetY;
	var sideMultiplier;
	var midX;
	var midY;
	if (side == 'left') {
		//channelOffsetX = outerChipPathW / 4;
		channelOffsetX = 137;
		channelOffsetY = 160;
		midX = 180;
		midY = 240;
	} else if (side == 'right'){
		//channelOffsetX = ((3 * outerChipPathW) / 4);
		channelOffsetX = 303;
		channelOffsetY = 160;
		midX = 260;
		midY = 240;
	} else {
		channelOffsetX = 218
		channelOffsetY = 360;
		midX = 218;
		midY = 495;
	}
	
	var fill = [];
	for (i in inputs) {
		if (inputs[i] == 'Acid') {
			fill.push('green');
		} else if (inputs[i] == 'Blood') {
			fill.push('red');
		} else if (inputs[i] == 'Food') {
			fill.push('yellow');
		} else if (inputs[i] == 'DigestedFood') {
			fill.push('darkgrey');
		} else if (inputs[i] == 'Water') {
			fill.push('blue');
		} else if (inputs[i] == 'Waste') {
			fill.push('brown');
		} else if (inputs[i] == 'Oxygen') {
			fill.push('lightgrey');
		} 
	}
	
	var channelOffset;
	if (side == 'left') {
		if (leftTimer) {
			leftTimer.stop();
		}
		leftTimer = d3.interval(function(elapsed) {
			var dots = d3.range(10).map(i => {
				return {
					i: i, 
					firstXOffset: Math.floor(Math.random()*10) + Math.floor(Math.random()*-10),
					secondXOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30),
					secondYOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30)


				}
			})

			chipSvg.appendMany('circle.' + side + '-dot.dot', dots)
				.at({
				  opacity:0,
				  r: 2,
				  cx: channelOffsetX,
				  cy: channelOffsetY
				})
				.translate(d => [d.firstXOffset, 0])
				.style('fill', function(d) {
					if (fill.length == 2) {
						return fill[Math.round(Math.random())];
					} else {
						return fill[0];
					}
				})
			  .transition().delay(d => d.i*100)
				.at({opacity: 1})
			  .transition().duration(1000)
				.at({
				  cx:midX,
				  cy:midY
				})
			  .transition().duration(0)
				.remove()

		}, 1000);
	} else if (side == 'right') {
		if (rightTimer) {
			rightTimer.stop();
		}
		rightTimer = d3.interval(function(elapsed) {
			var dots = d3.range(10).map(i => {
				return {
					i: i, 
					firstXOffset: Math.floor(Math.random()*10) + Math.floor(Math.random()*-10),
					secondXOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30),
					secondYOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30)


				}
			})

			chipSvg.appendMany('circle.' + side + '-dot.dot', dots)
				.at({
				  opacity:0,
				  r: 2,
				  cx: channelOffsetX,
				  cy: channelOffsetY
				})
				.translate(d => [d.firstXOffset, 0])
				.style('fill', function(d) {
					if (fill.length == 2) {
						return fill[Math.round(Math.random())];
					} else {
						return fill[0];
					}
				})
			  .transition().delay(d => d.i*100)
				.at({opacity: 1})
			  .transition().duration(1000)
				.at({
				  cx:midX,
				  cy:midY
				})
			  .transition().duration(0)
				.remove()


		}, 1000);
	} else {
		if (centerTimer) {
			centerTimer.stop();
		}
		centerTimer = d3.interval(function(elapsed) {
			var dots = d3.range(10).map(i => {
				return {
					i: i, 
					firstXOffset: Math.floor(Math.random()*10) + Math.floor(Math.random()*-10),
					secondXOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30),
					secondYOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30)


				}
			})

			chipSvg.appendMany('circle.' + side + '-dot.dot', dots)
				.at({
				  opacity:0,
				  r: 2,
				  cx: channelOffsetX,
				  cy: channelOffsetY
				})
				.translate(d => [d.firstXOffset, 0])
				.style('fill', function(d) {
					if (fill.length == 2) {
						return fill[Math.round(Math.random())];
					} else {
						return fill[0];
					}
				})
			  .transition().delay(d => d.i*100)
				.at({opacity: 1})
			  .transition().duration(1000)
				.at({
				  cx:midX,
				  cy:midY
				})
			  .transition().duration(0)
				.remove()


		}, 1000);
	}
}

function generateCombination() {
	//$(".chart").effect( "shake" );
	
	var firstTime = true;
	d3.selectAll('.remove-input').style('display', 'none')
	var t = d3.timer(function(elapsed) {
	  if (elapsed < 5000) {
		chartHeaderText.style('display', 'none');
		dragContainer.style('display', 'none');
		d3.select('.create-button').style('display', 'none');
		outputContainer.style('display', 'block');

		var combination = leftDrop + rightDrop;
		var successful;
		var result;

		for (i in combos) {
			if (combos[i].key == combination) {
				successful = combos[i].successful;
				result = combos[i].result;
			}
		}

		d3.select('.output-waiting-text').style('display', 'none')
		
		if (firstTime) {
			$(".output-container").effect( "shake" );
			firstTime = false;
		}

		d3.select('.output-generic-text').style('display', 'block')
		d3.select('.output-created-text').style('display', 'block').text(result)
		if (successful == 'no') {
			d3.select('.output-sorry-text').style('display', 'block')
		} else {
			d3.select('.output-success-text').style('display', 'block')
		}
		  
	  } else {
		  
		reset()
		  
		t.stop();
	  }
	});
	
	
}

function reset() {
	d3.selectAll('.drag-object').classed('drag-object-selected', false);
	leftDrop = false;
	leftDropItem = null;
	rightDrop = false;
	rightDropItem = null;
	
	d3.select('#left-drop').attr('xlink:href', 'img/empty_space.svg')
	d3.select('#right-drop').attr('xlink:href', 'img/empty_space.svg')
	d3.select('#mix-gif').attr('xlink:href', 'img/empty_space.svg');
	d3.select('#output').attr('xlink:href', 'img/empty_space.svg')
	d3.select('#output-success').attr('xlink:href', 'img/empty_space.svg');
	
	d3.select('.instructions-step-number').text('1');
	d3.select('.instructions-description').text('Choose the first input');
	
	d3.select('.flex-drag-container').style('display', 'flex');
	d3.select('.success-message-container').style('display', 'none');
	
	d3.selectAll('circle.dot').remove();
	leftTimer.stop();
	rightTimer.stop();
	centerTimer.stop();
	/*
	chartHeaderText.style('display', 'block');
	dragContainer.style('display', 'flex');
	d3.select('.create-button').style('display', 'block');
	outputContainer.style('display', 'none');
	d3.select('.output-generic-text').style('display', 'none')
	d3.select('.output-created-text').style('display', 'none')
	d3.select('.output-sorry-text').style('display', 'none')
	d3.select('.output-success-text').style('display', 'none')
	
	d3.select('.dropped-left')
		.classed('dropped', false)
		.classed('dropped-left', false)
		.style('left', 0)
		.style('top', 0);
	
	d3.select('.dropped-right')
		.classed('dropped', false)
		.classed('dropped-right', false)
		.style('left', 0)
		.style('top', 0);
	
	d3.selectAll('.drop-area')
	  .style('border-color', '#b5b5b5')
	  .select('.drop-area-text')
  	  .text('drop here')
	  .style('color', 'grey');
	
	d3.selectAll('circle').remove();
	
	leftDrop = null;
	rightDrop = null;
	leftFill = '#b5b5b5';
	rightFill = '#b5b5b5';
	*/
}




function fillChannel(side, input, dropArea) {
	var channelOffset;
	if (side == 'left') {
		channelOffset = firstChannelOffset;
	} else {
		channelOffset = secondChannelOffset;
	}
	
	var fill;
	if (input == 'blood') {
		fill = 'red';
	} else if (input == 'acid') {
		fill = 'green';
	} else if (input == 'water') {
		fill = 'blue';
	} else if (input == 'waste') {
		fill = 'brown';
	}
	
	chipSvg.append('rect')
		.attr('x', channelOffset)
	    .attr('y', 100)
	    .attr('width', channelW)
	    .attr('height', 0)
	    .transition()
	    .duration(2000)
	    .attr('height', chipH)
	    .attr('fill', fill);
	
	d3.select(dropArea).style('background-color', fill);
}

/*

$( ".drag-object" ).draggable({
	snapMode: 'inner',
	snap:'.drop-area',
	revert: function(event, ui) {
            $(this).data("uiDraggable").originalPosition = {
                top : 0,
                left : 0
            };
            // return boolean
            return !event;
            // that evaluate like this:
            // return event !== false ? false : true;
        }
});

$( "#droppable-left" ).droppable({
	over: function(event, ui) {
		var inputID = $(ui.draggable).attr('id');
		
		var fill;
		if (inputID == 'blood') {
			fill = 'red';
		} else if (inputID == 'acid') {
			fill = 'green';
		} else if (inputID == 'water') {
			fill = 'blue';
		} else if (inputID == 'waste') {
			fill = 'brown';
		}
		
		d3.select(this).style('border-color', fill);
		d3.select(this).select('.remove-input').style('color', fill);
	},
	out: function(event, ui) {
		console.log('over!');
       d3.select(this).style('border-color', leftFill);
		d3.select(this).select('.remove-input').style('color', leftFill);
    },
	drop: function( event, ui ) {
		var areaID = $(this).attr('id');
		var inputID = $(ui.draggable).attr('id');
		
		var fill;
		if (inputID == 'blood') {
			fill = 'red';
		} else if (inputID == 'acid') {
			fill = 'green';
		} else if (inputID == 'water') {
			fill = 'blue';
		} else if (inputID == 'waste') {
			fill = 'brown';
		}
		
		leftFill = fill;

		//fillChannel('left', inputID, this);
		changeInputs('left', inputID, this, fill);
		generateDots('left', inputID, this, fill);
		
		$(ui.draggable).addClass('dropped');
		$(ui.draggable).addClass('dropped-left');
		
		leftDrop = inputID;
		
		
	}
});

$( "#droppable-right" ).droppable({
	over: function(event, ui) {
		var inputID = $(ui.draggable).attr('id');
		
		var fill;
		if (inputID == 'blood') {
			fill = 'red';
		} else if (inputID == 'acid') {
			fill = 'green';
		} else if (inputID == 'water') {
			fill = 'blue';
		} else if (inputID == 'waste') {
			fill = 'brown';
		}
		
		d3.select(this).style('border-color', fill);
		d3.select(this).select('.remove-input').style('color', fill);
	},
	out: function(event, ui) {
        d3.select(this).style('border-color', rightFill);
		d3.select(this).select('.remove-input').style('color', rightFill);
    },
	drop: function( event, ui ) {
		var areaID = $(this).attr('id');
		var inputID = $(ui.draggable).attr('id');
		
		var fill;
		if (inputID == 'blood') {
			fill = 'red';
		} else if (inputID == 'acid') {
			fill = 'green';
		} else if (inputID == 'water') {
			fill = 'blue';
		} else if (inputID == 'waste') {
			fill = 'brown';
		}
		
		rightFill = fill;
		
		//fillChannel('right', inputID, this);
		changeInputs('right', inputID, this, fill);
		generateDots('right', inputID, this, fill);
		
		$(ui.draggable).addClass('dropped');
		$(ui.draggable).addClass('dropped-right');
		
		rightDrop = inputID;

	}
});

*/

d3.selectAll('.remove-input').on('click', function() {
	var sideLetter = d3.select(this).attr('id').slice(-1);
	var side;
	
	if (sideLetter == 'r') {
		side = 'right';
	} else {
		side = 'left';
	}

	removeInput(side);
})

function changeInputs(side, input, dropArea, fill) {
	d3.select('.dropped-' + side)
		.classed('dropped', false)
		.classed('dropped-' + side, false)
		.style('left', 0)
		.style('top', 0);
	
	d3.select(dropArea).style('border-color', fill);
	d3.select(dropArea).select('.drop-area-text').style('color', fill).text(input);
	
	d3.select(dropArea).select('.remove-input').style('color', fill).style('display', 'block');
}

function removeInput(side) {
	d3.select('.dropped-' + side)
		.classed('dropped', false)
		.classed('dropped-' + side, false)
		.style('left', 0)
		.style('top', 0);
	
	var dropArea = d3.select('#droppable-' + side);
	
	dropArea.style('border-color', '#b5b5b5')
	  .select('.drop-area-text')
  	  .text('drop here')
	  .style('color', 'grey');
	
	dropArea.select('.remove-input')
	  .style('display', 'none')
	
	d3.selectAll('.' + side + '-dot').remove();
	
	if (side == 'right') {
		rightDrop = null;
		rightFill = '#b5b5b5';
	} else {
		leftDrop = null;
		leftFill = '#b5b5b5';
	}
}

d3.select('.create-button').on('click', function() {
	if (rightDrop && leftDrop) {
		generateCombination();
	}
});

function createAllChipPath(chartW, chartH) {
	var chipSVG = d3.select('#chip-svg');
	
	topMargin = 40;
	//chipW = chartW - sideMargin * 2;
	chipH = chartH - topMargin - dropHeight - dragHeight - headerTextHeight - footerHeight;
	chipW = chipH / 2;
	sideMargin = (chipSvg.attr('width') - chipW) / 2;
	channelW = 50;
	firstChannelOffset = chipW / 3;
	secondChannelOffset = (2 * chipW) / 3
	/*
	
	var outerPath = 'M' + sideMargin + ' ' + topMargin + ' v ' + chipH + ' h' + chipW + ' v -' + chipH + ' h -' + chipW;
	
	chipSVG.append('path')
	  .attr('class', 'outer-chip-path')
	  .attr('d', outerPath)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'outer-chip-path-immediate')
	  .attr('d', outerPath)
	  .style('visibility', 'hidden');
	
	var leftChannelPathLeft = 'M' + firstChannelOffset + ' ' + topMargin + ' v ' + chipH;
	
	var leftChannelPathRight = 'M' + (firstChannelOffset + channelW) + ' ' + topMargin + ' v ' + chipH;
	
	var rightChannelPathLeft = 'M' + secondChannelOffset + ' ' + topMargin + ' v ' + chipH;
	
	var rightChannelPathRight = 'M' + (secondChannelOffset + channelW) + ' ' + topMargin + ' v ' + chipH;
	
	chipSVG.append('path')
	  .attr('class', 'channel-path')
	  .attr('d', leftChannelPathLeft)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'channel-path')
	  .attr('d', leftChannelPathRight)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'channel-path')
	  .attr('d', rightChannelPathLeft)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'channel-path')
	  .attr('d', rightChannelPathRight)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'channel-path-immediate')
	  .attr('d', leftChannelPathLeft)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'channel-path-immediate')
	  .attr('d', leftChannelPathRight)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'channel-path-immediate')
	  .attr('d', rightChannelPathLeft)
	  .style('visibility', 'hidden');
	
	chipSVG.append('path')
	  .attr('class', 'channel-path-immediate')
	  .attr('d', rightChannelPathRight)
	  .style('visibility', 'hidden');
	  
	 */
	
}
