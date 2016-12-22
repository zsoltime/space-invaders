'use strict';

const game = document.getElementById('game');
const colorLaser = '#d32f2f';
const colorShip = '#fff';
const rows = 5;
const cols = 11;
const paddingX = 50;
const paddingY = 35;
let ship;
let lasers = [];
let aliens = [];
let score = 0;
let approachedBottom = false;
let destroyedAll = false;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent(game);
  noStroke();
  ship = Ship();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      aliens.push(Alien(paddingX + j * paddingX, paddingY / 2 + i * paddingY));
    }
  }
}

function draw() {
  clear();
  ship.render();
  ship.move();
  let hitEdge = false;

  for (let i = 0; i < aliens.length; i++) {
    aliens[i].render();
    aliens[i].move();

    if (aliens[i].pos.x > width - 20 ||
        aliens[i].pos.x < 20) {
      hitEdge = true;
    }

    if (aliens[i].pos.y + aliens[i].size / 2 >= height) {
      approachedBottom = true;
    }
  }

  if (hitEdge) {
    for (let i = 0; i < aliens.length; i++) {
      aliens[i].moveDown();
    }
  }

  if (approachedBottom) {
    console.log('game over');
    noLoop();
  }

  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].move();

    if (lasers[i].isOffset()) {
      lasers.splice(i, 1);
    }

    for (let j = aliens.length - 1; j >= 0; j--) {
      if (lasers.length === 0) { return; }
      if (lasers[i].hit(aliens[j])) {
        aliens.splice(j, 1);
        score += 10;
        // TODO: now it's only sometimes?!
        // if there is only one laser and I remove that, hit() causes error
        lasers.splice(i, 1);
      }
    }
  }

  push();
  textSize(14);
  fill(colorLaser);
  text(`Score: ${score}`, width -100, height -20);
  pop();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    ship.direction(1);
  }
  else if (keyCode === LEFT_ARROW) {
    ship.direction(-1);
  }

  if (keyCode === 32) {
    lasers.push(Laser(ship.pos.x, ship.pos.y));
  }
}

function keyReleased() {
  if (keyCode !== 32) {
    ship.direction(0);
  }
}

function Ship() {
  const size = 20;
  const speed = 1;
  let pos = createVector(width / 2, height - size);
  let velocity = createVector(0, 0);

  function render() {
    fill(colorShip);
    triangle(pos.x, pos.y, pos.x + size / 2, pos.y + size, pos.x - size /2, pos.y + size);
  }

  function move() {
    pos.x += velocity.x;
  }

  function direction(x) {
    velocity.x = x * speed;
  }

  return {
    render,
    move,
    direction,
    pos
  }
}

function Alien(x, y) {
  let pos = createVector(x, y);
  let velocity = createVector(.5, 0);
  const size = 30;

  function render() {
    fill(255);
    ellipse(pos.x, pos.y, size);
    pop();
    fill('red');
    ellipse(pos.x - 5, pos.y - 5, size / 10);
    ellipse(pos.x + 5, pos.y - 5, size / 10);
    push();
  }

  function move() {
    pos.x += velocity.x;
  }

  function moveDown() {
    pos.y += 20;
    velocity.x *= -1;
  }

  return {
    render,
    move,
    moveDown,
    pos,
    size
  }
}

function Laser(x, y) {
  let pos = createVector(x, y);
  let size = 3;

  function render() {
    push();
    stroke(colorLaser);
    strokeWeight(2);
    line(pos.x, pos.y, pos.x, pos.y + size);
    pop();
  }

  function move() {
    pos.y -= 5;
  }

  function isOffset() {
    return pos.y < 0;
  }

  function hit(alien) {
    let distance = dist(pos.x, pos.y, alien.pos.x, alien.pos.y);

    return distance < size + alien.size / 2;
  }

  return {
    render,
    move,
    isOffset,
    hit
  }
}
