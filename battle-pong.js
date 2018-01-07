let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameType = 1;
let resetBehavior = true;

let ball = {
  x: canvas.width / 2 - 10,
  y: canvas.height / 2 - 10,
  radius: 10,
  color: '#0095DD',
  angle: 60,
  speed: 13,
  speedX: 13,
  speedY: 0,
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
  speed: 15,
  speedY: 0,
  variance: 0,
  score: 0,
  rockets: 0
};

let paddleRight = {
  x: canvas.width - 20,
  y: (canvas.height - 150) / 2,
  speed: 15,
  speedY: 0,
  variance: 0,
  score: 0,
  rockets: 0
};

let rocket = {
  width: 30,
  lineWidth: 5,
  lineCap: 'round',
  shadowBlur: 10,
  color: '#FF0000',
  speed: 30
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
let rockets = [];

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
  ctx.save();
  ctx.lineWidth = rocket.lineWidth;
  ctx.lineCap = rocket.lineCap;
  ctx.shadowBlur = rocket.shadowBlur;
  ctx.shadowColor = rocket.color;
  ctx.strokeStyle = rocket.color;
  for (let r of rockets) {
    drawRocket(r);
  }
  ctx.restore();
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  drawLabel('Score: ' + paddleLeft.score, 10, label.margin);
  drawLabel('Rockets: ' + paddleLeft.rockets, 10, 2 * label.margin);
  drawLabel('Score: ' + paddleRight.score, canvas.width - 120, label.margin);
  drawLabel('Rockets: ' + paddleRight.rockets, canvas.width - 120, 2 * label.margin);
  processBall();
  processPaddles();
  processRockets();
  window.requestAnimationFrame(draw);
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

function drawRocket (r) {
  ctx.beginPath();
  ctx.moveTo(r.x, r.y);
  ctx.lineTo(r.x + rocket.width, r.y);
  ctx.stroke();
  ctx.closePath();
}

function drawLabel (text, x, y) {
  ctx.fillText(text, x, y);
}

function processBall () {
  if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
    ball.speedY = -ball.speedY;
  }
  if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
    ball.left = !ball.left;
    if (ball.x < ball.radius) {
      paddleRight.score++;
    } else {
      paddleLeft.score++;
    }
    reset(false);
  }
  if (ball.x < paddle.width + ball.radius && rectCircle(paddleLeft, ball)) {
    jump(paddleLeft, 1, paddleRight);
  }
  if (ball.x > canvas.width - paddle.width - ball.radius && rectCircle(paddleRight, ball)) {
    jump(paddleRight, -1, paddleLeft);
  }
  ball.x += ball.speedX;
  ball.y += ball.speedY;
}

function processPaddles () {
  if (ball.left && gameType === 0) {
    autoPaddle(paddleLeft);
  }
  if (!ball.left && (gameType === 0 || gameType === 1)) {
    autoPaddle(paddleRight);
  }
  if ((ball.left && gameType === 0) || gameType === 1 || gameType === 2) {
    paddleLeft.y += paddleLeft.speedY;
  }
  if ((!ball.left && (gameType === 0 || gameType === 1)) || gameType === 2) {
    paddleRight.y += paddleRight.speedY;
  }
}

function processRockets () {
  for (let i = rockets.length - 1; i >= 0; i--) {
    let r = rockets[i];
    if (r.x < paddle.width && r.y >= paddleLeft.y && r.y <= paddleLeft.y + paddle.height) {
      paddleRight.score++;
      reset(false);
      break;
    }
    if (r.x > canvas.width - paddle.width - rocket.width && r.y >= paddleRight.y && r.y <= paddleRight.y + paddle.height) {
      paddleLeft.score++;
      reset(false);
      break;
    }
    if (r.x < 0 || r.x > canvas.width - rocket.width) {
      rockets.splice(i, 1);
    }
    r.x += r.speed;
  }
}

