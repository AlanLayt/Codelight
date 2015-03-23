var app,io,db;
var url = require('url');
var loaded = Array(),
  Hashids = require('hashids'),
  hashids = new Hashids("Twoflower");

var init = function(mapp,mio,mdb){
  app = mapp,
  io = mio,
  db = mdb;

  start();
  console.log('GROUPS: Initialized');
}

var start = function(){

}

var listAll = function(callback){
  console.log('listing all')
	db.groups.listAll(function(groups){
    var ids = [];
  //  console.log(groups)
    groups.forEach(function(g){
      if(g!==false)
        ids.push(g.id);
    })

  	db.snippets.listByGroups(ids,function(snippets){
      //  console.log(snippets);
        groups.forEach(function(g){
          g.snippets = [];
          snippets.forEach(function(s){
          //  console.log(s)
            if(g.id == s.gid){
              g.snippets.push(s);
              }
          });
        });
      //  console.log(groups)
        callback(groups);
    });

  //  console.log(groups)
  });
}

var get = function(gid,callback){
	db.groups.get(gid,function(g){
    if(g!==false){
    	db.snippets.listByGroup(gid,function(snippets){
        console.log(snippets)
        callback(g,snippets);
      });
    }
  });
}

var add = function(group){
	db.groups.count(function(count){
	  var id = hashids.encode(count,Date.now());

    db.groups.add(id, group.title, group.desc, group.user, function(groupid){
      console.log(groupid)
    });
  })
  console.log("Creating group %s", group.title);
}



exports.start = start;
exports.init = init;

exports.add = add;
exports.get = get;
exports.listAll = listAll;