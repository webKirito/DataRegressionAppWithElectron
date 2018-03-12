const electron = require("electron");
const {app, BrowserWindow} = electron;



app.on("ready", () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600
    });
    // win.setMenu(null);
    win.loadURL(`file://${__dirname}/views/homePage/index.html`);

});

exports.openWindow = (fileName) => {
    let win = new BrowserWindow({
        width: 800,
        height: 600
    });
    // win.setMenu(null);
    win.loadURL(`file://${__dirname}/views/${fileName}/` + fileName + ".html");
}