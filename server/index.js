const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const PORT = 3333;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

const io = socketIO(server);

let arrMsg = [];
let userCount = 0;

// membuat property ke dalam app express
app.io = io;
app.arrMsg = arrMsg;

app.get('/', (req, res) => {
  res.status(200).send(`<h1>Selamat datang di chat API</h1>`);
});

let user = [];

io.on('connection', (socket) => {
  userCount += 1;
  // emit untuk mengirim pesan yang diarahkan sesuai eventKey (user connected)

  socket.on('JoinChat', (data) => {
    user.push({ userId: socket.id, nama: data.nama });
    io.emit('user connected', user.length);
    console.log('Check User ==>', user);
  });

  socket.on('disconnect', () => {
    // userCount--;
    io.emit('user connected', userCount);
  });
});

const { chatRouter } = require('./routers');

app.use('/chat', chatRouter);

server.listen(PORT, () => {
  console.log(`Server running in PORT ${PORT}`);
});
