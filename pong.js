let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ballLeft = false;
let resetBehavior = true;
let gameMode = 1;

let ball = {
  x: canvas.width / 2 - 10,
  y: canvas.height / 2 - 10,
  dx: 13 / Math.sqrt(2),
  dy: 13 / Math.sqrt(2),
  radius: 10,
  angle: 60,
  speed: 13,
  color: "#0095DD"
};

let paddleLeft = {
  x: 0,
  y: (canvas.height - 150) / 2,
  dy: 0,
  variance: 0,
  width: 20,
  height: 150,
  arc: 10,
  speed: 20,
  color: "#0095DD"
};

let paddleRight = {
  x: canvas.width - 20,
  y: (canvas.height - 150) / 2,
  dy: 0,
  variance: 0,
  width: 20,
  height: 150,
  arc: 10,
  speed: 20,
  color: "#0095DD"
};

function reset(reset) {
  if (resetBehavior || reset) {
    if (resetBehavior && !reset) {
      alert("START AGAIN!");
    }
    ball.x = canvas.width / 2 - ball.radius;
    ball.y = canvas.height / 2 - ball.radius;
    if (ballLeft) {
      ball.dx = -ball.speed / Math.sqrt(2);
    } else {
      ball.dx = ball.speed / Math.sqrt(2);
    }
    ball.dy = ball.speed / Math.sqrt(2);
  } else {
    ball.dx = -ball.dx;
  }
}

let score = {
  font: "16px Arial",
  color: "#0095DD",
  size: 20
};

let scoreLeft = 0;
let scoreRight = 0;

draw();
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function drawRoundRect(x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function fill(color) {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  fill(ball.color);
}

function drawPaddle(paddle) {
  ctx.beginPath();
  drawRoundRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.arc);
  fill(paddle.color);
}

function drawScore(number, position) {
  ctx.font = score.font;
  ctx.fillStyle = score.color;
  ctx.fillText("Score: " + number, position, score.size);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(paddleLeft);
  drawPaddle(paddleRight);
  drawScore(scoreLeft, 10);
  drawScore(scoreRight, canvas.width - 80);
  controlBall();
  controlPaddle();
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (gameMode === 0 || gameMode === 1 || (gameMode === 2 && ballLeft)) {
    paddleLeft.y += paddleLeft.dy;
  }
  if (gameMode === 0 || ((gameMode === 1 || gameMode === 2) && !ballLeft)) {
    paddleRight.y += paddleRight.dy;
  }
  requestAnimationFrame(draw);
}

function controlBall() {
  if (ball.y + ball.dy < ball.radius || ball.y + ball.dy > canvas.height - ball.radius) {
    ball.dy = -ball.dy;
  }
  if (ball.x + ball.dx < ball.radius) {
    jump(paddleLeft, 1, paddleRight);
  } else if (ball.x + ball.dx > canvas.width - ball.radius) {
    jump(paddleRight, -1, paddleLeft);
  }
}

function jump(paddle, direction, otherPaddle) {
  ballLeft = !ballLeft;
  if (intersects(ball.x, ball.y, 2 * ball.radius, 2 * ball.radius, paddle.x, paddle.y, paddle.width, paddle.height)) {
    otherPaddle.variance = Math.random() * otherPaddle.height;
    let x = (paddle.y + paddle.height / 2.0 - ball.y - ball.radius) / (paddle.height / 2.0);
    ball.dx = direction * ball.speed * Math.cos(x * ball.angle * Math.PI / 180);
    ball.dy = -ball.speed * Math.sin(x * ball.angle * Math.PI / 180);
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

function controlPaddle() {
  if (gameMode === 2 && ballLeft) {
    autoPaddle(paddleLeft);
  }
  if ((gameMode === 1 || gameMode === 2) && !ballLeft) {
    autoPaddle(paddleRight);
  }
}

function autoPaddle(paddle) {
  let x = ball.x - paddle.x;
  let y = ball.y - paddle.y - paddle.variance;
  let norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  paddle.dy = y / norm * paddle.speed;
}

function keyDownHandler(e) {
  if (e.keyCode === 38 && gameMode === 0) {
    paddleRight.dy = -paddleRight.speed;
  } else if (e.keyCode === 40 && gameMode === 0) {
    paddleRight.dy = paddleRight.speed;
  }
  if (e.keyCode === 87 && (gameMode === 0 || gameMode === 1)) {
    paddleLeft.dy = -paddleLeft.speed;
  } else if (e.keyCode === 83 && (gameMode === 0 || gameMode === 1)) {
    paddleLeft.dy = paddleLeft.speed;
  }
  if (e.keyCode === 82) {
    reset(true);
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 38 && gameMode === 0) {
    paddleRight.dy = 0;
  } else if (e.keyCode === 40 && gameMode === 0) {
    paddleRight.dy = 0;
  }
  if (e.keyCode === 87 && (gameMode === 0 || gameMode === 1)) {
    paddleLeft.dy = 0;
  } else if (e.keyCode === 83 && (gameMode === 0 || gameMode === 1)) {
    paddleLeft.dy = 0;
  }
}

function mouseMoveHandler(e) {
  if ((gameMode === 0 && e.clientX < canvas.width / 2) || gameMode === 1) {
    paddleLeft.y = e.clientY - canvas.offsetTop - paddleLeft.height / 2;
  }
  if (gameMode === 0 && e.clientX >= canvas.width / 2) {
    paddleRight.y = e.clientY - canvas.offsetTop - paddleRight.height / 2;
  }
}
