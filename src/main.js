const { app, BrowserWindow } = require("electron");
const ipcMain = require('electron').ipcMain;
const { ipcRenderer } = require('electron');
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 780,
        height: 520,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

run = function (params, callback = null, stdout = null) {
    const { spawn } = require("child_process");

    const ls = spawn("python3", params);
    ls.stdout.setEncoding('latin1');

    msg = "";

    if (stdout == null) {
        ls.stdout.on("data", data => {
            pack = data.toString()
            msg += pack;
            ipcRenderer.send('minerva-resp', pack);
        });
    } else {
        ls.stdout.on("data", data => {
            stdout(data.toString());
        });
    }

    ls.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        msg += data.toString();
    });

    ls.on('error', (error) => {
        console.log(`error: ${error.message}`);
        msg += error.toString();
    });

    ls.on("close", code => {
        console.log(`child process exited with code ${code}`);
        if (callback != null) callback(msg);
    });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('minerva-exec', function (event, params) {
    p = ['C:\\iacon\\dharma-servicos\\tools\\hello_world.py'];

    p.push(params.nome);
    p.push(`borda=${params.borda}`);
    if (params.mostrar) p.push(`--mostrar`);

    run(p, callback = function (msg) {
        event.sender.send('minerva-pong', msg);
    }, stdout = function (msg) {
        event.sender.send('minerva-resp', msg);
    });
});
