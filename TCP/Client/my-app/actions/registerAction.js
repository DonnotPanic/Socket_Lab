const dgram = require('dgram');

const registerAction = (client, username, password) => {
    return new Promise((resolve, reject)=>{
        const registerReq = genRegisterReq(username, password);
        const buff = Buffer.from(JSON.stringify(registerReq)+"[end]");
        client.write(buff);
        client.on("data", (msg, _)=>{
            let reg = "[end]"
            let regmsgs = new String(msg).split(reg);
            const registerRes = JSON.parse(regmsgs[0]);
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
