let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let scoreLeft = 0;
let scoreRight = 0;
let gameMode = 1;
let ballLeft = false;
let resetBehavior = true;

let ball = {
  x: canvas.width / 2 - 10,
  y: canvas.height / 2 - 10,
  radius: 10,
  color: "#0095DD",
  angle: 60,
  speed: 13,
  speedX: 13 / Math.sqrt(2),
  speedY: 13 / Math.sqrt(2)
};

let paddle = {
  width: 20,
  height: 150,
  arc: 10,
  color: "#0095DD"
}

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
  font: "24px Calibri",
  color: "#0095DD",
  margin: 20
};

draw();
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
window.addEventListener("resize", resizeHandler);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(paddleLeft);
  drawPaddle(paddleRight);
  drawLabel("Score: " + scoreLeft, 10);
  drawLabel("Score: " + scoreRight, canvas.width - 120);
  processBall();
  processPaddles();
  requestAnimationFrame(draw);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  fill(ball.color);
}

function drawPaddle(p) {
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
  fill(paddle.color);
}

function drawLabel(text, x) {
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText(text, x, label.margin);
}

function fill(color) {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function processBall() {
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

function processPaddles() {
  if (gameMode === 2 && ballLeft) {
    autoPaddle(paddleLeft);
  }
  if ((gameMode === 1 || gameMode === 2) && !ballLeft) {
    autoPaddle(paddleRight);
  }
  if (gameMode === 0 || gameMode === 1 || (gameMode === 2 && ballLeft)) {
    paddleLeft.y += paddleLeft.speedY;
  }
  if (gameMode === 0 || ((gameMode === 1 || gameMode === 2) && !ballLeft)) {
    paddleRight.y += paddleRight.speedY;
  }
}

function jump(p1, direction, p2) {
  ballLeft = !ballLeft;
  if (intersects(ball.x, ball.y, 2 * ball.radius, 2 * ball.radius, p1.x, p1.y, paddle.width, paddle.height)) {
    p2.variance = Math.random() * paddle.height;
    let x = (p1.y + paddle.height / 2.0 - ball.y - ball.radius) / (paddle.height / 2.0);
    ball.speedX = direction * ball.speed * Math.cos(x * ball.angle * Math.PI / 180);
    ball.speedY = -ball.speed * Math.sin(x * ball.angle * Math.PI / 180);
  } else {
    if (ballLeft) {
      scoreLeft++;
    } else {
      scoreRight++;
    }
    reset(false);
  }
}

function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

function reset(reset) {
  if (resetBehavior || reset) {
    if (resetBehavior && !reset) {
      alert("START AGAIN!");
    }
    ball.x = canvas.width / 2 - ball.radius;
    ball.y = canvas.height / 2 - ball.radius;
    if (ballLeft) {
      ball.speedX = -ball.speed / Math.sqrt(2);
    } else {
      ball.speedX = ball.speed / Math.sqrt(2);
    }
    ball.speedY = ball.speed / Math.sqrt(2);
  } else {
    ball.speedX = -ball.speedX;
  }
}

function autoPaddle(p) {
  let x = ball.x - p.x;
  let y = ball.y - p.y - p.variance;
  let norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  p.speedY = y / norm * p.speed;
}

function keyDownHandler(e) {
  if (e.keyCode === 38 && gameMode === 0) {
    paddleRight.speedY = -paddleRight.speed;
  } else if (e.keyCode === 40 && gameMode === 0) {
    paddleRight.speedY = paddleRight.speed;
  }
  if (e.keyCode === 87 && (gameMode === 0 || gameMode === 1)) {
    paddleLeft.speedY = -paddleLeft.speed;
  } else if (e.keyCode === 83 && (gameMode === 0 || gameMode === 1)) {
    paddleLeft.speedY = paddleLeft.speed;
  }
  if (e.keyCode === 82) {
    reset(true);
  }
}

function keyUpHandler(e) {
  if ((e.keyCode === 38 || e.keyCode === 40) && gameMode === 0) {
    paddleRight.speedY = 0;
  }
  if ((e.keyCode === 87 || e.keyCode === 83) && (gameMode === 0 || gameMode === 1)) {
    paddleLeft.speedY = 0;
  }
}

function mouseMoveHandler(e) {
  if ((gameMode === 0 && e.clientX < canvas.width / 2) || gameMode === 1) {
    paddleLeft.y = e.clientY - canvas.offsetTop - paddle.height / 2;
  }
  if (gameMode === 0 && e.clientX >= canvas.width / 2) {
    paddleRight.y = e.clientY - canvas.offsetTop - paddle.height / 2;
  }
}

function resizeHandler() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  paddleRight.x = canvas.width - paddle.width;
}
