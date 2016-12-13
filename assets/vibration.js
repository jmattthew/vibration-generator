/*
 Author: Mattthew Brauer, twitter @mattthew
 MIT license
*/

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

var initialSplineScale = 1;
var tests = 4;
var splineWidth = 0;
var splineHeight = 0;

$(document).ready(function(){

	$('html, body').scrollTop($(document).height());
	$('.checkbox').data('visuals',false);
	$('.play').data('enabled',true);
	splineWidth = parseInt($('#spline1').css('width'));
	splineHeight = parseInt($('#spline1').css('height'));
	initSplineScale();

	if(navigator.vibrate) {
		$('#supported').eq(0).html('Groovy - This browser supports navigator.vibrate()');
	}

	$('#printout span').click(function(event) {
		var textArea = document.createElement('textarea');
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = 0;
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';

		textArea.value = $(this).html();
		document.body.appendChild(textArea);
		textArea.select();
		try {
			var successful = document.execCommand('copy');
		} catch (err) {
			console.log('unable to copy');
		}
		document.body.removeChild(textArea);
		$(this).animate({
			opacity: 0
		}, 250,function() {
			$(this).delay(100).animate({
				opacity: 1
			}, 100);
		});
	});

	$('.checkbox, .checkbox_label').click(function(){
		var num = $(this).prop('id');
		num = parseInt(num.substr(num.length-1,num.length));
		console.log(num);
		if($('#visuals'+num).data('visuals')) {
			$('#visuals'+num+' div').css('display','none');
			$('#visuals'+num).data('visuals',false);
			$('#visuals_label'+num).html('Visuals: OFF');
		} else {
			$('#visuals'+num+' div').css('display','block');
			$('#visuals'+num).data('visuals',true);
			$('#visuals_label'+num).html('Visuals: ON');
		}
		document.getSelection().removeAllRanges();
	});

	$('.sputter_slide').slider({
		value: 0,
		min: 0,
		max: 10,
		step: 1,
		create: function( event, ui ) {
			var num = $(this).prop('id');
			num = parseInt(num.substr(num.length-1,num.length));
			$('#sputter_display'+num).html( 0 );
		},
		slide: function( event, ui ) {
			var num = $(this).prop('id');
			num = parseInt(num.substr(num.length-1,num.length));
			$('#sputter_display'+num).html( ui.value );
		}
	});

	$('.roughness_slide').slider({
		value: 5,
		min: 5,
		max: 20,
		step: 5,
		create: function( event, ui ) {
			var num = $(this).prop('id');
			num = parseInt(num.substr(num.length-1,num.length));
			$('#roughness_display'+num).html( 5 );
		},
		slide: function( event, ui ) {
			var num = $(this).prop('id');
			num = parseInt(num.substr(num.length-1,num.length));
			$('#roughness_display'+num).html( ui.value );
		}
	});

	$('.duration_slide').slider({
		value: 2000,
		min: 250,
		max: 2000,
		step: 250,
		create: function( event, ui ) {
			var num = $(this).prop('id');
			num = parseInt(num.substr(num.length-1,num.length));
			$('#duration_display'+num).html( '2,000' );
		},
		slide: function( event, ui ) {
			var num = $(this).prop('id');
			num = parseInt(num.substr(num.length-1,num.length));
			$('#duration_display'+num).html( numberWithCommas(ui.value) );
		}
	});

	$('#spline1').splineEditor({
		initialKnots: [
			[30, 10],
			[50, 10],
			[120, 80],
			[350, 190],
			[370, 180]
		]
	});

	$('#spline2').splineEditor({
		initialKnots: [
			[30, 190],
			[50, 190],
			[170, 110],
			[190, 50],
			[200, 10],
			[210, 50],
			[230, 110],
			[350, 190],
			[370, 190]
		]
	});

	$('#spline3').splineEditor({
		initialKnots: [
			[30, 10],
			[50, 10],
			[82, 93],
			[139, 39],
			[179, 137],
			[222, 91],
			[264, 169],
			[293, 138],
			[350, 190]
		]
	});

	$('#spline4').splineEditor({
		initialKnots: [
			[29, 187],
			[52, 189],
			[91, 109],
			[158, 173],
			[236, 145],
			[283, 44],
			[345, 8],
			[368, 18]
 		]
	});

	$('.spline_cover').click(function(){
		$('.spline_holder').css('overflow','initial');
		var num = $(this).prop('id');
		num = parseInt(num.substr(num.length-1,num.length));
		$('#spline'+num).css('transform','scale('+(initialSplineScale*2.2)+')');
		$('#spline'+num).css('z-index','1');
		if(num%2 == 0) {
			$('#spline'+num).css('left','-157px');
			$('#spline_cover'+num).css('left','-157px');
		}
		$('#intensity_label'+num).html('Collapse');
		$('#intensity_label'+num).css({
			'font-weight' : 'bold',
			'color' : '#0099ff'
		});
	});

	window.addEventListener('orientationchange', function() {
		initSplineScale();
	}, false);


	$('.intensity_label').click(function(){
		$('.spline_holder').css('overflow','hidden');
		initSplineScale();
		$('.spline').css('z-index','');
		$('.spline').css('left','');
		$('.spline_cover').css('left','');
		$('.intensity_label').html('Intensity x Time');
		$('.intensity_label').css({
			'font-weight' : '',
			'color' : ''
		});
	});

	$('.play').mousedown(function(){
		var num = $(this).prop('id');
		num = parseInt(num.substr(num.length-1,num.length));
		$(this).blur();
		if($(this).data('enabled')) {
			doDisable(num);
			createPattern(num);
			doVibrate(num);
			doVisuals(num);
			doEnable(num);
			doPrintout(num);
		}
	});

});

