// using d3 for convenience
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var chartHeader = graphic.select('.chart-header');
var chartHeaderText = graphic.select('.chart-header-text');
var flexDragContainer = d3.select('.flex-drag-container');
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
var very_small_screen = false;

if (windowW > 1000) {
	large_screen = true;
} else if (windowW > 763) {
	medium_screen = true;
} else if (windowW > 510) {
	small_screen = true;
} else {
	very_small_screen = true;
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

var animationRunning = false;

var combinations;
d3.json("https://the-dataface.github.io/storythings-organs/data/logictable.json", function(data) {
  combinations = data;
});

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	
	//var inBetweenStepHeight = Math.floor(window.innerHeight);
	var stepHeight = Math.floor(window.innerHeight);
	if (large_screen) {
		d3.selectAll('.in-between-step').style('display', 'none');
		d3.select('.final-step').style('display', 'none');
		step.style('height', stepHeight + 'px');
		/*
		d3.selectAll('.text-step').each(function() {
			var height = d3.select(this).select('p').node().getBoundingClientRect().height;
			var stepMargin = Math.floor(window.innerHeight * .3);
			d3.select(this).style('height', height + stepMargin + 'px');
		})
		*/
	} else if (medium_screen) {
		d3.selectAll('.text-step').each(function() {
			var height = d3.select(this).select('p').node().getBoundingClientRect().height;
			d3.select(this).style('height', height + 'px');
		})
		d3.selectAll('.in-between-step').style('height', stepHeight + 'px');
		d3.selectAll('.final-step').style('height', stepHeight + 'px');
		
	} else {
		d3.selectAll('.text-step').each(function() {
			var height = d3.select(this).select('p').node().getBoundingClientRect().height;
			d3.select(this).style('height', height * 0.8 + 'px');
		})
		
		d3.selectAll('.in-between-step').style('height', stepHeight * 0.7 + 'px');
		d3.selectAll('.final-step').style('height', stepHeight + 300 + 'px');
	}
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
	
	
	if (very_small_screen || small_screen) {
		chartHeight = Math.floor(window.innerHeight);
		chart
		.style('height', chartHeight + 'px');
		
		chipSvg
		.attr('height', chartHeight - 300)
		
	} else if (medium_screen) {
		
		chipSvg
		.attr('height', chartHeight - 150)
		.attr('width', (chartHeight - 150) / 1.4)
		
	} else {
		
		chipSvg
		.attr('height', chartHeight - 200)
		.attr('width', (chartHeight - 200) / 1.4)
		
	}
	
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
	
	if (((response.index == 1 && !large_screen) || (response.index == 0 && large_screen)) && !animationRunning) {
		d3.select('.instructions').style('opacity', '0')
		d3.select('.flex-drag-container').style('opacity', '0')
		d3.select('.chart-footer-container').style('opacity', '0')
		d3.select('.success-message-container').style('opacity', '0')

		d3.select("#scroll-prompt").style('display', 'block');

		if (response.direction == 'down') {
			drawChipOutline();
		} else {
			d3.select('#inner-chip-img').style('opacity', '0');
		}
	} else if (((response.index == 3 && !large_screen) || (response.index == 2 && large_screen)) && !animationRunning) {
		d3.select('.instructions').style('opacity', '0')
		d3.select('.flex-drag-container').style('opacity', '0')
		d3.select('.chart-footer-container').style('opacity', '0')
		d3.select('.success-message-container').style('opacity', '0')

		d3.select("#scroll-prompt").style('display', 'block');

		if (response.direction == 'down') {
			drawChipChannels();
			d3.select('#outer-chip-img').style('opacity', '1');
		} else {
			resetScroll();
		}
	} else if (((response.index == 5 && !large_screen) || (response.index == 4 && large_screen)) && !animationRunning) {

		d3.selectAll('.outer-chip-path-immediate').style('visibility', 'visible');
		d3.selectAll('.channel-path-immediate').style('visibility', 'visible');

		d3.select("#scroll-prompt").style('display', 'none');
		
		d3.select('#inner-chip-img').style('opacity', '1')
		d3.select('.chart-footer-container').style('opacity', '1')
		d3.select('.instructions').style('opacity', '1')
		d3.select('.flex-drag-container').style('opacity', '1')
		d3.selectAll('.drag-object').style('cursor', 'pointer').style('pointer-events', 'all')
	}
	
}
function handleStepExit(response) {
	if (((response.index == 1 && !large_screen) || (response.index == 0 && large_screen)) && !animationRunning) {
		if (response.direction == 'up') {
			d3.select('#outer-chip-img').style('opacity', '0');
		}
	} else if (((response.index == 3 && !large_screen) || (response.index == 2 && large_screen)) && !animationRunning) {
		if (response.direction == 'up') {
			d3.select('#inner-chip-paths').style('opacity', '0');
			d3.select('#inner-chip-img').transition()
				.delay(500)
				.style('opacity', '0');
		}
	} else if (((response.index == 5 && !large_screen) || (response.index == 4 && large_screen)) && !animationRunning) {
		d3.selectAll('.drag-object').style('cursor', 'auto').style('pointer-events', 'none')
	}
}
function handleContainerEnter(response) {
	// response = { direction }
	// sticky the graphic (old school)
	graphic.classed('is-fixed', true);
	graphic.classed('is-bottom', false);
}
function handleContainerExit(response) {
	// response = { direction }
	// un-sticky the graphic, and pin to top/bottom of container
	graphic.classed('is-fixed', false);
	graphic.classed('is-bottom', response.direction === 'down');
}

