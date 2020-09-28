const dgram = require('dgram');

const postAction = (client, username, date, content, port, host) => {
    return new Promise((resolve, reject)=>{
        const postReq = genPostReq(username, date, content);
        const buff = Buffer.from(JSON.stringify(postReq));
        client.send(buff, port, host, (err, _)=>{
            if(err) console.log(err);
        });
        client.on("message", (msg, _)=>{
            const postRes = JSON.parse(msg);
            console.log("postRes", postRes);
            if ("status" in postRes) {
                resolve("success");
            } else {
                resolve("failure");
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