/*
	// stop all vibration
	navigator.vibrate(0);
*/

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function initSplineScale() {
	initialSplineScale = ($('#play1').width()/splineWidth)*.95;
	$('.spline, .spline_cover').css({
		'transform' : 'scale('+initialSplineScale+')'
	});
	$('.spline_cover').css({
		'margin-bottom' : '-'+(200-(200*initialSplineScale))+'px'
	});
}

function doDisable(num) {
	$('.play').data('enabled',false);
	$('.play').css({
		'background-color':'#d0d0d0',
		'cursor':'default'
	});
	$('.play span').css('color','#9c9c9c');
	$('.play div').css('border-color','transparent transparent transparent #9c9c9c');
}

function doEnable(num) {
	var pattern = $('#play'+num).data('pattern');
	var sumD = pattern.reduce(function(a, b) {
		return a + b;
	}, 0);
	setTimeout(function(){
		$('.play').data('enabled',true);
		$('.play').css({
			'background-color':'',
			'cursor':''
		});
		$('.play span').css('color','');
		$('.play div').css('border-color','');
		$('.spline_cover').css('background-color','');
	},sumD);
}

function createPattern(num) {
	var pattern = [];
	var sumP = 0;
	var sumV = 0;
	var sumD = 0;
	var vibration = $('#roughness_slide'+num).slider('value');
	var duration = $('#duration_slide'+num).slider('value');
	// minimum oscillations if spline was bottomed out
	var min = Math.floor(duration/(vibration+25));
	// maximum oscillations if spline was topped out
	var max = Math.ceil(duration/(vibration));
	for(var i=min; i<=max; i++) {
		pattern = [vibration];
		sumP = 0;
		sumV = vibration;
		sumD = sumP + sumV;
		var osc = ( splineWidth * 0.75 )/i;
		for(var j=0; j<i; j++) {
			var x = (j*osc) + (splineWidth/8);
			var y = $('#spline'+num).splineEditor('getY', x);
			var pause = ( y - ( splineHeight / 20 ) ) / ( splineHeight * 0.9 ) ;
			pause = Math.round(pause*25);
			if(pause<0) {
				pause = 0;
			} else if(pause>25) {
				pause = 25;
			}
			pattern.push(pause);
			pattern.push(vibration);
			sumP += pause;
			sumV += vibration;
			sumD = sumP + sumV;
		}
		if(sumD>duration) {
			break;
		}
	}
	// apply random sputter
	var sputter = $('#sputter_slide'+num).slider('value')/100;
	var sputters = [];
	for(i=0,il=pattern.length; i<il; i+=2) {
		var newVibration = ( Math.random() * ( sumV ) ) - vibration;
		newVibration = vibration + Math.round( newVibration * sputter );
		sumV -= newVibration;
		if(sumV>-1) {
			sputters.push(newVibration);
		} else {
			sputters.push(0);
		}
	}
	sputters = shuffle(sputters);
	sumP = 0;
	sumV = vibration;
	sumD = sumP + sumV;
	var newPattern = [];
	for(i=0,il=pattern.length; i<il; i+=2) {
		var newVibration = sputters[Math.ceil(i/2)];
		newPattern.push(newVibration);
		sumV += newVibration;
		var pause = 0;
		if(i+1<pattern.length) {
			pause = pattern[i+1]; // add original pause
			newPattern.push(pause);
			sumP += pause;
		}
		sumD = sumP + sumV;
	}
	pattern = newPattern;
	$('#play'+num).data('pattern',pattern);
}

function shuffle(array) {
	// Fisher-Yates (aka Knuth) Shuffle
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function doVibrate(num) {
	if(navigator.vibrate) {
		var pattern = $('#play'+num).data('pattern');
		navigator.vibrate(pattern);
	}
}

function doVisuals(num) {
	if($('#visuals'+num).data('visuals')) {
		var pattern = $('#play'+num).data('pattern');
		var sumD = 0;
		for(i=0,il=pattern.length; i<il; i++) {
			sumD += pattern[i];
			var v = 0, p = 0;
			if(i%2 == 0) {
				v = pattern[i];
				p = pattern[i-1];
				if(!p) { p=0; }
			} else {
				p = pattern[i];
				v = pattern[i-1];
			}
			setTimeout($.proxy(timer.setColor, timer, num, v, p), sumD);
		}
	}
}

var timer = {
	setColor: function(num,v,p){
		// better visualization some day
		var w = 256 - Math.ceil(p*10.24);
		var r = w;
		var g = w;
		var b = w;
		$('#spline_cover'+num).css('background-color','rgb('+r+','+g+','+b+')');
	}
};

function doPrintout(num) {
	var pattern = $('#play'+num).data('pattern');
	$('#printout span').html('navigator.vibrate('+pattern+');');
}