function init() {
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
	window.addEventListener('resize', function() {
		if (windowW != window.innerWidth) {
			handleResize()
		}
	});
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
}

d3.selectAll('.drag-object').on('mouseover', function() {
	
})

d3.selectAll('.drag-object').on('click', function() {
	d3.select("#scroll-prompt").style('display', 'none');
	thisObject = d3.select(this);
	var src = thisObject.select('img').attr('src');
	var id = thisObject.attr('id');
	thisObject.select('.icon').classed('icon-selected', true);
	
	if (!leftDrop) {
		d3.select('#left-drop').attr('xlink:href', src)
		leftDrop = true;
		leftDropItem = id;
		d3.select('.instructions-description').text('Choose the second input.');
		generateDots('left', [leftDropItem]);
		
	} else if (!rightDrop) {
		d3.selectAll('.icon').style('pointer-events', 'none');
		d3.selectAll('.drag-object').style('pointer-events', 'none');
		
		animationRunning = true;
		d3.select('#right-drop').attr('xlink:href', src)
		rightDrop = true;
		rightDropItem = id;
		d3.select('.instructions-description').text("Let's see what happens...");
		generateDots('right', [rightDropItem]);
		
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
		
		var addedGif = false;
		var addedResetButton = false;
		var t = d3.timer(function(elapsed) {
		  if (elapsed > 3000 && elapsed < 4000) {
			  //document.getElementById("mix-gif").setAttribute("xlink:href", '/content/images/2018/05/mixture.gif');
			  $('#mix-gif').attr("xlink:href","/content/images/2018/05/poof.gif");
			  
			  
			  if (!addedGif) {
				  addedGif = true;
				  
				  d3.select('#mix-area-pat')
				  .append('image')
			  	  .attr('id', 'mix-gif-on')
			  	  .attr('x', '10')
			  	  .attr('y', '10')
			  	  .attr('width', '512')
				  .attr('width', '512');
			  
				  document.getElementById("mix-gif-on").setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/images/2018/05/poof.gif');
				  
			  }
			  
			  //d3.select('#mix-gif').attr('xlink:href', '/content/images/2018/05/mixture.gif');
			  generateDots('center', [leftDropItem, rightDropItem]);
			  
		  } else if (elapsed > 7000 && elapsed < 8000 && !addedResetButton) {
		  	   d3.select('#output').attr('xlink:href', '/content/images/2018/05/' + png + '.png')
			  if (success) {
				  d3.select('#output-success').attr('xlink:href', '/content/images/2018/05/organ_output_successful.gif');
				 
				  d3.select('.success-message-container').style('opacity', '1')
				  d3.select('.success').style('display', 'block');
				  d3.select('.message').text(successMessage);
			  } else {
				   d3.select('.success-message-container').style('opacity', '1')
				  d3.select('.success').style('display', 'none');
				 // d3.select('.failure').style('display', 'block');
				  d3.select('.message').text('You just created ' + output + '.');
			  }
			  addedResetButton = true;
		  } else if (elapsed > 8000 && addedResetButton){
			 t.stop();
		  }
		});
		
	}
})

