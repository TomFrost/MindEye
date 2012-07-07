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
MindEye was just a fun little proof-of-concept to play with neural nets.  It is
not meant to be launched on a webserver (much of its logic is blocking) or used
by multiple users.  It doesn't maintain its state or do anything you'd want it
to do on a production server.  But it's fun to play with :)

## Credits
MindEye was created for the hell of it by Tom Frost in 2012.
