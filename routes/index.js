var brain = require('brain'),
	mind = require('../mind');

exports.index = function(req, res) {
  res.render('index', { title: 'MindEye' })
};

exports.train = function(req, res) {
	var train = req.body;
	if (!train || !train.name || !train.pixels) {
		res.statusCode = 400;
		res.send(JSON.stringify({
			success: false,
			error: "Bad request"
		}))
	}
	else {
		mind.train(train.pixels, train.name, function(err, result) {
			if (err) {
				res.send(JSON.stringify({
					success: false,
					error: err
				}));
			}
			else {
				res.send(JSON.stringify({
					success: true,
					result: result
				}));
			}
		});
	}
};

exports.guess = function(req, res) {
	var guess = req.body;
	if (!guess || !guess.pixels) {
		res.statusCode = 400;
		res.send(JSON.stringify({
			success: false,
			error: "Bad request"
		}));
	}
	else {
		res.send(JSON.stringify({
			success: true,
			result: mind.guess(guess.pixels)
		}));
	}
};
