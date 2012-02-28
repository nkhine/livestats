var http = require('http'),
    util  = require('util'),
    static = require('node-static'),
    faye = require('faye'),
    url = require('url'),
		geoip = require('geoip-lite');

function LiveStats(options) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;
  
  self.settings = {
    port: options.port
  };

  self.init();
};

LiveStats.prototype.init = function() {
  var self = this;

  self.bayeux = self.createBayeuxServer();
  self.httpServer = self.createHTTPServer();

  self.bayeux.attach(self.httpServer);
  self.httpServer.listen(self.settings.port);
  console.log('Server started on PORT ' + self.settings.port);
};

LiveStats.prototype.createBayeuxServer = function() {
  var self = this;
  
  var bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
  });
  
  return bayeux;
};

LiveStats.prototype.createHTTPServer = function() {
  var self = this;

  var server = http.createServer(function(request, response) {
    var file = new static.Server('./public', {
      cache: false
    });

    request.addListener('end', function() {
			
      var location = url.parse(request.url, true),
          params = (location.query || request.headers);
      
      if (location.pathname == '/config.json' && request.method == "GET") {
        response.writeHead(200, {
          'Content-Type': 'application/x-javascript'
        });
        var jsonString = JSON.stringify({
          port: self.settings.port
        });
        response.end(jsonString);
			} else if (location.pathname == '/stats/1.gif' && request.method == 'GET') {
				var origin;
				response.writeHead(200, {
		      'Content-Type': 'image/gif'
		    });
				origin = /\/(.*)\.gif/.exec(request.url);
				if (origin) {
					var ip = request.connection.remoteAddress;
					var geo = geoip.lookup(ip);
					console.log(geo);
		      console.log(origin[1], request.connection.remoteAddress, request.headers['user-agent']);
					self.bayeux.getClient().publish('/stat', {
              title: 'user'
            , latitude: geo.ll[0]
            , longitude: geo.ll[1]
            , ip: ip
          });
					console.log(origin[1], request.connection.remoteAddress, request.headers['user-agent']);
		    }
				response.end("OK");
      } else {
        file.serve(request, response);
      }
    });
  });
  return server;
};

module.exports = LiveStats;
