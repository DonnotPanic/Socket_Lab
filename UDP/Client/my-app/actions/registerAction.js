const dgram = require('dgram');

const registerAction = (client, username, password, port, host) => {
    return new Promise((resolve, reject)=>{
        const registerReq = genRegisterReq(username, password);
        const buff = Buffer.from(JSON.stringify(registerReq));
        client.send(buff, port, host, (err, _)=>{
            if(err) console.log(err);
        });
        client.on("message", (msg, _)=>{
            const registerRes = JSON.parse(msg);
            if ("status" in registerRes) {
                resolve("success");
            } else {
                resolve(registerRes.errinfo);
            }
        })
    }) 
}


const genRegisterReq = (username, password) => {
    return ({
        "method": "register",
        "body": {
            "username": username,
            "password": password
        }
    });
}

module.exports = registerAction;
