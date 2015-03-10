# Paradiddles System
![Drums](http://i.imgur.com/rpHYdKS.jpg)


API reference is available at http://jazz-soft.net/doc/Jazz-Plugin/reference.html


Questions and comments are welcome at http://jazz-soft.org/


## How to?

    node app 

and point your browser to **localhost:2311**

[Demo](http://drumset.herokuapp.com/)

## app.js

``` js
var jazz = require('jazz-midi'),
Jazz = new jazz.MIDI(),
express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
  socket.on('ready', function(){
    socket.emit('list', jazz.MidiOutList());
  });
  
  socket.on('selectmidi', function(data) {console.log(data);
    Jazz.MidiOutOpen(data);
  });

  socket.on('mididata', function(data){
    var l = data.l;
    var r = data.r;
    Jazz.MidiOut(0x99, l, 111);
    Jazz.MidiOut(0x99, r, 111);
  });

  socket.on('time', function(data){
    Jazz.MidiOut(0x99,data,119);
  });
  
  socket.on('pitch', function(data) {
    Jazz.MidiOut(0xe9, 0, data); 
  });
  
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

server.listen(2311);
```
