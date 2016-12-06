const Q = require("Q")

const express = require('express');
const path = require('path');
const ejs = require('ejs');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config 	  = require('./webpack.config.js');
const compiler	  = webpack(config)

const serveStatic = require('serve-static')

function Server(app, port){
	this.app = app
	this.port = port
}

Server.prototype.start = function(){
	return Q()
		.then(bindWebpack.bind(this))
		.then(bindTemplate.bind(this))
		.then(bindStatic.bind(this))
		.then(startServer.bind(this))
        .catch(onError.bind(this));
}

//绑定webpack
function bindWebpack(){
	config.entry = Object.keys(config.entry)
                    	 .reduce(function(entries, name) {
                    	 	config.entry[name].unshift('webpack-hot-middleware/client');
	                        return config.entry;
	                     }, {});

	this.app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
	this.app.use(webpackHotMiddleware(compiler))
}

function bindTemplate() {
    this.app.set('views', './client/view');
    this.app.set('view engine', 'html');
    this.app.engine('html', ejs.renderFile);
}

//设置静态文件目录
function bindStatic(){
	this.app.use("/static", serveStatic(path.join(__dirname, './client/static')))
}

function startServer(){
	const port = this.port

	this.app.get("/", function(req, res) {
		res.sendFile(__dirname + '/client/view/index.html')
	})

	this.app.listen(port, function(error) {
		if (error) {
			throw error
		} else {
			console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
			// open("http://127.0.0.1:8086/index.php")
		}
	})
}

function onError(e){
    console.error(e.stack ? e.stack : e)
    process.exit()
}

module.exports = Server;