function reset (reset) {
  if (resetBehavior || reset) {
    if (resetBehavior && !reset) {
      window.alert('START AGAIN!');
    }
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    if (ball.left) {
      ball.speedX = -ball.speed;
    } else {
      ball.speedX = ball.speed;
    }
    ball.speedY = 0;
    paddleLeft.rockets = 0;
    paddleRight.rockets = 0;
    rockets = [];
  } else {
    ball.speedX = -ball.speedX;
  }
}

function rectCircle (r, c) {
  let distX = Math.abs(c.x - r.x - paddle.width / 2);
  let distY = Math.abs(c.y - r.y - paddle.height / 2);
  if (distX > (paddle.width / 2 + c.radius) || distY > (paddle.height / 2 + c.radius)) {
    return false;
  }
  if (distX <= (paddle.width / 2) || distY <= (paddle.height / 2)) {
    return true;
  }
  let dx = distX - paddle.width / 2;
  let dy = distY - paddle.height / 2;
  return (dx * dx + dy * dy <= (c.radius * c.radius));
}

function jump (p1, direction, p2) {
  p1.rockets++;
  ball.left = direction !== 1;
  p2.variance = Math.random() * paddle.height;
  let x = (p1.y + paddle.height / 2.0 - ball.y) / (paddle.height / 2.0);
  ball.speedX = direction * ball.speed * Math.cos(x * ball.angle * Math.PI / 180);
  ball.speedY = -ball.speed * Math.sin(x * ball.angle * Math.PI / 180);
}

function autoPaddle (p) {
  let x = ball.x - p.x;
  let y = ball.y - p.y - p.variance;
  let norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  p.speedY = y / norm * p.speed;
}

function changeType () {
  if (gameType === 2) {
    gameType = 0;
  } else {
    gameType++;
  }
  document.getElementById('type').innerHTML = gameType;
  paddleLeft.speedY = 0;
  paddleRight.speedY = 0;
}

function keyDownHandler (e) {
  if (e.keyCode === 38 && gameType === 2) {
    paddleRight.speedY = -paddleRight.speed;
  }
  if (e.keyCode === 40 && gameType === 2) {
    paddleRight.speedY = paddleRight.speed;
  }
  if (e.keyCode === 87 && (gameType === 1 || gameType === 2)) {
    paddleLeft.speedY = -paddleLeft.speed;
  }
  if (e.keyCode === 83 && (gameType === 1 || gameType === 2)) {
    paddleLeft.speedY = paddleLeft.speed;
  }
}

function keyUpHandler (e) {
  if ((e.keyCode === 38 || e.keyCode === 40) && gameType === 2) {
    paddleRight.speedY = 0;
  }
  if ((e.keyCode === 87 || e.keyCode === 83) && (gameType === 1 || gameType === 2)) {
    paddleLeft.speedY = 0;
  }
  if (e.keyCode === 37 && paddleRight.rockets > 0) {
    paddleRight.rockets--;
    rockets.push({
      x: paddleRight.x - rocket.width,
      y: paddleRight.y + paddle.height / 2,
      speed: -rocket.speed
    });
  }
  if (e.keyCode === 68 && paddleLeft.rockets > 0) {
    paddleLeft.rockets--;
    rockets.push({
      x: paddleLeft.x + paddle.width,
      y: paddleLeft.y + paddle.height / 2,
      speed: rocket.speed
    });
  }
  if (e.keyCode === 82) {
    reset(true);
  }
}

function mouseMoveHandler (e) {
  if (gameType === 1 || (gameType === 2 && e.clientX < canvas.width / 2)) {
    paddleLeft.y = e.clientY - canvas.offsetTop - paddle.height / 2;
  }
  if (gameType === 2 && e.clientX >= canvas.width / 2) {
    paddleRight.y = e.clientY - canvas.offsetTop - paddle.height / 2;
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  paddleRight.x = canvas.width - paddle.width;
}