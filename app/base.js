var dgram = require("dgram");
var ip = require("ip");

var s = dgram.createSocket("udp4");

var PORT = 41234;

s.on("message", function(msg, rinfo) {
	if(rinfo.address == ip.address()) {
		return;
	}

	if (['k', 'v'].indexOf(msg.toString()) == -1) {
		if (msg.toString().slice(-1) == '*') {
			s.emit('broad', msg.toString().slice(0, -1), rinfo);
		} else {
			s.emit('thread', msg.toString(), rinfo);
		}
	} else {
		s.emit('adduser', undefined, rinfo);
		if (msg.toString() == 'k') {
			s.send('v', 0, 1, PORT, rinfo.address);
		}
	}
});

s.on("listening", function() {
	s.setBroadcast(1);
	s.send('k', 0, 1, PORT, '255.255.255.255');
});

s.bind(PORT);

module.exports = {
	port: PORT,
	ip: ip.address(),
	send: function (msg, dst) {
		var realMsg = msg + (dst == '255.255.255.255' ? '*' : '');
		var buf = new Buffer(realMsg);
		s.send(buf, 0, buf.length, PORT, dst);
	},
	on: function(type, cb) {
		s.on(type, function (msg, rinfo) {
			msg == undefined ? cb(rinfo) : cb(msg, rinfo);
		});
	}
};