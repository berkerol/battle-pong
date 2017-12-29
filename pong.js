/* global alert */
/* global requestAnimationFrame */
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let scoreLeft = 0;
let scoreRight = 0;
let gameType = 1;
let resetBehavior = true;

let ball = {
  x: canvas.width / 2 - 10,
  y: canvas.height / 2 - 10,
  radius: 10,
  color: '#0095DD',
  angle: 60,
  speed: 13,
  speedX: 13 / Math.sqrt(2),
  speedY: 13 / Math.sqrt(2),
  left: false
};

let paddle = {
  width: 20,
  height: 150,
  arc: 10,
  color: '#0095DD'
};

let paddleLeft = {
  x: 0,
  y: (canvas.height - 150) / 2,
  speed: 20,
  speedY: 0,
  variance: 0
};

let paddleRight = {
  x: canvas.width - 20,
  y: (canvas.height - 150) / 2,
  speed: 20,
  speedY: 0,
  variance: 0
};

let label = {
  font: '24px Arial',
  color: '#0095DD',
  margin: 20
};

let line = {
  width: label.margin / 4,
  height: label.margin / 2,
  color: '#0095DD'
};

let lines = [];

for (let i = 0; i < canvas.height / line.height; i++) {
  if (i % 2 === 0) {
    lines.push({
      x: canvas.width / 2 - line.width / 2,
      y: i * line.height
    });
  }
}
let backgroundCanvas = document.createElement('canvas');
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;
let backgroundCtx = backgroundCanvas.getContext('2d');
backgroundCtx.fillStyle = line.color;
for (let l of lines) {
  backgroundCtx.fillRect(l.x, l.y, line.width, line.height);
}
draw();
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundCanvas, 0, 0);
  ctx.fillStyle = ball.color;
  drawBall();
  ctx.fillStyle = paddle.color;
  drawPaddle(paddleLeft);
  drawPaddle(paddleRight);
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  drawLabel('Score: ' + paddleLeft.score, 10, label.margin);
  drawLabel('Rockets: ' + paddleLeft.rockets, 10, 2 * label.margin);
  drawLabel('Score: ' + paddleRight.score, canvas.width - 120, label.margin);
  drawLabel('Rockets: ' + paddleRight.rockets, canvas.width - 120, 2 * label.margin);
  processBall();
  processPaddles();
  requestAnimationFrame(draw);
}

function drawBall () {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function drawPaddle (p) {
  ctx.beginPath();
  ctx.moveTo(p.x + paddle.arc, p.y);
  ctx.lineTo(p.x + paddle.width - paddle.arc, p.y);
  ctx.quadraticCurveTo(p.x + paddle.width, p.y, p.x + paddle.width, p.y + paddle.arc);
  ctx.lineTo(p.x + paddle.width, p.y + paddle.height - paddle.arc);
  ctx.quadraticCurveTo(p.x + paddle.width, p.y + paddle.height, p.x + paddle.width - paddle.arc, p.y + paddle.height);
  ctx.lineTo(p.x + paddle.arc, p.y + paddle.height);
  ctx.quadraticCurveTo(p.x, p.y + paddle.height, p.x, p.y + paddle.height - paddle.arc);
  ctx.lineTo(p.x, p.y + paddle.arc);
  ctx.quadraticCurveTo(p.x, p.y, p.x + paddle.arc, p.y);
  ctx.fill();
  ctx.closePath();
}

}

function fill (color) {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
function drawLabel (text, x, y) {
  ctx.fillText(text, x, y);
}

function processBall () {
  if (ball.y + ball.speedY < ball.radius || ball.y + ball.speedY > canvas.height - ball.radius) {
    ball.speedY = -ball.speedY;
  }
  if (ball.x + ball.speedX < ball.radius) {
    jump(paddleLeft, 1, paddleRight);
  } else if (ball.x + ball.speedX > canvas.width - ball.radius) {
    jump(paddleRight, -1, paddleLeft);
  }
  ball.x += ball.speedX;
  ball.y += ball.speedY;
}

function processPaddles () {
  if (gameType === 2 && ball.left) {
    autoPaddle(paddleLeft);
  }
  if ((gameType === 1 || gameType === 2) && !ball.left) {
    autoPaddle(paddleRight);
  }
  if (gameType === 0 || gameType === 1 || (gameType === 2 && ball.left)) {
    paddleLeft.y += paddleLeft.speedY;
  }
  if (gameType === 0 || ((gameType === 1 || gameType === 2) && !ball.left)) {
    paddleRight.y += paddleRight.speedY;
  }
}

function jump (p1, direction, p2) {
  ball.left = !ball.left;
  if (intersects(ball.x, ball.y, 2 * ball.radius, 2 * ball.radius, p1.x, p1.y, paddle.width, paddle.height)) {
    p2.variance = Math.random() * paddle.height;
    let x = (p1.y + paddle.height / 2.0 - ball.y - ball.radius) / (paddle.height / 2.0);
    ball.speedX = direction * ball.speed * Math.cos(x * ball.angle * Math.PI / 180);
    ball.speedY = -ball.speed * Math.sin(x * ball.angle * Math.PI / 180);
  } else {
    if (ball.left) {
      scoreLeft++;
    } else {
      scoreRight++;
    }
    reset(false);
  }
}

function intersects (x1, y1, w1, h1, x2, y2, w2, h2) {
  return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

function reset (reset) {
  if (resetBehavior || reset) {
    if (resetBehavior && !reset) {
      alert('START AGAIN!');
    }
    ball.x = canvas.width / 2 - ball.radius;
    ball.y = canvas.height / 2 - ball.radius;
    if (ball.left) {
      ball.speedX = -ball.speed / Math.sqrt(2);
    } else {
      ball.speedX = ball.speed / Math.sqrt(2);
    }
    ball.speedY = ball.speed / Math.sqrt(2);
  } else {
    ball.speedX = -ball.speedX;
  }
}

function autoPaddle (p) {
  let x = ball.x - p.x;
  let y = ball.y - p.y - p.variance;
  let norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  p.speedY = y / norm * p.speed;
}

function keyDownHandler (e) {
  if (e.keyCode === 38 && gameType === 0) {
    paddleRight.speedY = -paddleRight.speed;
  } else if (e.keyCode === 40 && gameType === 0) {
    paddleRight.speedY = paddleRight.speed;
  }
  if (e.keyCode === 87 && (gameType === 0 || gameType === 1)) {
    paddleLeft.speedY = -paddleLeft.speed;
  } else if (e.keyCode === 83 && (gameType === 0 || gameType === 1)) {
    paddleLeft.speedY = paddleLeft.speed;
  }
}

function keyUpHandler (e) {
  if ((e.keyCode === 38 || e.keyCode === 40) && gameType === 0) {
    paddleRight.speedY = 0;
  }
  if ((e.keyCode === 87 || e.keyCode === 83) && (gameType === 0 || gameType === 1)) {
    paddleLeft.speedY = 0;
  }
  if (e.keyCode === 82) {
    reset(true);
  }
}

function mouseMoveHandler (e) {
  if ((gameType === 0 && e.clientX < canvas.width / 2) || gameType === 1) {
    paddleLeft.y = e.clientY - canvas.offsetTop - paddle.height / 2;
  }
  if (gameType === 0 && e.clientX >= canvas.width / 2) {
    paddleRight.y = e.clientY - canvas.offsetTop - paddle.height / 2;
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  paddleRight.x = canvas.width - paddle.width;
}
