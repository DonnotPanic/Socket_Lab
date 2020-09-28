const dgram = require('dgram');

const postAction = (client, username, date, content) => {
    return new Promise((resolve, reject)=>{
        const postReq = genPostReq(username, date, content);
        const buff = Buffer.from(JSON.stringify(postReq)+"[end]");
        client.write(buff);
        client.on("data", (msg, _)=>{
            let reg = "[end]"
            let regmsgs = new String(msg).split(reg);
            const postRes = JSON.parse(regmsgs[0]);
            console.log("postRes", postRes);
            if ("status" in postRes) {
                resolve("success");
            } else if ("errinfo" in postRes) {
                resolve(postRes.errinfo);
            } else {
                resolve("unknown error");
            }
        })
    })
}

const genPostReq = (username, date, content) => {
    return ({
        "method": "post",
        "body": {
            "username": username,
            "date": date,
            "content": content,
        }
    });
}

module.exports = postAction;