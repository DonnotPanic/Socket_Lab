const dgram = require('dgram');

const loginAction = (client, username, password, port, host) => {
    return new Promise((resolve,reject)=>{
        const loginReq = genLoginReq(username, password);
        const buff = Buffer.from(JSON.stringify(loginReq));
        client.send(buff, port, host, (err, _)=>{
            if(err) console.log(err);
        });
        client.on("message", (msg, _)=>{
            const loginRes = JSON.parse(msg);
            if ("status" in loginRes) {
                resolve("success");
            } else {
                resolve("failure");
            }
        })
    }) 
}

const genLoginReq = (username, password) => {
    return ({
        "method": "login",
        "body": {
            "username": username,
            "password": password
        }
    });
}

module.exports = loginAction;
