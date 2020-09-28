const net = require('net');

const getAction = (client, username) => {
    return new Promise((resolve, reject)=>{
        const getReq = genGetReq(username);
        const buff = Buffer.from(JSON.stringify(getReq)+"[end]");
        client.write(buff);
        client.on("data", (msg)=>{
            let reg = "[end]"
            let regmsgs = new String(msg).split(reg);
            const getRes = JSON.parse(regmsgs[0]);
            if("errinfo" in msg) {
                resolve (getRes.errinfo);
            } else {
                resolve (getRes.messages);
            }
        });
    })
}


const genGetReq = (username) => {
    return ({
        "method": "get",
        "body": {
            "username": username
        }
    });
}

module.exports = getAction;
