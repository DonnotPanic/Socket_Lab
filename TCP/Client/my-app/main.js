const {app, BrowserWindow} = require('electron');
const url = require('url');
const {ipcMain} = require('electron');
const net = require('net');
const loginAction = require('./actions/loginAction');
const registerAction = require('./actions/registerAction');
const logoutAction = require('./actions/logoutAction');
const postAction = require('./actions/postAction');
const getAction = require('./actions/getAction')

let mainWindow;
let client;

const PORT = 45300;
const ADDR = '127.0.0.1';

function createConnction(){
    client = new net.Socket();
    client.connect(PORT, ADDR);
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
        let res = await registerAction(client, args[0], args[1]);
        event.sender.send("registerRes", res);
    });
    ipcMain.on("loginReq", async (event, args) => {
        let res = await loginAction(client, args[0], args[1]);
        event.sender.send("loginRes", res);
    });
    ipcMain.on("logoutReq", async (event, args) => {
        let res = await logoutAction(client, args);
        event.sender.send("logoutRes", res);
    });
    ipcMain.on("postReq", async (event, args) => {
        let res = await postAction(client, args[0], args[1], args[2]);
        event.sender.send("postRes", res);
    });
    ipcMain.on("getReq", async (event, args) => {
        let res = await getAction(client, args);
        event.sender.send("getRes", res);
    });
}

function init(){
    createConnction();
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