function endAnimation() {
	/*
	d3.select('.svg-container').style('opacity', '.4');
	 d3.select('.flex-drag-container').style('opacity', '.4')
	 d3.select('.instructions-container').style('opacity', '.4')
	 d3.select('.success-message-container').style('opacity', '.4')
	 d3.select('.reset-button').style('display', 'block')
	 */
}

d3.select('.reset-button').on('click', function() {
	reset();
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
			fill.push('#4A9B64');
		} else if (inputs[i] == 'Blood') {
			fill.push('#C16148');
		} else if (inputs[i] == 'Food') {
			fill.push('#C3B19C');
		} else if (inputs[i] == 'DigestedFood') {
			fill.push('#C3B19C');
		} else if (inputs[i] == 'Water') {
			fill.push('#4379C9');
		} else if (inputs[i] == 'Waste') {
			fill.push('#695249');
		} else if (inputs[i] == 'Oxygen') {
			fill.push('#D9E9F1');
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
					secondYOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30),
					firstQuadrantPoint: generateRandomPointInCircle(1),
					secondQuadrantPoint: generateRandomPointInCircle(2),
					thirdQuadrantPoint: generateRandomPointInCircle(3),
					fourthQuadrantPoint: generateRandomPointInCircle(4)
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
			  .transition().duration(1000).ease(d3.easeLinear)
				.at({
				  cx:midX,
				  cy:midY
				})
			   .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.firstQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.firstQuadrantPoint[1];
				})
			  .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.secondQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.secondQuadrantPoint[1];
				})
			  .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.thirdQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.thirdQuadrantPoint[1];
				})
			  .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.fourthQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.fourthQuadrantPoint[1];
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
					secondYOffset: Math.floor(Math.random()*30) + Math.floor(Math.random()*-30),
					firstQuadrantPoint: generateRandomPointInCircle(1),
					secondQuadrantPoint: generateRandomPointInCircle(2),
					thirdQuadrantPoint: generateRandomPointInCircle(3),
					fourthQuadrantPoint: generateRandomPointInCircle(4)

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
			  .transition().duration(1000).ease(d3.easeLinear)
				.at({
				  cx:midX,
				  cy:midY
				})
			  .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.firstQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.firstQuadrantPoint[1];
				})
			  .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.secondQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.secondQuadrantPoint[1];
				})
			  .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.thirdQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.thirdQuadrantPoint[1];
				})
			  .transition().duration(1000).ease(d3.easeLinear)
				.attr('cx', function(d) {
					return d.fourthQuadrantPoint[0];
				})
				.attr('cy', function(d) {
					return d.fourthQuadrantPoint[1];
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
			  .transition().duration(1000).ease(d3.easeLinear)
				.at({
				  cx:midX,
				  cy:midY
				})
			  .transition().duration(0)
				.remove()


		}, 1000);
	}
}

