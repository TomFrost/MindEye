// Dependencies
var cp = require('child_process'),
	brain = require('brain');

// Private members
var trainer,
	neuralNet,
	lastId = 0,
	callbacks = {};

function initTrainer() {
	console.log('Initializing Trainer.');
	trainer = cp.fork(__dirname + "/trainer.js", [], {cwd: __dirname});

	trainer.on('exit', function(code) {
		console.log('Trainer died with code ' + code + '. Restarting.');
		initTrainer();
	});

	trainer.on('stdout', function(m) {
		console.log('TRAINER:', m);
	});

	trainer.on('message', function(m) {
		if (m.mind) {
			neuralNet = new brain.NeuralNetwork();
			neuralNet.fromJSON(m.mind);
			console.log('Got mind!');
		}
		if (m.trained) {
			m.trained.forEach(function(id) {
				if (callbacks[id]) {
					callbacks[id](null, m.result);
					delete callbacks[id];
				}
			});
		}
	});
}

initTrainer();

module.exports = {
	guess: function(pixels) {
		return neuralNet.run(pixels);
	},
	train: function(pixels, name, callback) {
		var trainSpecs = {
			id: ++lastId,
			input: pixels,
			output: {}
		};
		if (callback)
			callbacks[lastId] = callback;
		trainSpecs.output[name.toLowerCase()] = 1;
		trainer.send(trainSpecs);
	}
};