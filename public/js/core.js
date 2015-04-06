var snid,app=angular.module("CodeLight",[]),port=80;window.addEventListener("DOMContentLoaded",function(){var a=document.getElementById("editor");null!==a&&(snid=a.getAttribute("snid"));var b=document.getElementById("Search");if(null!==b)for(var c=document.getElementsByClassName("searchCodeDisplay"),d=0;d<c.length;d++){console.log(c[d]);var e=ace.edit(c[d]);e.setTheme("ace/theme/monokai"),e.renderer.setShowGutter(!1),e.getSession().setMode("ace/mode/javascript")}},!1),app.controller("activeUsers",["$scope","$http","socket","editor","auth",function(a,b,c,d,e){var f=["587D59","F9D189","AF734C","88C843","FA347B"],g=document.getElementById("editor").getAttribute("snid");console.log(g);var h=[];e.connect(function(){c.emit("requestSnip",{snid:g})}),c.on("cursorMove",function(b){console.debug("Incoming cursor: %s",b.user.username),k(b.user.username)||a.addUser(b.user),console.debug(b);var c=document.getElementById("cursorHold");c.innerHTML="";d.renderer.textToScreenCoordinates(b.position.row,b.position.column),Array("B8006D","FF774C","3DA7D5");b.socketid in h?(h[b.socketid].position.row=b.position.row,h[b.socketid].position.column=b.position.column):(h[b.socketid]=b,Object.keys(a.users).forEach(function(c){b.user.username==a.users[c].username&&(color=a.users[c].color)}),h[b.socketid].colour=color),Object.keys(h).forEach(function(a){var b=d.renderer.textToScreenCoordinates(h[a].position.row,h[a].position.column),e=document.createElement("div");e.id="::img";e.style.cssText="position:absolute;top:"+b.pageY+"px;left:"+b.pageX+"px;width:0px;height:15px;border-left:3px  solid #"+h[a].colour+";-moz-box-shadow: 0px 0px 8px  #fff; display:"+(i?"block":"none")+";",h[a].el=e,c.appendChild(e)})});var i=!1;console.log(h);var j=function(){i=i?!1:!0;window.setTimeout(j,800);Object.keys(h).forEach(function(a){h[a].el.style.display=i?"block":"none"})};j(),d.selection.on("changeCursor",function(){var a=d.selection.getCursor();a.snid=g,c.emit("cursorMove",a)});var k=function(b){var c=!1;return a.users.forEach(function(a){a.username==b&&(c=!0)}),c};a.users=[],a.addUser=function(b){a.users.push({username:b.username,icon:b.icon,color:f[Math.floor(Math.random()*f.length)],done:!1})}}]),app.controller("ide",["$scope","$http","socket","editor",function(a,b,c,d){console.log("Development environment online.");{var e;Array()}console.debug(c);var f=new Preview("display");f.update(d.getValue()),c.on("insert",function(a){e=a,d.session.insert(a.range.start,a.text),f.update(d.getValue())}),c.on("remove",function(a){e=a,d.session.remove(a.range),f.update(d.getValue())}),c.on("disconnect",function(){c.disconnect(),console.debug("Connection Lost. Reloading.");window.setTimeout(function(){location.reload()},1e3)}),c.on("loadSnip",function(a){d.setValue(a.snippet.content)}),d.on("change",function(a){d.getValue();if(console.debug(e),"undefined"!==e||e===!1||a.data.text!=e.text||a.data.range.start.column!=e.range.start.column||a.data.range.start.row!=e.range.start.row){var b=a.data;switch(b.full=d.getValue(),b.snid=snid,a.data.action){case"insertText":c.emit("insert",b);break;case"removeText":c.emit("remove",b)}f.update(d.getValue()),f.resetTicker()}}),document.addEventListener("keydown",function(a){if((window.navigator.platform.match("Mac")?a.metaKey:a.ctrlKey)&&83==a.keyCode){a.preventDefault(),console.debug("Saving.");{document.getElementById("details")}c.emit("save",{snid:snid,content:d.getValue()})}},!1)}]),app.controller("display",["$scope","$http","auth",function(a,b,c){a.editForm={},c.connect(function(){console.debug(c.getUser())});var d=document.getElementById("Display");null!==d&&(snid=d.getAttribute("snid")),a.edit=function(){console.log("Opening edit"),a.editing=!0},a.submit=function(){console.log("Modifying %s",snid),b.post("http://"+window.location.hostname+":"+port+"/snippet/update",{snid:snid,title:a.editForm.title,desc:a.editForm.description}).success(function(){console.log("Details updated"),a.editing=!1;window.setTimeout(function(){location.reload()},1)})},console.log('Displaying "%s".',snid)}]),app.factory("auth",["$http","socket",function(a,b){var c=null,d=null;return{connect:function(e){b.on("AUTH:Connected",function(){console.log("SOCKET: Connection Success."),a.get("http://"+window.location.hostname+":"+port+"/auth/key").success(function(a){console.log("SOCKET: Token retrieved."),b.emit("AUTH:Key",{token:a.token})})}),b.on("AUTH:Verified",function(a){console.log("SOCKET: Verified as %s.",a.user.username),c=a.user,d=!0,e(null,c)}),b.on("AUTH:Denied",function(){console.log("SOCKET: Unverified."),d=!1,e({logged:!1},null)}),b.on("disconnect",function(){b.disconnect(),console.debug("Connection Lost. Reloading.");window.setTimeout(function(){location.reload()},1e3)})},getUser:function(){return c}}}]),app.factory("socket",function(a){var b=io(window.location.host,{reconnection:!1});return window.socket=b,console.log("Initializing socket for angular"),{on:function(c,d){b.on(c,function(){var c=arguments;a.$apply(function(){d.apply(b,c)})})},emit:function(c,d,e){b.emit(c,d,function(){var c=arguments;a.$apply(function(){e&&e.apply(b,c)})})},disconnect:function(c){b.disconnect(function(){var d=arguments;a.$apply(function(){c&&c.apply(b,d)})})}}}),app.factory("editor",function(a){ace.require("ace/ext/language_tools");var b=ace.edit("editor");return b.session.setMode("ace/mode/html"),b.setTheme("ace/theme/dreamweaver"),b.setOptions({enableBasicAutocompletion:!0,enableSnippets:!0,enableLiveAutocompletion:!1}),console.log("Initializing Ace editor."),{getValue:function(){return b.getValue()},on:function(c,d){b.on(c,function(){var b=arguments;a.$apply(function(){d&&d.apply(socket,b)})})},session:{insert:function(a,c){b.session.insert(a,c)},remove:function(a){b.session.getDocument().remove(a)}},selection:{on:function(c,d){b.selection.on(c,function(){var b=arguments;a.$apply(function(){d&&d.apply(socket,b)})})},getCursor:function(){return b.selection.getCursor()}},renderer:{textToScreenCoordinates:function(a,c){return b.renderer.textToScreenCoordinates(a,c)}}}}),app.directive("contenteditable",function(){return{require:"ngModel",link:function(a,b,c,d){function e(){d.$setViewValue(b.html())}d.$render=function(){b.html(d.$viewValue||"")},b.bind("blur keyup change",function(){a.$apply(e)})}}});var Preview=function(a){this.el=document.getElementById(a),this.content="",this.ut=0,this.tickStep=100,this.updateTimeout=300,this.running=!0,this.update=function(a){this.content=a},this.refresh=function(){this.el.src="data:text/html;charset=utf-8,"+escape(this.content)},this.tick=function(a,b){a.ut<a.updateTimeout||!a.running?a.ut+=a.tickStep:(a.running=!1,a.ut=0,b(),a.refresh());setTimeout(a.tick,a.tickStep,a,b)},this.resetTicker=function(){this.ut=0,this.running=!0},this.tick(this,function(){})};