function generateRandomPointInCircle(quadrant) {

	var countA = 200,
		countB = 200,// number of random  points
		radius = 60,
		cx = 218 - radius / 2,
		cy = 296 - radius / 2,
		generating = true;
			

	while (generating) {

		var pt_angle = Math.random() * 2 * Math.PI;
		var pt_radius_sq = Math.random() * radius * radius;
		var pt_x = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle);
		var pt_y = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle);
		var absX = pt_x + 60 / 2;
		var absY = pt_y + 60 / 2
		var x = absX + cx;
		var y = absY + cy;

		if (quadrant == 1 && absX < radius / 2 && absY < radius / 2) {
			return [x, y];
		} else if (quadrant == 2 && absX < radius / 2 && absY > radius / 2) {
			return [x, y];
		} else if (quadrant == 3 && absX > radius / 2 && absY > radius / 2) {
			return [x, y];
		} else if (quadrant == 4 && absX > radius / 2 && absY < radius / 2) {
			return [x, y];
		}
	}
}

function reset() {
	d3.select('.svg-container').style('opacity', '1');
	d3.select('.flex-drag-container').style('opacity', '1');
	d3.select('.instructions-container').style('opacity', '1');
	d3.select("#scroll-prompt").style('display', 'block');
	
	d3.selectAll('.icon').classed('icon-selected', false);
	leftDrop = false;
	leftDropItem = null;
	rightDrop = false;
	rightDropItem = null;
	
	d3.select('#left-drop').attr('xlink:href', '/content/images/2018/05/empty_space.svg')
	d3.select('#right-drop').attr('xlink:href', '/content/images/2018/05/empty_space.svg')
	d3.select('#mix-gif').attr('xlink:href', '/content/images/2018/05/empty_space.svg');
	d3.select('#mix-gif-on').remove();
	d3.select('#output').attr('xlink:href', '/content/images/2018/05/empty_space.svg')
	d3.select('#output-success').attr('xlink:href', '/content/images/2018/05/empty_space.svg');
	d3.selectAll('.icon').style('pointer-events', 'all');
	d3.selectAll('.drag-object').style('pointer-events', 'all');
	
	d3.select('.instructions-step-number').text('1');
	d3.select('.instructions-description').text('Choose the first input.');
	
	d3.select('.success-message-container').style('opacity', '0');
	
	d3.selectAll('circle.dot').remove();
	animationRunning = false;
	if (leftTimer.stop()) {
		leftTimer.stop();
	} 
	if (rightTimer.stop()) {
		rightTimer.stop();
	} 
	if (centerTimer.stop()) {
		centerTimer.stop();
	} 
}

function resetScroll() {
	d3.selectAll('.icon').classed('icon-selected', false);
	leftDrop = false;
	leftDropItem = null;
	rightDrop = false;
	rightDropItem = null;
	
	d3.select('#left-drop').attr('xlink:href', '/content/images/2018/05/empty_space.svg')
 	//document.getElementById("left-drop").setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/images/2018/05/empty_space.svg');
	d3.select('#right-drop').attr('xlink:href', '/content/images/2018/05/empty_space.svg')
	d3.select('#mix-gif').attr('xlink:href', '/content/images/2018/05/empty_space.svg');
	d3.selectAll('#mix-gif-on').remove();
	d3.select('#output').attr('xlink:href', '/content/images/2018/05/empty_space.svg')
	d3.select('#output-success').attr('xlink:href', '/content/images/2018/05/empty_space.svg');
	
	d3.select('.instructions').style('opacity', '0');
	d3.select('.instructions-step-number').text('1');
	d3.select('.instructions-description').text('Choose the first input.');
	
	d3.select('.flex-drag-container').style('opacity', '0');
	d3.select('.success-message-container').style('opacity', '0');
	
	d3.selectAll('circle.dot').remove();
	animationRunning = false;
	if (leftTimer.stop()) {
		leftTimer.stop();
	} 
	if (rightTimer.stop()) {
		rightTimer.stop();
	} 
	if (centerTimer.stop()) {
		centerTimer.stop();
	} 
}
