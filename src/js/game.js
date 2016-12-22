'use strict';

const game = document.getElementById('game');
const colorLaser = '#18ffff';
let ship;
let lasers = [];
let aliens = [];

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent(game);
  ship = Ship();

  for (let i = 0; i < 11; i++) {
    aliens.push(Alien(50 + i * 50, 30));
  }
}

function draw() {
  clear();
  ship.render();

  for (let i = 0; i < aliens.length; i++) {
    aliens[i].render();
  }

  for (let i = 0; i < lasers.length; i++) {
    lasers[i].render();
    lasers[i].move();
    if (lasers[i].isOffset()) {
      lasers.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    ship.move(1);
  }
  else if (keyCode === LEFT_ARROW) {
    ship.move(-1);
  }

  if (keyCode === 32) {
    lasers.push(Laser(ship.pos.x, ship.pos.y));
  }
}

function Ship() {
  const size = 20;
  let pos = createVector((width - size) / 2, height);

  function render() {
    rect(pos.x, height - size, size, size);
  }

  function move(direction) {
    pos.x += direction * 5;
  }

  function update() {}

  return {
    render: render,
    move: move,
    update: update,
    pos: pos
  }
}

function Alien(x, y) {
  let pos = createVector(x, y);
  const size = 30;

  function render() {
    ellipse(pos.x, pos.y, size);
  }
  function update() {}

  function move(direction) {
    pos.x += direction * 5;
  }

  return {
    render: render,
    move: move,
    update: update
  }
}

function Laser(x, y) {
  let pos = createVector(x, y);
  let size = 3;

  function render() {
    push();
    stroke(colorLaser);
    line(pos.x, pos.y, pos.x, pos.y - size);
    pop();
  }

  function move() {
    pos.y -= 1;
  }

  function isOffset() {
    return pos.y < 0;
  }

  return {
    render: render,
    move: move,
    isOffset: isOffset
  }
}
