let dgram = require('dgram')

const PORT = 34500;
const HOST = '127.0.0.1';

const loginRequest = {
    "method": "login",
    "body": {
        "username": "chronicat",
        "password": "meow"
    }
}

const registerRequest = {
    "method": "register",
    "body": {
        "username": "chronicat",
        "password": "meow"
    }
}

const logoutRequest = {
    "method": "logout",
    "body": {
        "username": "chronicat"
    }
}

const loginMessage = Buffer.from(JSON.stringify(loginRequest));
const registerMessage = Buffer.from(JSON.stringify(registerRequest));
const logoutMessage = Buffer.from(JSON.stringify(logoutRequest));

let client = dgram.createSocket('udp4');

client.send(registerMessage, PORT, HOST, (err)=> {
    if (err) {
        console.log(err);
    }
    console.log('UDP message sent to ' + HOST + ':' + PORT);
    client.send(loginMessage, PORT, HOST, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
        setTimeout(() => {
            client.send(logoutMessage, PORT, HOST ,(err) => {
                if (err) console.log(err);
                console.log("trying to log out.");
                client.close();
            });
        }, 1000);
    });
})

client.on("message", (message, rinfo) => {
    console.log("<" + rinfo.address + ":" + rinfo.port + "> :\"" + message + "\"");
    handleMessage(message, rinfo);
})

function handleMessage(message, rinfo) {
    const obj = JSON.parse(message);
    if (obj.method === "login") {
        handleLogin(obj);
    } else if (obj.method === "register") {
        handleRegister(obj);
    }else if (obj.method === "logout") {
        handleLogout(obj);
    }else if (obj.method === "broadcast") {
        handleBroadcast(obj);
    }else if (obj.method === "error") {
        handleError(obj);
    }
}

function handleRegister(registerRes) {
    if ("status" in registerRes) {
        console.log("Register successfully.");
    }
}

function handleLogin(loginRes) {
    if ("status" in loginRes) {
        console.log("Login successfully.");
    }
}

function handleLogout(logoutRes) {
    if ("status" in logoutRes) {
        console.log("Logout successfully.");
        client.close();
    }
}
function handleError(error) {
    console.log(error.errmsg);
}

function sendABroadcast(info, rinfo) {
}