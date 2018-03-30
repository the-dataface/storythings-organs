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
var chipH = 0,
	chipW = 0,
	firstChannelOffset = 0,
	secondChannelOffset = 0,
	channelW = 50,
	topMargin,
	sideMargin = 100,
	headerTextHeight = 120,
	dragHeight = 75,
	dropHeight = 75,
	footerHeight = 50;

console.log(dropHeight);

var inputs = ['blood', 'acid', 'water', 'waste'];
var combos = [
	{
		key: 'acidblood',
		successful: 'no',
		result: 'Clotted Blood'
	}, 
	{
		key: 'acidwaste',
		successful: 'no',
		result: 'Acidic Waste'
	},
	{
		key: 'acidwater',
		successful: 'no',
		result: 'Diluted Acid'
	},
	{
		key: 'bloodacid',
		successful: 'no',
		result: 'Clotted Blood'
	}, 
	{
		key: 'bloodwaste',
		successful: 'no',
		result: 'Acidic Waste'
	},
	{
		key: 'bloodwater',
		successful: 'no',
		result: 'Diluted Acid'
	},
	{
		key: 'wateracid',
		successful: 'no',
		result: 'Clotted Blood'
	}, 
	{
		key: 'waterblood',
		successful: 'no',
		result: 'Acidic Waste'
	},
	{
		key: 'waterwaste',
		successful: 'no',
		result: 'Diluted Acid'
	},
	{
		key: 'wasteblood',
		successful: 'no',
		result: 'Clotted Blood'
	}, 
	{
		key: 'wasteacid',
		successful: 'no',
		result: 'Acidic Waste'
	},
	{
		key: 'wastewater',
		successful: 'no',
		result: 'Diluted Acid'
	}
]

//keep track of inputs
var leftDrop,
	rightDrop,
	leftFill,
	rightFill;

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
		.style('width', graphicWidth + 'px')
		.style('height', window.innerHeight + 'px');
	var chartMargin = 32;
	var chartWidth = graphic.node().offsetWidth - chartMargin;
	var chartHeight = Math.floor(window.innerHeight) * .8;
	chart
		.style('width', chartWidth + 'px')
		.style('height', chartHeight + 'px');
	chipSvg
		.attr('width', chartWidth)
		.attr('height', chartHeight - dragHeight - dropHeight - headerTextHeight - footerHeight);
	
	createAllChipPath(chartWidth, chartHeight);
	
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
	if (response.index == 0) {
		drawChipOutline();
		
		d3.selectAll('.outer-chip-path-immediate').style('visibility', 'hidden');
		d3.selectAll('.channel-path-immediate').style('visibility', 'hidden');
		d3.selectAll('.channel-path').style('visibility', 'hidden');
		
		d3.select('.drag-container').style('display', 'none')
		d3.select('.drop-container').style('display', 'none')
		d3.select('.chart-footer-container').style('display', 'none')
	} else if (response.index == 1) {
		drawChipChannels();
		
		d3.selectAll('.outer-chip-path-immediate').style('visibility', 'visible');
		d3.selectAll('.channel-path-immediate').style('visibility', 'hidden');
		
		d3.select('.drag-container').style('display', 'none')
		d3.select('.drop-container').style('display', 'none')
		d3.select('.chart-footer-container').style('display', 'none')
	} else if (response.index == 2) {
		d3.select('.drag-container').style('display', 'flex')
		d3.select('.drop-container').style('display', 'flex')

		d3.selectAll('.outer-chip-path-immediate').style('visibility', 'visible');
		d3.selectAll('.channel-path-immediate').style('visibility', 'visible');
		d3.select('.chart-footer-container').style('display', 'block')
	}
	
	if (response.index == 0) {
		d3.select('.chart-header').text("Here's what the outline of a chip looks like.")
		d3.select('.chart-sub-header').text("It's fairly basic")
	} else if (response.index == 1) {
		d3.select('.chart-header').text("And here are the channels.")
		d3.select('.chart-sub-header').text("These are what the fluids and gases flow through.")
	} else if (response.index == 2) {
		d3.select('.chart-header').text('Now, make your own organ on a chip!')
		d3.select('.chart-sub-header').text("Drop two inputs into the drop areas and press ")
	}
	
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
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);
	// setup resize event
	window.addEventListener('resize', handleResize);
}
// kick things off
init();

function createAllChipPath(chartW, chartH) {
	var chipSVG = d3.select('#chip-svg');
	
	topMargin = 40;
	//chipW = chartW - sideMargin * 2;
	chipH = chartH - topMargin - dropHeight - dragHeight - headerTextHeight - footerHeight;
	chipW = chipH / 2;
	sideMargin = (chipSvg.attr('width') - chipW) / 2;
	channelW = 50;
	firstChannelOffset = (chipW / 3) - channelW / 2 + sideMargin;
	secondChannelOffset = ((2 * chipW) / 3) - channelW / 2 + sideMargin;
	
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
	
}


function drawChipOutline() {
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
}

function drawChipChannels() {
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

function generateDots(side, input, dropArea, fill) {
	
	d3.selectAll('.' + side + '-dot').remove();
	
	var channelOffset;
	if (side == 'left') {
		channelOffset = firstChannelOffset;
	} else {
		channelOffset = secondChannelOffset;
	}
	
	var dots = d3.range(1000).map(i => {
		return {
			i: i, 
			startX: Math.floor(Math.random()*channelW), 
			endX: Math.floor(Math.random()*channelW), 
		}
	})
	
	chipSvg.appendMany('circle.' + side + '-dot', dots)
		.at({
		  r: 4,
		  opacity: 0,
		  stroke: fill,
		  fillOpacity:.4,
		  fill: fill
		})
		.translate(d => [channelOffset + d.startX, topMargin])
	  .transition().delay(d => d.i*100)
		.at({opacity: 1})
	  .transition().duration(1000)
		.translate(d => [channelOffset + d.endX, topMargin + chipH])
	  .transition().duration(250)
		.at({opacity: 0})
		.remove()
	
	/*
	chipSvg.appendMany('circle', dots)
		.classed()
		.at({
		  r: 2,
		  opacity: 0,
		})
		.translate(d => [0, d.startQ])
	  .transition().delay(d => d.i*100)
		.at({opacity: 1})
	  .transition().duration(1000)
		.translate(d => [chipW/2, d.startQ])
	  .transition().duration(1000)
		.translate(d => [chipW/2, d.endQ])
	  .transition().duration(1000)
		.translate(d => [chipW, d.endQ])
	  .transition().duration(250)
		.at({opacity: 0})
		.remove()
	*/
}

d3.select('.create-button').on('click', function() {
	if (rightDrop && leftDrop) {
		generateCombination();
	}
});

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
}
