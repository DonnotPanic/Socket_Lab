const dgram = require('dgram');

const loginAction = (client, username, password) => {
    return new Promise((resolve,reject)=>{
        const loginReq = genLoginReq(username, password);
        const buff = Buffer.from(JSON.stringify(loginReq)+"[end]");
        client.write(buff);
        client.on("data", (msg, _)=>{
            let reg = "[end]"
            let regmsgs = new String(msg).split(reg);
            const loginRes = JSON.parse(regmsgs[0]);
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
