var myModule = angular.module('myModule',['pragmatic-angular']);

myModule.factory('socket', function($rootScope) {
  var socket = io.connect();
  return {
	 on: function(eventName, callback) {
		socket.on(eventName, function() {
		  var args = arguments;
		  $rootScope.$apply(function() {
			 callback.apply(socket, args);
		  });
		});
	 },
	 emit: function(eventName, data, callback) {
		socket.emit(eventName, data, function() {
		  var args = arguments;
		  $rootScope.$apply(function() {
			 if(callback) {
				callback.apply(socket, args);
			 }
		  });
		});
	 }
  };
});

function myController($scope, $timeout, socket) {
  // Incoming
  socket.on('list', function(data){
    $scope.list = data;
  }) 
 
  socket.on('onNoteCreated', function(data) {
	 if (data.set === 'L') {
	  	$scope.side = data.set;
		$scope.set.push(data.id); console.log(data);
		console.log($scope.set + ';' + _.size($scope.set));
	 }
	 if (data.set === 'R') {
	  	$scope.side = data.set;
		$scope.Set.push(data.id); console.log(data);
		console.log($scope.Set + ';' + _.size($scope.Set));
	 }	  
  });
	
  socket.on('onPatternChanged', function(data) {
	 if (data.set === 'L') {
		$scope.Lpattern = data.id; console.log(data);
		console.log($scope.Lpattern);
	 }
	 if (data.set === 'R') {
		$scope.Rpattern = data.id; console.log(data);
		console.log($scope.Rpattern);
	 }	  
  });
	
  socket.on('onBeatChanged', function(data) {
    $scope.beats = data.id;
	 console.log($scope.beats);
	 $( "#beats" ).slider( "option", "value", $scope.beats );
  });
  
  socket.on('onNoteDeleted', function(data) {
      console.log(data);
    if (data.set === "L") {
      if(_.size($scope.set) > 1){
	     $scope.set.splice(data.id, 1);
	     if(_.size($scope.set) == 1){
	       $scope.sound = $scope.mas[$scope.set[0]];
	       $scope.note = $scope.set[0];
	     };  
	     console.log($scope.set + ';' + _.size($scope.set));
	   };
	 }
	 if (data.set === "R") {
	   if(_.size($scope.Set) > 1){
	     $scope.Set.splice(data.id, 1);
	     if(_.size($scope.Set) == 1){
	       $scope.Sound = $scope.mas[$scope.Set[0]];
	       $scope.Note = $scope.Set[0];
	     }; 
	     console.log($scope.Set + ';' + _.size($scope.Set));
	   };
	 };  
  });	
      
  // Outgoing
  $scope.onReady = function() {
	 socket.emit('ready');
  };
  
  $scope.createNote = function(set, note) {
	 var note_id = {
		set: set,
		id: note,			
	 };
	 socket.emit('createNote', note_id);
  };

  $scope.changepattern = function(set, pattern) {
	 var pattern_id = {
		set: set,
		id: pattern,			
	 };
	 socket.emit('changePattern', pattern_id);
  };
 
  $scope.changeBeat = function(beats) {
	 var beats_id = {
		id: beats,			
	 };
	 socket.emit('changeBeat', beats_id);
  };
  
  $scope.deleteNote = function(set, index) {
	 var note_id = {
		set: set,
		id: index,			
	 };
	 socket.emit('deleteNote', note_id);
  };
  
  $scope.shuffle = function() {
    $scope.note = _.sample(_.range(27, 88));
    $scope.sound = $scope.mas[$scope.note]; console.log($scope.sound);
    $scope.Note = _.sample(_.range(27, 88));
    $scope.Sound = $scope.mas[$scope.Note]; console.log($scope.Sound);
    $scope.set[0] = $scope.note; console.log($scope.set + ';' + _.size($scope.set));
    $scope.Set[0] = $scope.Note; console.log($scope.Set + ';' + _.size($scope.Set));
  };
 
  $scope.OnChange = function(set, index) {
    if (set === "L") {
      var note = index + 26;
      $scope.note = note;
      $scope.sound = $scope.mas[note];
    }
    if (set === "R") {
      var note = index + 26;
      $scope.Note = note;
      $scope.Sound = $scope.mas[note];
    }
  }
   
  $scope.onStop = function(event, ui) {
    $scope.beats = ui.value;
    $scope.$apply();
    $scope.changeBeat($scope.beats);
  };

  $scope.destroy = function(set, index) {
    if (set === "L") {
      if(_.size($scope.set) > 1){
	     $scope.set.splice(index, 1);
	     if(_.size($scope.set) == 1){
	       $scope.sound = $scope.mas[$scope.set[0]];
	       $scope.note = $scope.set[0];
	     };  
	     console.log($scope.set + ';' + _.size($scope.set)); $scope.deleteNote(set, index);
	   };
	 }
	 if (set === "R") {
	   if(_.size($scope.Set) > 1){
	     $scope.Set.splice(index, 1);
	     if(_.size($scope.Set) == 1){
	       $scope.Sound = $scope.mas[$scope.Set[0]];
	       $scope.Note = $scope.Set[0];
	     }; 
	     console.log($scope.Set + ';' + _.size($scope.Set)); $scope.deleteNote(set, index);
	   };
	 };
  };
  
  $scope.addToSet = function(set, index) {
    if (set === 'L') { 
      var note = index + 26;
      if (_.indexOf($scope.set, note) == -1 && _.size($scope.set) <= 7){
        $scope.set.push(note);
        console.log($scope.set + ';' + _.size($scope.set));
        
        $scope.createNote(set, note);      
      };
    }
    if (set === 'R') { 
      var note = index + 26;
      if (_.indexOf($scope.Set, note) == -1 && _.size($scope.Set) <= 7){
        $scope.Set.push(note);
        console.log($scope.Set + ';' + _.size($scope.Set));
              
        $scope.createNote(set, note);      
      };
    };
  };
  
  $scope.play = function() {
    $scope.state = !$scope.state;
    if($scope.state){
      $scope.playing = 'Play'; $( "#play" ).button( "option", "label", "Play" );
      $timeout.cancel(timeout); 
      $scope.Playing = false; $timeout.cancel($scope.Timeout); 
    } 
    else {
      $scope.playing = 'Stop'; $( "#play" ).button( "option", "label", "Stop" );
      $scope.count=-1; tick();
    }  
  };
  
  $scope.random = function() {
    $scope.Playing = !$scope.Playing;
    if($scope.Playing){
      $scope.randomize();
    } 
    else {
      $timeout.cancel($scope.Timeout); 
    }  
  };
  
  $scope.randomize = function() {
    var minus = [7,0,1,2,3,4,5,6]; var last = minus[$scope.count]; var blast = minus[last];
 	 if(_.size($scope.Set) == 1){	
      $scope.Snd = $scope.Updown();
    }
    else{
      if(Number($scope.Rpattern[blast]) == 0 && Number($scope.Rpattern[last]) == 1){
        $scope.Visual();
      }
    };
    if(_.size($scope.set) == 1){	
    	$scope.snd = $scope.updown();
    }
    else{
     	if(Number($scope.Lpattern[blast]) == 0 && Number($scope.Lpattern[last]) == 1){
     	  $scope.visual();
      }
    };     
    $scope.Timeout = $timeout(function() {
      $scope.randomize();
    }, $scope.interval);            
  };
    
  $scope.visual = function (){
    $scope.snd = Math.floor(Math.random() * _.size($scope.set));
    $scope.note = $scope.set[$scope.snd];
  };
       
  $scope.Visual = function (){ 
    $scope.Snd = Math.floor(Math.random() * _.size($scope.Set));
    $scope.Note = $scope.Set[$scope.Snd];
  };
        
  $scope.changetempo = function() {
    $scope.interval = 60000 / $scope._tempo * 0.25;
  };
  
  $scope.changemidi = function() {
    socket.emit('selectmidi', $scope._out);
    $('select').blur();
  };
    
  $scope.updown = function() {
    var beat = Number($scope.Lpattern[$scope.count]);
    return beat;
  };
  
  $scope.Updown = function() {
    var beat = Number($scope.Rpattern[$scope.count]);
    return beat;
  };
  
  var tick = function (){
    $scope.count ++;
    if($scope.count >= $scope.beats) $scope.count = 0; 
    if ($scope.checked) $scope.metronome();
    var l = $scope.updown() ? $scope.note : 0;
    var r = $scope.Updown() ? $scope.Note : 0;
    var data = {l: l, r: r};
    socket.emit('mididata', data);
    
    timeout = $timeout(function() {
      tick();
    }, $scope.interval);
  }
  
  $scope.metronome = function (){
  	 var data = $scope.count ? 0 : 34;
    socket.emit('time', data);
  };

  $scope.mas = {
    26 : "Silence", 27 : "High-Q", 28 : "Slap", 29 : "Scratch Push", 30 : "Scratch Pull", 31 : "Sticks", 32 : "Square Click", 33 : "Metronome Click",
    34 : "Metronome Bell", 35 : "Acoustic Bass Drum", 36 : "Bass Drum", 37 : "Side Stick", 38 : "Acoustic Snare", 39 : "Hand Clap", 40 : "Electric Snare",
    41 : "Low Floor Tom", 42 : "Closed Hi Hat", 43 : "High Floor Tom", 44 : "Pedal Hi-Hat", 45 : "Low Tom", 46 : "Open Hi-Hat", 47 : "Low-Mid Tom",
    48 : "Hi-Mid Tom", 49 : "Crash Cymbal 1", 50 : "High Tom", 51 : "Ride Cymbal 1", 52 : "Chinese Cymbal", 53 : "Ride Bell", 54 : "Tambourine", 55 : "Splash Cymbal",
    56 : "Cowbell", 57 : "Crash Cymbal 2", 58 : "Vibraslap", 59 : "Ride Cymbal 2", 60 : "Hi Bongo", 61 : "Low Bongo", 62 : "Mute Hi Conga", 63 : "Open Hi Conga",
    64 : "Low Conga", 65 : "High Timbale", 66 : "Low Timbale", 67 : "High Agogo", 68 : "Low Agogo", 69 : "Cabasa", 70 : "Maracas", 71 : "Short Whistle",
    72 : "Long Whistle", 73 : "Short Guiro", 74 : "Long Guiro", 75 : "Claves", 76 : "Hi Wood Block", 77 : "Low Wood Block", 78 : "Mute Cuica", 79 : "Open Cuica",
    80 : "Mute Triangle", 81 : "Open Triangle", 82 : "Shaker", 83 : "Jingle Bell", 84 : "Bell Tree", 85 : "Castanets", 86 : "Mute Surdo", 87 : "Open Surdo"
  }
 
  $scope.R1 = [{p: "10101010", bg: "tomato"}, {p: "10100110", bg: "#66FFFF"}, {p: "10011010", bg: "#66FFFF"}, {p: "10110110", bg: "#66CCFF"}, {p: "10010010", bg: "#FFCCFF"}, {p: "10010110", bg: "#CCFF99"}, {p: "10110010", bg: "#FFFF99"}];
  $scope.R2 = [{p: "10101100", bg: "#FFFF99"}, {p: "10100100", bg: "#FFCCFF"}, {p: "10110100", bg: "#CCFF99"}, {p: "10010100", bg: "#FFCCFF"}];
  $scope.R3 = [{p: "10100101", bg: "#CCFF99"}, {p: "10101101", bg: "#66CCFF"}, {p: "10110101", bg: "#66CCFF"}, {p: "10010101", bg: "#FFFF99"}, {p: "10101001", bg: "#66FFFF"}, {p: "10011001", bg: "#FFCC66"}];
  $scope.R4 = ["10011011", "10010011", "10101011", "10110011"];
  $scope.R5 = [{p: "11001100", bg: "#FFCC66"}, {p: "11010100", bg: "#66FFFF"}];
  $scope.R6 = [{p: "11001010", bg: "#FFFF99"}, {p: "11011010", bg: "#66CCFF"}, {p: "11010010", bg: "#CCFF99"}, {p: "11010110", bg: "#66CCFF"}];
  $scope.R7 = ["11011011", "11010011", "11001011"];
  $scope.R8 = ["11011001", "11001001", "11010101", "11001101"];
  $scope.L1 = [{p: "01010101", bg: "tomato"}, {p: "01011001", bg: "#FFFF99"}, {p: "01100101", bg: "#FFFF99"}, {p: "01001001", bg: "#FFCCFF"}, {p: "01101101", bg: "#66CCFF"}, {p: "01101001", bg: "#CCFF99"}, {p: "01001101", bg: "#66FFFF"}];
  $scope.L2 = [{p: "01010011", bg: "#66FFFF"}, {p: "01011011", bg: "#66CCFF"}, {p: "01001011", bg: "#CCFF99"}, {p: "01101011", bg: "#66CCFF"}];
  $scope.L3 = [{p: "01011010", bg: "#CCFF99"}, {p: "01010010", bg: "#FFCCFF"}, {p: "01001010", bg: "#FFCCFF"}, {p: "01101010", bg: "#66FFFF"}, {p: "01010110", bg: "#FFFF99"}, {p: "01100110", bg: "#FFCC66"}];
  $scope.L4 = ["01100100", "01101100", "01010100", "01001100"];
  $scope.L5 = [{p: "00110011", bg: "#FFCC66"}, {p: "00101011", bg: "#FFFF99"}]; 
  $scope.L6 = [{p: "00110101", bg: "#66FFFF"}, {p: "00100101", bg: "#FFCCFF"}, {p: "00101101", bg: "#CCFF99"}, {p: "00101001", bg: "#FFCCFF"}];
  $scope.L7 = ["00100100", "00101100", "00110100"];
  $scope.L8 = ["00100110", "00110110", "00101010", "00110010"]; 

  $scope.interval = 120;
  $scope.W = window.innerWidth * 0.34;
  $scope.state = true;
  $scope.playing = 'Play'; $scope.Playing = false;
  $scope.count = 1;
  $scope.beats = 8;
  $scope._tempo = 125;
  $scope.Lpattern = "01001011";
  $scope.Rpattern = "10110100";
  $scope.set = [];
  $scope.Set = [];
  $scope.note = 42;
  $scope.Note = 46;
  $scope.sound = "Closed Hi Hat";
  $scope.Sound = "Open Hi-Hat";
    
  $scope.changeRpattern = function(p) {
    $scope.Rpattern = p;
    console.log($scope.Rpattern);
    $scope.changepattern('R', p);
  }
  $scope.changeLpattern = function(p) {
    $scope.Lpattern = p;
    console.log($scope.Lpattern);
    $scope.changepattern('L', p);
  }
  
  $scope.blur = function() { $("input").blur(); }
};
