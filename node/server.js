
var http = require('http');
var uuid = require('node-uuid');
var users = {};
var rooms=[];
var app = http.createServer(function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'}); // responding to the connection request with status code 200 (success)
        response.write("connected "); // giving a response to conected client
        response.end();
    
}).listen(1555); // setting the port to which this application have to listen

var io = require('socket.io').listen(app); // creating a socket server
    // io.sockets.on('disconnect', function(arg) {
    //     console.log(arg);
    // });
    io.sockets.on('connection', function(socket) {

        socket.on('join',function(data){
            var uid = uuid.v1();
            var myData={name:data.name};
            users[socket.id]=myData;
                io.sockets.emit("chatroom",{rooms:rooms});
        });

        socket.on('createRoom',function(data){
            var roomId=uuid.v1();
            var room={name:data.name,id:roomId,owner:socket.id};
            rooms.push(room);
            io.sockets.emit("msg"+socket.id,{type:'roomCreate',id:roomId});
            io.sockets.emit("chatroom",{rooms:rooms});
        });


        socket.on('chat',function(data){
            io.sockets.emit("chat"+data.roomId,{msg:data.msg,from:users[socket.id].name,userId:socket.id});
        });

    });