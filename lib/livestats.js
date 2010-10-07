var http = require('http'),
	sys = require('sys'),
	nodeStatic = require('node-static/lib/node-static');

function LiveStats(options) {

	var file = new(nodeStatic.Server)('./public', {cache: false});	
	var server = http.createServer(function(request, response) {
		request.addListener('end', function() {
			file.serve(request, response);
		})
	})
	server.listen(8124);

};

module.exports = LiveStats;