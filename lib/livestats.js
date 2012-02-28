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
    port: options.port,
    geoipServer: {
        hostname: options.geoipServer.hostname
      , port:     options.geoipServer.port || 80
    }
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
      } else if (location.pathname == '/stat' && request.method == 'GET') {
        self.ipToPosition(params.ip, function(latitude, longitude, city) {
          self.bayeux.getClient().publish('/stat', {
              title: params.title
            , latitude: latitude
            , longitude: longitude
            , city: city
            , ip: params.ip
          });
        });
        
        response.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        response.end("OK");
      } else {
        file.serve(request, response);
      }
    });
  });

  return server;
};

LiveStats.prototype.ipToPosition = function (ip, callback) {
  var self = this;
	var geo = geoip.lookup(ip);
  var client = http.createClient(self.settings.geoipServer.port, 
                                 self.settings.geoipServer.hostname);
	console.log(geo);
  
	var request = client.request('GET', '/geoip/api/locate.json?ip=' + ip, {
    'host': self.settings.geoipServer.hostname
  });
  request.end();

  request.on('response', function (response) { 
    response.setEncoding('utf8');

    var body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      var json = JSON.parse(body);

      if (json.latitude && json.longitude) {
        callback(json.latitude, json.longitude, json.city);
      }
    });
  });

};

module.exports = LiveStats;
