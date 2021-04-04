const express = require('express');
const socket = require('socket.io');

const { Board, Proximity, Servo } = require('johnny-five');
const board = new Board();

const port = 3000;
const app = express();
app.use(express.static('app'));
const server = app.listen(port, () => {
  console.log(`listenig on port: ${port}`);
});

const io = socket(server);
io.on('connection', (socket) => {
  console.log(`user connected, socket id: ${socket.id}`);
  board.on('ready', () => {
    console.log('board is ready');

    const servo = new Servo({
      pin: 4,
      center: true,
    });
    socket.on('kot', (data) => {
      servo.to(data.value);
    });
    const proximity = new Proximity({
      controller: 'HCSR04',
      pin: 3,
    });

    proximity.on('change', () => {
      const { centimeters } = proximity;

      io.sockets.emit('razdalja', { value: centimeters });
    });
  });
});
