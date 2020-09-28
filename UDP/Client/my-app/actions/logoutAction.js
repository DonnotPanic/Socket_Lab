const dgram = require('dgram');

const logoutAction = (client, username, port, host) => {
    return new Promise((resolve,reject)=>{
        const logoutReq = genLogoutReq(username);
        const buff = Buffer.from(JSON.stringify(logoutReq));
        client.send(buff, port, host, (err, _)=>{
            if(err) console.log(err);
        });
        client.on("message", (msg, _)=>{
            const logoutRes = JSON.parse(msg);
            if ("status" in logoutRes) {
                resolve("success");
            } else {
                resolve("failure");
            }
        })
    })
}

const genLogoutReq = (username) => {
    return ({
        "method": "logout",
        "body": {
            "username": username
        }
    });
}

module.exports = logoutAction;