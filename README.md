# Paradiddles System ![Drums](http://i.imgur.com/rpHYdKS.jpg)


API reference is available at http://jazz-soft.net/doc/Jazz-Plugin/reference.html


Questions and comments are welcome at http://jazz-soft.org/


## How to?

    node app 

and point your browser to **localhost:2311**

**[Demo]** 
[Demo]: http://drumset.herokuapp.com/


## app.js

``` js
var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
  socket.on('createNote', function(data) {
    socket.broadcast.emit('onNoteCreated', data);
  });

  socket.on('changePattern', function(data) {
	 socket.broadcast.emit('onPatternChanged', data);
  });

  socket.on('changeBeat', function(data){
	 socket.broadcast.emit('onBeatChanged', data);
  });

  socket.on('deleteNote', function(data){
	 socket.broadcast.emit('onNoteDeleted', data);
  });
});

var port = Number(process.env.PORT || 2311);
server.listen(port); 
```
