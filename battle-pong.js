/* global performance FPSMeter */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const getTime = typeof performance === 'function' ? performance.now : Date.now;
const FRAME_DURATION = 1000 / 58;
let then = getTime();
let acc = 0;
FPSMeter.theme.colorful.container.height = '40px';
const meter = new FPSMeter({
  left: canvas.width - 130 + 'px',
  top: 'auto',
  bottom: '12px',
  theme: 'colorful',
  heat: 1,
  graph: 1
});

let gameType = 1;
let resetType = true;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  color: '#0095DD',
  angle: 60,
  rocketThreshold: 5,
  speed: 13,
  speedX: 13,
  speedY: 0,
  left: false
};

const paddle = {
  width: 20,
  height: 150,
  arc: 10,
  color: '#0095DD'
};

const paddleLeft = {
  x: 0,
  y: (canvas.height - 150) / 2,
  speed: 15,
  speedY: 0,
  variance: Math.random() * paddle.height,
  score: 0,
  rockets: 0
};

const paddleRight = {
  x: canvas.width - 20,
  y: (canvas.height - 150) / 2,
  speed: 15,
  speedY: 0,
  variance: Math.random() * paddle.height,
  score: 0,
  rockets: 0
};

const rocket = {
  width: 30,
  lineWidth: 5,
  lineCap: 'round',
  shadowBlur: 10,
  color: '#FF0000',
  speed: 30,
  increment: 0.5
};

const label = {
  font: '24px Arial',
  color: '#0095DD',
  margin: 20
};

const line = {
  width: label.margin / 4,
  height: label.margin / 2,
  color: '#0095DD'
};

let lines = [];
let rockets = [];

const backgroundCanvas = document.createElement('canvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
resizeHandler();
draw();
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  const now = getTime();
  let ms = now - then;
  let frames = 0;
  then = now;
  if (ms < 1000) {
    acc += ms;
    while (acc >= FRAME_DURATION) {
      frames++;
      acc -= FRAME_DURATION;
    }
  } else {
    ms = 0;
  }
  meter.tick();
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
  for (const r of rockets) {
    drawRocket(r);
  }
  ctx.restore();
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText('Score: ' + paddleLeft.score, 10, label.margin);
  ctx.fillText('Rockets: ' + Math.floor(paddleLeft.rockets), 10, 2 * label.margin);
  ctx.fillText('Score: ' + paddleRight.score, canvas.width - 120, label.margin);
  ctx.fillText('Rockets: ' + Math.floor(paddleRight.rockets), canvas.width - 120, 2 * label.margin);
  processBall(frames);
  processPaddles(frames);
  processRockets(frames);
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

function processBall (frames) {
  if ((ball.y < ball.radius && ball.speedY < 0) || (ball.y > canvas.height - ball.radius && ball.speedY > 0)) {
    ball.speedY = -ball.speedY;
  }
  if ((ball.x < ball.radius && ball.speedX < 0) || (ball.x > canvas.width - ball.radius && ball.speedX > 0)) {
    ball.left = !ball.left;
    if (ball.x < ball.radius && ball.speedX < 0) {
      paddleRight.score++;
    } else {
      paddleLeft.score++;
    }
    reset(false, false);
  }
  if (ball.x < paddle.width + ball.radius && ball.speedX < 0 && intersects(paddleLeft, ball)) {
    jump(paddleLeft, 1, paddleRight);
    if (gameType === 0 && (paddleLeft.rockets >= 2 || (paddleLeft.rockets >= 1 && ball.speedY < ball.rocketThreshold && ball.speedY > -ball.rocketThreshold))) {
      fireRocket(paddleLeft, 1);
    }
  }
  if (ball.x > canvas.width - paddle.width - ball.radius && ball.speedX > 0 && intersects(paddleRight, ball)) {
    jump(paddleRight, -1, paddleLeft);
    if ((gameType === 0 || gameType === 1) && (paddleRight.rockets >= 2 || (paddleRight.rockets >= 1 && ball.speedY < ball.rocketThreshold && ball.speedY > -ball.rocketThreshold))) {
      fireRocket(paddleRight, -1);
    }
  }
  ball.x += ball.speedX * frames;
  ball.y += ball.speedY * frames;
}

function processPaddles (frames) {
  if (gameType === 0 || gameType === 1) {
    if (ball.left) {
      if (gameType === 0) {
        autoPaddle(ball.x, ball.y, paddleLeft);
      }
      autoPaddle(canvas.width / 2, canvas.height / 2, paddleRight);
    } else {
      if (gameType === 0) {
        autoPaddle(canvas.width / 2, canvas.height / 2, paddleLeft);
      }
      autoPaddle(ball.x, ball.y, paddleRight);
    }
  }
  paddleLeft.y += paddleLeft.speedY * frames;
  paddleRight.y += paddleRight.speedY * frames;
}

function processRockets (frames) {
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    if (r.x < paddle.width && r.y >= paddleLeft.y && r.y <= paddleLeft.y + paddle.height) {
      paddleRight.score++;
      reset(false, true);
      break;
    }
    if (r.x > canvas.width - paddle.width - rocket.width && r.y >= paddleRight.y && r.y <= paddleRight.y + paddle.height) {
      paddleLeft.score++;
      reset(false, true);
      break;
    }
    if (r.x < 0 || r.x > canvas.width - rocket.width) {
      rockets.splice(i, 1);
    }
    r.x += r.speed * frames;
  }
}

