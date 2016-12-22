'use strict';

const game = document.getElementById('game');
const colorLaser = '#d32f2f';
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
  ship.move();

  let hitEdge = false;

  for (let i = 0; i < aliens.length; i++) {
    aliens[i].render();
    aliens[i].move();

    if (aliens[i].pos.x > width - 20 ||
        aliens[i].pos.x < 20) {
      hitEdge = true;
    }
  }

  if (hitEdge) {
    for (let i = 0; i < aliens.length; i++) {
      aliens[i].moveDown();
    }
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
        // if there is only one laser and I remove that, hit() causes error
        lasers.splice(i, 1);
      }
    }
  }
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
  let pos = createVector((width - size) / 2, height);
  let velocity = createVector(0, 0);

  function render() {
    rect(pos.x, height - size, size, size);
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
    ellipse(pos.x, pos.y, size);
  }

  function move() {
    pos.x += velocity.x;
  }

  function moveDown() {
    pos.y += 2;
    velocity.x *= -1;
  }

  // function destroy() {
  //   // console.log('ouch');
  // }

  return {
    render,
    move,
    moveDown,
    pos,
    size,
    // destroy
  }
}

function Laser(x, y) {
  let pos = createVector(x, y);
  let size = 3;

  function render() {
    push();
    stroke(colorLaser);
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
