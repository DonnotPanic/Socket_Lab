const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./user.db');

class MessageRepository{
    constructor(){
    }

    static init(){
        db.run("CREATE TABLE IF NOT EXISTS  message("
        + "username   TEXT     NOT NULL,"
        + "uploadtime DATE     NOT NULL,"
        + "content    TEXT     NOT NULL)",(err)=>{
            if(err) {
                console.log(err);
            } else {
                console.log("SQLite3: user database connected.");
            }
        });
    }

    static getAllMessagesByUsername(username) {
        return new Promise((resolve, reject)=>{
            db.all("SELECT uploadtime, content FROM message WHERE username=? ORDER BY uploadtime DESC", username, (err, rows)=>{
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static addMessage(username, date, message) {
        return new Promise((resolve,reject)=>{
            console.log("recieved a message from " ,username, " in ", date);
            db.run("INSERT INTO message VALUES(?, ?, ?)",[username, date, message], (err)=>{
                if(err) {
                    console.log("addmessage",err);
                    resolve(err);
                } else {
                    resolve("success");
                }
            })
        })
    }

    static close() {
        db.close();
    }
}

MessageRepository.init();

module.exports = MessageRepository;