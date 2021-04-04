let objects = [];
let l;
let distance;
let timeOut = 0.5;

const socket = io();

function setup() {
  angleMode(DEGREES);
  createCanvas(400, 400);
  l = new Line(150, 0);
}

function draw() {
  background(0, 0, 0, 63);
  let angle = round(sin(frameCount) * 90 + 90);
  socket.emit('kot', { value: angle });

  if (timeOut <= 0.0) {
    let o = new Point(distance, angle);
    objects.push(o);
    timeOut = 0.5;
  }
  for (let i = 0; i < objects.length; i++) {
    objects[i].draw();
    if (objects[i].isDead()) {
      objects.splice(i, 1);
    }
  }
  drawCircles();
  drawLines();
  l.draw();
  l.rotate(angle);
  timeOut -= 0.1;
}

socket.on('razdalja', (data) => {
  distance = round(map(data.value, 0, 300, 0, 150));
});

function drawCircles() {
  noFill();
  stroke(0, 255, 0);
  circle(width / 2, height / 2, 300);
  circle(width / 2, height / 2, 200);
  circle(width / 2, height / 2, 100);
}

function drawLines() {
  push();
  translate(width / 2, height / 2);
  for (let i = 0; i < 12; i++) {
    fill(255, 255, 255);
    noStroke();
    textAlign(CENTER);
    text(i * 30 + '°', 0, -155);
    stroke(0, 255, 0);
    line(0, 0, 0, -150);
    rotate(30);
  }
  pop();
}

class Point {
  constructor(r, theta) {
    this.r = r;
    this.theta = theta;
    this.dx = this.r * cos(-this.theta);
    this.dy = this.r * sin(-this.theta);
    this.alpha = 255;
  }

  draw() {
    push();
    translate(width / 2, height / 2);
    stroke(255, 255, 255, this.alpha);
    circle(this.dx, this.dy, 4);
    pop();
    this.alpha -= 2;
  }
  isDead() {
    return this.alpha <= 0;
  }
}

class Line {
  constructor(r, theta) {
    this.r = r;
    this.theta = theta;
    this.dx = this.r * cos(-this.theta);
    this.dy = this.r * sin(-this.theta);
  }
  rotate(theta) {
    this.dx = this.r * cos(-theta);
    this.dy = this.r * sin(-theta);
  }
  draw() {
    push();
    translate(width / 2, height / 2);
    stroke(0, 255, 0);
    line(0, 0, this.dx, this.dy);
    pop();
  }
}
