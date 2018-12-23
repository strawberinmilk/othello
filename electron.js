'use strict';

const {app, BrowserWindow, Menu} = require('electron');
const windowStateKeeper = require('electron-window-state');
const aboutWindow = require('about-window');
// const autoUpdater = require('electron-updater').autoUpdater;
const open = require('open');
const fp = require('find-free-port');
const http = require('http');
const socketIO = require('socket.io');
const file = require('node-static');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const ngrok = require('ngrok');

const ui = new file.Server(__dirname);
const ids = {
  white: uuidv5(uuidv4(), uuidv1()),
  black: uuidv5(uuidv4(), uuidv1())
};
let idToColor = {};
for (let color in ids) idToColor[ids[color]] = color;
let colorToSocket = {white: {}, black: {}};

let mainWindow = null;
app.on('ready', ()=>{
  const template = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    });

    // Edit menu
    template[1].submenu.push(
      {type: 'separator'},
      {
        label: 'Speech',
        submenu: [
          {role: 'startspeaking'},
          {role: 'stopspeaking'}
        ]
      }
    );

    // Window menu
    template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  fp(3000, 9000, (e, freePort) => {
    if (e) throw new Error();

      const server = http.createServer((req, res) => {
        req.addListener('end', () => ui.serve(req, res)).resume();
      }).listen(freePort, 'localhost', () => {

        (async () => {
          const url = await ngrok.connect(freePort);
          open(`${url}?id=${ids.white}`);
        })();

        const state = windowStateKeeper({
          defaultWidth: 450,
          defaultHeight: 450
        });

        mainWindow = new BrowserWindow({
          width: state.width,
          height: state.height,
          x: state.x,
          y: state.y,
          webPreferences: { nodeIntegration: false },
          frame: false
        });

        state.manage(mainWindow);

        mainWindow.loadURL(`http://localhost:${freePort}?id=${ids.black}`);
        mainWindow.on('closed', ()=>{ mainWindow = null; });
        // mainWindow.webContents.openDevTools();
      });

      const io = socketIO.listen(server);

      io.sockets.on('connection', socket => {
        socket.on('idToColor', (id, fn) => {
          colorToSocket[idToColor[id]] = socket;
          fn(idToColor[id]);
        });

        /*
        socket.on('subClient', (data, fn) => {
          fn(Object.keys(colorToSocket.black) !== 0 && Object.keys(colorToSocket.white) !== 0);
        });
        */

        socket.on('reverse', data => {
          colorToSocket[(idToColor[data.id] === 'white') ? 'black' : 'white'].emit('reversed', data.s);
        });
      });
  });
});
