const dgram = require('dgram');

const getAction = (client, username, port, host) => {
    return new Promise((resolve, reject)=>{
        const getReq = genGetReq(username);
        const buff = Buffer.from(JSON.stringify(getReq));
        client.send(buff, port, host, (err, _)=>{
            if(err) console.log(err);
        });
        client.on("message", (msg, _)=>{
            const getRes = JSON.parse(msg);
            resolve (getRes.messages);
        })
    }) 
}


const genGetReq = (username) => {
    return ({
        "method": "get",
        "body": {
            "username": username,
        }
    });
}

module.exports = getAction;