function reset (reset, rocket) {
  if (resetType || reset) {
    if (resetType && !reset) {
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
  } else if (!rocket) {
    ball.speedX = -ball.speedX;
  }
  paddleLeft.variance = Math.random() * paddle.height;
  paddleRight.variance = Math.random() * paddle.height;
  paddleLeft.rockets = 0;
  paddleRight.rockets = 0;
  rockets = [];
}

function intersects (r, c) {
  const distX = Math.abs(c.x - r.x - paddle.width / 2);
  const distY = Math.abs(c.y - r.y - paddle.height / 2);
  if (distX > (paddle.width / 2 + c.radius) || distY > (paddle.height / 2 + c.radius)) {
    return false;
  }
  if (distX <= (paddle.width / 2) || distY <= (paddle.height / 2)) {
    return true;
  }
  const dX = distX - paddle.width / 2;
  const dY = distY - paddle.height / 2;
  return dX ** 2 + dY ** 2 <= c.radius ** 2;
}

function jump (p1, direction, p2) {
  p1.rockets += rocket.increment;
  ball.left = direction !== 1;
  p2.variance = Math.random() * paddle.height;
  const x = (p1.y + paddle.height / 2.0 - ball.y) / (paddle.height / 2.0);
  ball.speedX = direction * ball.speed * Math.cos(x * ball.angle * Math.PI / 180);
  ball.speedY = -ball.speed * Math.sin(x * ball.angle * Math.PI / 180);
}

function fireRocket (p, direction) {
  p.rockets--;
  rockets.push({
    x: p.x + (direction === 1 ? paddle.width : -rocket.width),
    y: p.y + paddle.height / 2,
    speed: direction * rocket.speed
  });
}

function autoPaddle (x, y, p) {
  const dX = x - p.x;
  const dY = y - p.y - p.variance;
  const norm = Math.sqrt(dX ** 2 + dY ** 2);
  p.speedY = dY / norm * p.speed;
}

function changeGame () {
  if (gameType === 2) {
    gameType = 0;
  } else {
    gameType++;
  }
  document.getElementById('change-game').innerHTML = gameType;
  paddleLeft.speedY = 0;
  paddleRight.speedY = 0;
}

function changeReset () {
  resetType = !resetType;
  if (resetType) {
    document.getElementById('change-reset').innerHTML = 'Ce<span style="text-decoration: underline">n</span>ter';
  } else {
    document.getElementById('change-reset').innerHTML = 'Bou<span style="text-decoration: underline">n</span>ce';
  }
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
  if (e.keyCode === 37 && gameType === 2 && paddleRight.rockets >= 1) {
    fireRocket(paddleRight, -1);
  }
  if (e.keyCode === 68 && (gameType === 1 || gameType === 2) && paddleLeft.rockets >= 1) {
    fireRocket(paddleLeft, 1);
  }
  if (e.keyCode === 82) {
    reset(true, false);
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
  lines = [];
  for (let i = 0; i < canvas.height / line.height; i++) {
    if (i % 2 === 0) {
      lines.push({
        x: canvas.width / 2 - line.width / 2,
        y: i * line.height
      });
    }
  }
  backgroundCanvas.width = canvas.width;
  backgroundCanvas.height = canvas.height;
  backgroundCtx.fillStyle = line.color;
  backgroundCtx.clearRect(0, 0, backgroundCtx.width, backgroundCtx.height);
  for (const l of lines) {
    backgroundCtx.fillRect(l.x, l.y, line.width, line.height);
  }
}
