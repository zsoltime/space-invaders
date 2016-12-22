'use strict';

const game = document.getElementById('game');
let ship;
let lasers = [];
let aliens = [];

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent(game);
}

function draw() {
  clear();
}

function Ship() {
  let pos = createVector(width / 2, height);

  function render() {}
  function update() {}

  return {
    render: render,
    update: update
  }
}

function Alien() {
  function render() {}
  function update() {}

  return {
    render: render,
    update: update
  }
}

function Laser() {
  function render() {}
  function update() {}

  return {
    render: render,
    update: update
  }
}
