var brain = require('brain'),
	mind = new brain.NeuralNetwork(),
	trainData = [];

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
		var trainSpecs = {
			input: train.pixels,
			output: {}
		};
		trainSpecs.output[train.name.toLowerCase()] = 1;
		trainData.push(trainSpecs);
		mind = new brain.NeuralNetwork();
		var result = mind.train(trainData, {
			log: true,
			logPeriod: 10
		});
		console.log(result);
		res.send(JSON.stringify({
			success: true,
			result: result
		}));
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
			result: mind.run(guess.pixels)
		}));
	}
};

exports.net = function(req, res) {
	res.send(mind.toJSON());
};