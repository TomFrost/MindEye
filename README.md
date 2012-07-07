# MindEye
A proof-of-concept drawing recognition app.

## Installation
Clone MindEye, and install dependencies:

	git clone git://github.com/TomFrost/MindEye.git
	cd MindEye
	npm install

Configuration is in config/default.yaml.  You may create a production.yaml and
development.yaml to be applied over to the default config when MindEye is
executed in those environments.  By default, MindEye runs on port 3000.

## Starting MindEye
Just run app.js:

	node app.js

Then visit http://localhost:3000 in your browser.

## What is this?
MindEye was just a fun little proof-of-concept to play with neural nets.  While
it's designed with non-blocking logic and should, in theory, play nice on a
server with multiple users, extensive testing has not been done and abuse is
very possible.  Use with care.  But it will save its training between launches,
and is fun to play with :)

## Credits
MindEye was created for the hell of it by Tom Frost in 2012.
