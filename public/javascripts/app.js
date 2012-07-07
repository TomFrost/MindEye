(function($) {
	var drawing = false,
		erasing = false,
		jdoc = $(document);

	function getPixelArray() {
		var pixels = [];
		$('.pixel').each(function(idx, val) {
			pixels.push($(val).hasClass('on') ? 1 : 0);
		});
		return pixels;
	}

	function guessComplete(data, status) {
		if (!data.success) guessFail(data, status);
		else {
			var keys = data.result,
				name,
				weight = 0;
			for (var key in keys) {
				if (keys.hasOwnProperty(key) && keys[key] > weight) {
					weight = keys[key];
					name = key;
				}
			}
			if (name) {
				weight = Math.floor(weight * 100000) / 1000;
				setStatus("Result: '" + name + "'. Certainty: " + weight + "%.");
			}
			else
				setStatus("The neural net needs training!");
			if (console) console.log('GUESS SUCCESS', data);
		}
	}

	function guessFail(data, status) {
		setStatus('Guess failed! Error dumped to the console.');
		if (console) console.error('GUESS ERROR', data, status);
	}

	function trainComplete(data, status) {
		if (!data.success) trainFail(data, status);
		else {
			var margin = Math.floor(data.result.error * 100000) / 1000;
			setStatus('Trained to error margin ' + margin +
				'% in ' + data.result.iterations + ' iterations.');
			if (console) console.log('TRAIN SUCCESS', data);
		}
	}

	function trainFail(data, status) {
		setStatus('Training failed! Error dumped to the console.');
		if (console) console.error('TRAIN ERROR', data, status);
	}

	function setStatus(str) {
		$('#result').text(str);
	}

	jdoc.on('mousedown', '.pixel', function(ev) {
		var pixel = $(ev.target);
		if (pixel.hasClass('on')) erasing = true;
		else drawing = true;
		pixel.toggleClass('on');
	});

	jdoc.on('mouseup', 'body', function() {
		drawing = false;
		erasing = false;
	});

	jdoc.on('mouseover', '.pixel', function(ev) {
		var pixel = $(ev.target);
		if (drawing) pixel.addClass('on');
		else if (erasing) pixel.removeClass('on');
	});

	jdoc.on('click', '#erase', function() {
		$('.pixel').removeClass('on');
		$('#train-text').val('');
	});

	jdoc.on('click', '#train', function() {
		var name = $('#train-text').val();
		if (!name) alert('Name what you drew first!');
		else {
			var req = {
				name: name,
				pixels: getPixelArray()
			};
			setStatus('Waiting...');
			$.ajax('/train', {
				type: 'POST',
				cache: false,
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(req),
				processData: false,
				success: trainComplete,
				error: trainFail
			});
		}
	});

	jdoc.on('click', '#guess', function() {
		var req = {
			pixels: getPixelArray()
		};
		setStatus('Waiting...');
		$.ajax('/guess', {
			type: 'POST',
			cache: false,
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(req),
			processData: false,
			success: guessComplete,
			error: guessFail
		})
	});
})(jQuery);