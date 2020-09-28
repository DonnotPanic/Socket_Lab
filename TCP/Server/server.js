const net = require('net');
const PORT = 45300;
const HOST = '127.0.0.1';
const UserRepository = require('./dao/userRepository');
const MessageRepository = require('./dao/messageRepository');
const { resolve } = require('path');

let onlineClients = new Map();
const server = new net.createServer();

server.on('connection', (conn)=>{
   console.log('客户端已连接');
   const rinfo = conn.address();
   conn.on("data",(msg)=>{
      console.log(`receive message from ${rinfo.address}:${rinfo.port}: ${msg}`);
      handleMessage(msg, conn);
   });
});

server.on('listening', function () {
   let address = server.address();
   console.log('TCP Server listening on <' +
   address.address + ":" + address.port + ">");
})

async function handleMessage (message, socket) {
   let reg = "[end]"
   let regmsgs = new String(message).split(reg);
   const obj = JSON.parse(regmsgs[0]);
   const rinfo = socket.address();
   if (obj.method === "login") {
      handleLogin(obj, socket);
   } else if (obj.method === "register") {
      handleRegister(obj, socket);
   } else {
      let loginfo = onlineClients.get(obj.body.username);
      console.log("loginfo" + JSON.stringify(loginfo)); //在线用户ip与用户名绑定，必须处于登录态。
      if ((loginfo !== undefined) && (rinfo.address === loginfo.address)
         && (rinfo.port === loginfo.port)) {
            if (obj.method === "post") {
               handlePost(obj.body, socket);
            } else if (obj.method === "logout") {
               console.log("User " + obj.body.username + " is trying to log out.");
               handleLogout(obj, socket);
            } else if (obj.method === "get") {
               handleGet(obj.body, socket);
            }
      } else {
         handleError("You should login first.", socket);
      }
   }
}

function handleError(errmsg, socket) {
   const error = {
      "method" : "error",
      "errinfo" : errmsg
   };
   socket.write(Buffer.from(JSON.stringify(error)+"[end]"));
}

async function handleGet(obj, socket) {
   const messages = await MessageRepository.getAllMessagesByUsername(obj.username);
   const getRes = {
      "method" : "get",
      "messages" : messages
   };
   socket.write(Buffer.from(JSON.stringify(getRes)+"[end]"));
}

async function handlePost(obj, socket) {
   const date = obj.date;
   const content = obj.content;
   const username = obj.username;
   const res = await MessageRepository.addMessage(username, date, content);
   const postRes = {
      "method": "post",
      "status": res,
   };
   socket.write(Buffer.from(JSON.stringify(postRes)+"[end]"));
}

async function handleRegister (registerReq, socket) {
   let existedUser = await UserRepository.register(registerReq.body);
   if (existedUser !== undefined){
      handleError("Register failed.", socket);
   } else {
      const registerRes = {
         "method": "register",
         "status": "success" 
      };
      socket.write(Buffer.from(JSON.stringify(registerRes)+"[end]"));
   }
}

function handleLogout(logoutReq, socket) {
   const logoutRes = {
      "method": "logout",
      "status": "success"
   };
   onlineClients.delete(logoutReq.body.username);
   socket.write(Buffer.from(JSON.stringify(logoutRes)+"[end]"));
}

async function handleLogin(loginReq, socket) {
   let isLogedin = await UserRepository.login(loginReq.body);
   const rinfo = socket.address();
   if (isLogedin){
      const loginRes = {
         "method": "login",
         "status": "success"
      };
      socket.write(Buffer.from(JSON.stringify(loginRes)+"[end]"));
      onlineClients.set(loginReq.body.username, rinfo);
   } else {
      handleError("Login failed. Please check your **USERNAME** and **PASSWORD**.", socket);
   }
}

server.on("close", () => {
   UserRepository.close();
   MessageRepository.close();
})

server.listen(PORT,HOST);

setInterval(()=>console.log("当前在线用户 与 IP",onlineClients), 5000);