const { resolve } = require('path');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./user.db');

class UserRepository {
    constructor() {
    }

    static init(){
        db.run("CREATE TABLE IF NOT EXISTS  user("
        + "username   TEXT     NOT NULL,"
        + "password   TEXT     NOT NULL)",(err)=>{
            if(err) {
                console.log(err);
            } else {
                console.log("SQLite3: user database connected.");
            }
        });
    }
    static login(user) {
        let promise = new Promise((resolve, reject) => {
            db.get("SELECT password FROM user WHERE username=?", user.username, (err, row)=>{
                if(!err) {
                    resolve(row);
                } else {
                    console.log(err);
                }
            })
        });
        promise.then((value) => {
            return value === user.password;
        })
        return promise;
    }

    static getAllUsers() {
        return new Promise((resolve, reject)=>{
            db.all("SELECT username FROM user", (err, rows)=>{
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

    }

    static register(user) {
        return new Promise((resolve, reject) => {
            db.get("SELECT username FROM user WHERE username = ?", user.username, (err,row) => {
                if(!err) {
                    if (!row) {
                        console.log("new user: " + user.username);
                        db.run("INSERT INTO user VALUES(?, ?)",[user.username, user.password], (err)=>{
                            if(err) console.log(err);
                        })
                        resolve(undefined);
                    }else {
                        console.log("the user name (" + user.username + ") is occupied");
                    }
                } else {
                    console.log(err);
                }
                resolve(row);
            });
        })
    }

    static close() {
        db.close();
    }
};

UserRepository.init();

module.exports = UserRepository;