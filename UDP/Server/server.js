const dgram = require('dgram');
const PORT = 34500;
const HOST = '127.0.0.1';
const UserRepository = require('./dao/userRepository');
const MessageRepository = require('./dao/messageRepository')

let onlineClients = new Map();
const server = new dgram.createSocket('udp4');

server.on('listening', function () {
   let address = server.address();
   console.log('UDP Server listening on <' +
   address.address + ":" + address.port + ">");
})

server.on('message', async (message, rinfo) => {
   console.log(`receive message from ${rinfo.address}:${rinfo.port}: ${message}`);
   handleMessage(message, rinfo);
});

async function handleMessage (message, rinfo) {
   const obj = JSON.parse(message);
   if (obj.method === "login") {
      handleLogin(obj, rinfo);
   } else if (obj.method === "register") {
      handleRegister(obj, rinfo);
   } else {
      let loginfo = onlineClients.get(obj.body.username);
      console.log("loginfo" + JSON.stringify(loginfo)); //在线用户ip与用户名绑定，必须处于登录态。
      if ((loginfo !== undefined) && (rinfo.address === loginfo.address)
         && (rinfo.port === loginfo.port)) {
            if (obj.method === "post") {
               handlePost(obj.body, rinfo);
            } else if (obj.method === "logout") {
               console.log("User " + obj.body.username + " is trying to log out.");
               handleLogout(obj, rinfo);
            } else if (obj.method === "get") {
               handleGet(obj.body, rinfo);
            }
      } else {
         handleError("You should login first.", rinfo);
      }
   }
}


function handleError(errmsg, rinfo) {
   const error = {
      "method" : "error",
      "errinfo" : errmsg
   };
   server.send(Buffer.from(JSON.stringify(error)), rinfo.port, rinfo.address, (err)=>console.log(err));
}

async function handleGet(obj, rinfo) {
   const messages = await MessageRepository.getAllMessagesByUsername(obj.username);
   const getRes = {
      "method" : "get",
      "messages" : messages
   };
   server.send(Buffer.from(JSON.stringify(getRes)), rinfo.port, rinfo.address, (err)=>console.log(err));
}

async function handlePost(obj, rinfo) {
   const date = obj.date;
   const content = obj.content;
   const username = obj.username;
   const res = await MessageRepository.addMessage(username, date, content);
   const postRes = {
      "method": "post",
      "status": res,
   };
   server.send(Buffer.from(JSON.stringify(postRes)), rinfo.port, rinfo.address, (err)=>console.log(err));
}

async function handleRegister (registerReq, rinfo) {
   let existedUser = await UserRepository.register(registerReq.body);
   if (existedUser !== undefined){
      handleError("Register failed.", rinfo);
   } else {
      const registerRes = {
         "method": "register",
         "status": "success" 
      };
      server.send(Buffer.from(JSON.stringify(registerRes)), rinfo.port, rinfo.address, (err)=>console.log(err));
   }
}

function handleLogout(logoutReq, rinfo) {
   const logoutRes = {
      "method": "logout",
      "status": "success"
   };
   onlineClients.delete(logoutReq.body.username);
   server.send(Buffer.from(JSON.stringify(logoutRes)), rinfo.port, rinfo.address, (err)=>console.log(err));
}

async function handleLogin(loginReq, rinfo) {
   let isLogedin = await UserRepository.login(loginReq.body);
   if (isLogedin){
      const loginRes = {
         "method": "login",
         "status": "success"
      };
      server.send(Buffer.from(JSON.stringify(loginRes)), rinfo.port, rinfo.address, (err)=>console.log(err));
      onlineClients.set(loginReq.body.username, rinfo);
   } else {
      handleError("Login failed. Please check your **USERNAME** and **PASSWORD**.", rinfo);
   }
}

server.on("close", () => {
   UserRepository.close();
})

server.bind(PORT,HOST);

setInterval(()=>console.log(onlineClients), 5000);