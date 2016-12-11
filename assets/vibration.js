/*
 Author: Mattthew Brauer, twitter @mattthew
 MIT license
*/

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

var initialSplineScale = 1;
var splineWidth = 0;
var splineHeight = 0;

$(document).ready(function(){

	$('body').scrollTop(5000);

	splineWidth = parseInt($('#spline1').css('width'));
	splineHeight = parseInt($('#spline1').css('height'));

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

	$('#visuals1, #visuals2').data('visuals',false);
	$('#visuals1, #visuals_label1, #visuals2, #visuals_label2').click(function(){
		var num = $(this).prop('id').indexOf('1');
		num < 0 ? num = 2 : num = 1;
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

	$( '#sputter_slide1' ).slider({
		value: 0,
		min: 0,
		max: 100,
		step: 1,
		create: function( event, ui ) {
			$( '#sputter_display1' ).html( 0 );
		},
		slide: function( event, ui ) {
			$( '#sputter_display1' ).html( ui.value );
		}
	});

	$( '#sputter_slide2' ).slider({
		value: 0,
		min: 0,
		max: 100,
		step: 1,
		create: function( event, ui ) {
			$( '#sputter_display2' ).html( 100 );
		},
		slide: function( event, ui ) {
			$( '#sputter_display2' ).html( ui.value );
		}
	});

	$( '#roughness_slide1' ).slider({
		value: 5,
		min: 5,
		max: 20,
		step: 5,
		create: function( event, ui ) {
			$( '#roughness_display1' ).html( 5 );
		},
		slide: function( event, ui ) {
			$( '#roughness_display1' ).html( ui.value );
		}
	});

	$( '#roughness_slide2' ).slider({
		value: 5,
		min: 5,
		max: 20,
		step: 5,
		create: function( event, ui ) {
			$( '#roughness_display2' ).html( 20 );
		},
		slide: function( event, ui ) {
			$( '#roughness_display2' ).html( ui.value );
		}
	});

	$( '#duration_slide1' ).slider({
		value: 2000,
		min: 250,
		max: 2000,
		step: 250,
		create: function( event, ui ) {
			$( '#duration_display1' ).html( '2,000' );
		},
		slide: function( event, ui ) {
			$( '#duration_display1' ).html( numberWithCommas(ui.value) );
		}
	});

	$( '#duration_slide2' ).slider({
		value: 2000,
		min: 250,
		max: 2000,
		step: 250,
		create: function( event, ui ) {
			$( '#duration_display2' ).html( '2,000');
		},
		slide: function( event, ui ) {
			$( '#duration_display2' ).html( numberWithCommas(ui.value) );
		}
	});

	$('#spline1').splineEditor({
		initialKnots: [
			[30, 10],
			[50, 10],
			[350, 190],
			[370, 190]
		]
	});

	$('#spline2').splineEditor({
		initialKnots: [
			[30, 190],
			[50, 190],
			[200, 10],
			[350, 190],
			[370, 190]
		]
	});

	initSplineScale();

	$('#spline_cover1, #spline_cover2').click(function(){
		var num = $(this).prop('id').indexOf('1');
		num < 0 ? num = 2 : num = 1;
		$('#spline'+num).css('transform','scale('+(initialSplineScale*2.2)+')');
		$('#spline'+num).css('z-index','1');
		if(num==2) {
			$('#spline2, #spline_cover2').css('left','-192px');
		}
		$('#intensity_label'+num).html('Collapse');
		$('#intensity_label'+num).css({
			'font-weight' : 'bold',
			'color' : '#0099ff'
		});
	});

	$('#intensity_label1, #intensity_label2').click(function(){
		initSplineScale();
		$('#spline1, #spline2').css('z-index','');
		$('#spline2, #spline_cover2').css('left','');
		$('#intensity_label1, intensity_label2').html('Intensity x Time');
		$('#intensity_label1, #intensity_label2').css({
			'font-weight' : '',
			'color' : ''
		});
	});

	$('#play1, #play2').data('enabled',true);
	$('#play1, #play2').mousedown(function(){
		var num = $(this).prop('id').indexOf('1');
		num < 0 ? num = 2 : num = 1;
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
	$('#spline1, #spline2, #spline_cover1, #spline_cover2').css('transform','scale('+initialSplineScale+')');
	$('#spline_cover1, #spline_cover2').css('margin-bottom','-'+(200-(200*initialSplineScale))+'px');
}

function doDisable(num) {
	$('#play1, #play2').data('enabled',false);
	$('#play1, #play2').css({
		'background-color':'#d0d0d0',
		'cursor':'default'
	});
	$('#play1 span, #play2 span').css('color','#9c9c9c');
	$('#play1 div, #play2 div').css('border-color','transparent transparent transparent #9c9c9c');
}

function doEnable(num) {
	var pattern = $('#play'+num).data('pattern');
	var sumD = pattern.reduce(function(a, b) {
		return a + b;
	}, 0);
	setTimeout(function(){
		$('#play1, #play2').data('enabled',true);
		$('#play1, #play2').css({
			'background-color':'',
			'cursor':''
		});
		$('#play1 span, #play2 span').css('color','');
		$('#play1 div, #play2 div').css('border-color','');
		$('#spline_cover'+num).css('background-color','');
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

