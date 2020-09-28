const dgram = require('dgram');

const logoutAction = (client, username) => {
    return new Promise((resolve,reject)=>{
        const logoutReq = genLogoutReq(username);
        const buff = Buffer.from(JSON.stringify(logoutReq)+"[end]");
        client.write(buff);
        client.on("data", (msg, _)=>{
            let reg = "[end]"
            let regmsgs = new String(msg).split(reg);
            const logoutRes = JSON.parse(regmsgs[0]);
            if ("status" in logoutRes) {
                resolve("success");
            } else {
                resolve(logoutRes.errinfo);
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