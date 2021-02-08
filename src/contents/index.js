document.addEventListener("DOMContentLoaded", function() {
    console.log("ready!");
    const { ipcRenderer } = require('electron');
    document.getElementById('input-button').addEventListener('click', function () {
        let nome = document.getElementById('input-nome').value;
        let borda = document.getElementById('input-borda').value;
        let mostrar = document.getElementById('input-mostrar').checked;
        ipcRenderer.send('minerva-exec', nome, borda, mostrar);
    });
    ipcRenderer.on('minerva-pong', function (event, arg) {
        console.log(`Ping! Pong! ${arg}`);
    });
    ipcRenderer.on('minerva-resp', function (event, msg) {
        console.log("");
        console.log(`response: ${msg}`);
        document.getElementById('minerva-log').innerHTML = '<p>' + msg.replaceAll(' ', '&nbsp;').split('\n').join('</p>\n<p>') + '</p>';
    });
});