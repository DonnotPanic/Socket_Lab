const {app, BrowserWindow} = require('electron');
const url = require('url');
const {ipcMain} = require('electron');
const dgram = require('dgram');
const loginAction = require('./actions/loginAction');
const registerAction = require('./actions/registerAction');
const logoutAction = require('./actions/logoutAction');
const postAction = require('./actions/postAction');
const getAction = require('./actions/getAction')

let mainWindow;
let client;

const PORT = 34500;
const ADDR = '127.0.0.1';

function createSocket(){
    client = dgram.createSocket('udp4');
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    mainWindow.loadURL('http://localhost:3000/#/');
    mainWindow.webContents.openDevTools()
    mainWindow.on("close", ()=>{
        mainWindow = null;
    });
};

function onListen() {
    ipcMain.on("registerReq", async (event, args) => {
        let res = await registerAction(client, args[0], args[1], PORT, ADDR);
        event.sender.send("registerRes", res);
    });
    ipcMain.on("loginReq", async (event, args) => {
        let res = await loginAction(client, args[0], args[1], PORT, ADDR);
        event.sender.send("loginRes", res);
    });
    ipcMain.on("logoutReq", async (event, args) => {
        let res = await logoutAction(client, args, PORT, ADDR);
        event.sender.send("logoutRes", res);
    });
    ipcMain.on("postReq", async (event, args) => {
        let res = await postAction(client, args[0], args[1], args[2], PORT, ADDR);
        event.sender.send("postRes", res);
    });
    ipcMain.on("getReq", async (event, args) => {
        let res = await getAction(client, args, PORT, ADDR);
        event.sender.send("getRes", res);
    });
}

function init(){
    createSocket();
    createWindow();
    onListen();
}

app.on("ready", init);
app.on("window-all-closed", ()=>{
    ipcMain.removeAllListeners();
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', ()=>{
    if (mainWindow == null) {
        init();
    }
});
