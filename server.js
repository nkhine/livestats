var http = require('http'),
	sys = require('sys');
	
var server = http.createServer(function(request, response) {
	request.addListener('end', function() {
		response.writeHead(200, {
			'Content-Type': 'text/plain'
			});
		response.write(sys.inspect(request));
		response.end();
	};)
})
server.listen(8000);