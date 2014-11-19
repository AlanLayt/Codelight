console.debug(window.location.host);
var socket = io(window.location.host,{ reconnection : false });
var cursors = Array();


var Preview = function(element){
  this.foo = "bar";
  this.el = document.getElementById(element);
  this.cntnt = "";
  this.ut = 0;
  this.tickStep = 100;
  this.updateTimeout = 300;
  this.running = true;

  var get = function(){
    return this.foo;
  }

  var update = function(val){
    this.cntnt = val;
  }
  var refresh = function(){
    this.el.src = "data:text/html;charset=utf-8,"+escape(this.cntnt);
  }

  var tickStart = function(callback){
    tick(this,callback);
  }

  var tick = function(ts,callback){
    ts.ut+=ts.tickStep;
    if(ts.ut>ts.updateTimeout && ts.running){
      ts.running = false;
      ts.ut=0;
      callback();
      ts.refresh();
    }
  //  console.debug("Tick" + ts.ut);
    this.ticker = setTimeout(tick,ts.tickStep,ts,callback);
  }
  var delay = function(){
    this.ut=0;
    this.running = true;
  }


  this.get = get;
  this.update = update;
  this.tickStart = tickStart;
  this.delay = delay;
  this.refresh = refresh;
}







var ide = function(snid){
  var preview = new Preview('display');
  console.debug(preview.get());
  preview.tickStart(function(){
  //  console.debug("Refresh");
  });


  // Ace Initialization
  var lastUpdate = false;
  ace.require("ace/ext/language_tools");
  var editor = ace.edit("editor");
  editor.session.setMode("ace/mode/html");
  editor.setTheme("ace/theme/monokai");

  editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: false
  });

  preview.update(editor.getValue());


  console.debug(editor.selection);
  editor.selection.on('changeCursor',function(){
    var pos = editor.selection.getCursor();
    pos.snid = snid;
    socket.emit('cursorMove',pos);
    console.debug(editor.renderer.textToScreenCoordinates(pos.row,pos.column));
    console.debug(editor.selection.getCursor());//textToScreenCoordinates
  });

  socket.on('cursorMove', function (data) {
    var curhold = document.getElementById("cursorHold");
    curhold.innerHTML = '';
    var pos = editor.renderer.textToScreenCoordinates(data.row,data.column);
    console.debug("Incoming cursor:");
    console.debug(editor.renderer.textToScreenCoordinates(data.row,data.column));
    var colours = Array('B8006D','FF774C','3DA7D5');

    if(data.socketid in cursors){
      cursors[data.socketid].row = data.row;
      cursors[data.socketid].column = data.column;
    }
    else {
      cursors[data.socketid] = data;
      cursors[data.socketid].colour = colours[Math.floor(Math.random()*3)];
    }

  console.debug(cursors)
    Object.keys(cursors).forEach(function(key){
      var pos = editor.renderer.textToScreenCoordinates(cursors[key].row,cursors[key].column);
      var obj = document.createElement('div');
      obj.id = "::img";
      obj.style.cssText = 'position:absolute;top:' + pos.pageY + 'px;left:' + pos.pageX + 'px;width:0px;height:15px;border-left:3px  solid #'+cursors[key].colour+';-moz-box-shadow: 0px 0px 8px  #fff;';

      curhold.appendChild(obj);
    });
  });

document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
    e.preventDefault();
    console.debug('Saving.');

    socket.emit('save', { snid : snid, content : editor.getValue() });

  }
}, false);


  // Editor events

	editor.on("change", function(e){
    var content = editor.getValue();

    if( lastUpdate===false
        || (e.data.text != lastUpdate.text
        || e.data.range.start.column != lastUpdate.range.start.column
        || e.data.range.start.row != lastUpdate.range.start.row )){

      var data = e.data;
      data.full = editor.getValue();
      data.snid = snid;

      switch(e.data.action){
        case 'insertText':
          socket.emit('insert', data);
          break;
        case 'removeText':
          socket.emit('remove', data);
          break;
      }
      preview.update(editor.getValue());
      preview.delay();
    }
	});






  // Socket events

  socket.on('insert', function (data) {
    lastUpdate = data;
    // Removed .getDocument() from before insert. May have broken things?
    editor.session.insert(data.range.start,data.text);
    preview.update(editor.getValue());
  });

  socket.on('remove', function (data) {
    lastUpdate = data;
    editor.session.getDocument().remove(data.range);
    preview.update(editor.getValue());
  });

  socket.on('disconnect', function () {
    socket.disconnect();
    console.debug("Connection Lost. Reloading.");
    location.reload();
  });

  socket.on('loadSnip', function (data) {
    // document.getElementById("editor").textContent = data.content;
  //  console.log(data.snippet.content)
    editor.setValue(data.snippet.content);
  });

}



document.addEventListener("DOMContentLoaded", function(event) {
    var snid = document.getElementById('editor').getAttribute('snid');
    socket.on('connectionConfirmed', function (data) {
      socket.emit('requestSnip', {snid : snid});
      console.debug("Connected");
      ide(snid);
    });
});
