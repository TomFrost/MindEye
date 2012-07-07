// Dependencies
var fs = require('fs'),
	brain = require('brain'),
	config = require('config'),
	Seq = require('seq');

// Constants
const DB_PATH = __dirname + "/db/traindata.db";

// Private members
var trainData = [],
	trainQueue = [],
	trainScheduled = false;

// Accept new images
process.on('message', function(m) {
	trainData.push({
		input: m.input,
		output: m.output
	});
	trainQueue.push(m.id);
	if (!trainScheduled) {
		trainScheduled = true;
		process.nextTick(function() {
			train();
		});
	}
});

// Trains entire trainData array into new neural net
function train() {
	console.log('Training ' + trainData.length + ' records.');
	var mind = new brain.NeuralNetwork(),
		result = mind.train(trainData);
	fs.writeFileSync(DB_PATH, JSON.stringify(trainData), 'utf8');
	process.send({
		trained: trainQueue,
		result: result,
		mind: mind.toJSON()
	});
	trainQueue = [];
	trainScheduled = false;
}

// Init
Seq()
	.seq(function checkIfExists() {
		fs.stat(DB_PATH, this);
	})
	.seq(function readData() {
		fs.readFile(DB_PATH, 'utf8', this);
	})
	.seq(function parseData(data) {
		trainData = JSON.parse(data);
		this();
	})
	.catch(function fileErr(err) {
		if (err.code == 'ENOENT')
			console.log("No DB file found.");
		else
			console.log("Could not load image DB from file.", err);
	})
	.seq(function callTrain() {
		if (trainData.length)
			train();
	})
	.catch(function trainError(err) {
		console.log("Could not start trainer.", err);
	});
