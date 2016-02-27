var fs=require("fs"),async=require("async"),npmlog=require("npmlog"),util=require("util"),luna=require("./luna"),path=require("path"),streamBuffers=require("stream-buffers"),os=require("os"),mkdirp=require("mkdirp"),fstream=require("fstream"),spawn=require("child_process").spawn,novacom=require("./novacom"),commonTools=require("./common-tools"),novacomUsb=require("./novacom-usb");
(function(){var q=npmlog;q.heading="pull";q.level="warn";var D={pull:function(l,f){function x(h,c){q.verbose("Pull","err: ",h,"result:",c);if(!h){y=(new Date).getTime();var a=(y-z)/1E3;console.log(n+" file(s) pulled");console.log(Math.round(k/(1024*a))+" KB/s ("+k+" bytes in "+a+"s)")}return setImmediate(f,h,c)}if("function"!==typeof f)throw Error("Missing completion callback (next="+util.inspect(f)+")");var p,n=0,k=0,z=(new Date).getTime(),y=(new Date).getTime(),b=l.sourcePath,a=l.destinationPath,
u=!1,r=novacomUsb.getNovacomPath(),A=new streamBuffers.WritableStreamBuffer,B=new streamBuffers.WritableStreamBuffer,C=new streamBuffers.WritableStreamBuffer,v=new streamBuffers.WritableStreamBuffer,w=[];commonTools.appdata.compareProfile("watch",function(a,c){u=c});String.prototype.replaceAll=function(a,c,b){var d=this+"",e=-1;if("string"===typeof a)if(b)for(a.toLowerCase();-1!==(e=d.toLowerCase().indexOf(a,0<=e?e+c.length:0));)d=d.substring(0,e)+c+d.substring(e+a.length);else return this.split(a).join(c);
return d};async.waterfall([function(a){var c=new novacom.Resolver;async.waterfall([c.load.bind(c)],function(){var b=c.devices,d;for(d in b)if(b[d].name==l.device){p=b[d].id;break}setImmediate(a)})},function(a){new novacom.Session(l.device,a)},function(h,c){q.info("pull#transferFiles():","sourcePath "+b,"destinationPath "+a);try{var f=b,d=b.length;b=b.replaceAll(" ","\\ ");var e="[ -f "+b+" ] && echo 'f' || echo 'nf'";h.run(e,null,A,null,function(){console.log("Copying data ....");z=(new Date).getTime();
if("f\n"==A.getContentsAsString()){var m;fs.exists(a,function(d){d&&(stats=fs.lstatSync(a),stats.isDirectory()&&(a=a+path.sep+path.basename(f)));if(u){m=p?spawn(r,["get","file://"+b,"-d",p]):spawn(r,["get","file://"+b]);n++;var s=fs.createWriteStream(a,{encoding:"binary"});m.stdout.on("data",function(a){s.write(a)});m.stdin.end();m.stderr.on("data",function(a){setImmediate(c,a)});m.on("exit",function(d){s.end();a=a.replaceAll("\\\\","\\");a=a.replaceAll("//","/");l.ignore||console.log("Pull: "+b+
" -> "+a);stat=fs.lstatSync(a);k+=stat.size;setImmediate(c)})}else h.get(b,a,function(d){if(d)return setImmediate(c,d);l.ignore||console.log("Pull: "+b+" -> "+a);stat=fs.lstatSync(a);n++;k+=stat.size;setImmediate(c)})})}else e="[ -d "+b+" ] && echo 'd' || echo 'nd'",h.run(e,null,B,null,function(){if("d\n"==B.getContentsAsString())fs.existsSync(a)||fs.mkdirSync(a),async.waterfall([function(c){e="find "+b+" -type d -follow -print";h.run(e,null,C,null,function(){var b=C.getContentsAsString().split("\n");
async.eachSeries(b,function(c,b){var s=path.join(a,c.substring(d));mkdirp(s,function(a){setImmediate(b)})},function(a){setImmediate(c,a)})})},function(c){e="find "+b+" -type f -follow -print";h.run(e,null,v,null,function(){if(0==v.size())return setImmediate(c);w=v.getContentsAsString().split("\n");w.pop();async.eachSeries(w,function(b,e){if(u){var f;f=p?spawn(r,["get","file://"+b.replaceAll(" ","\\ "),"-d",p]):spawn(r,["get","file://"+b.replaceAll(" ","\\ ")]);n++;var g=path.join(a,b.substring(d)),
m=fs.createWriteStream(g,{encoding:"binary"});f.stdout.on("data",function(a){m.write(a)});f.stdin.end();f.stderr.on("data",function(a){setImmediate(c,a)});f.on("exit",function(a){m.end();g=g.replaceAll("\\\\","\\");g=g.replaceAll("//","/");l.ignore||console.log("Pull: "+b+" -> "+g);stat=fs.lstatSync(g);k+=stat.size;setImmediate(e)})}else{var g=path.join(a,b.substring(d));h.get(b.replaceAll(" ","\\ "),g,function(a){if(a)return setImmediate(c,a);l.ignore||console.log("Pull: "+b+" -> "+g);n++;stat=fs.lstatSync(g);
k+=stat.size;setImmediate(e)})}},function(a){setImmediate(c,a)})})}],function(a,b){setImmediate(c,a,b)});else return setImmediate(c,Error("Source does not exist."))})})}catch(t){1==t.code&&(t=Error("Wrong path: "+t)),x(t)}}],function(a,b){x(a,b)})}};"undefined"!==typeof module&&module.exports&&(module.exports=D)})();