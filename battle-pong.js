/* global canvas ctx animation:writable gameLoop label loop paintCircle drawLine drawRoundRect isIntersectingRectangleWithCircle createDropdownRow */
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

const line = {
  width: label.margin / 4,
  height: label.margin / 2,
  color: '#0095DD'
};

let lines = [];
let rockets = [];

const dropdownElements = [[['info dropdown-toggle', '', 'p', 'user-friends', '<span id="change-game-text">1</span> <u>P</u>layer'], 'change-game', [['0', '0 Player'], ['1', '1 Player'], ['2', '2 Players']]], [['info dropdown-toggle', '', 'r', 'sync', '<span id="change-reset-text">Change <u>r</u>eset</span>'], 'change-reset', [['1', 'Restart from center'], ['0', 'Bounce from edge']]]];
const dropdownRow = createDropdownRow(dropdownElements);
document.body.insertBefore(dropdownRow, canvas);
const backgroundCanvas = document.createElement('canvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
resizeHandler();
document.querySelectorAll('#change-game .dropdown-item').forEach(e => {
  e.addEventListener('click', function () {
    document.getElementById('change-game-text').innerHTML = this.dataset.value;
    gameType = +this.dataset.value;
    paddleLeft.speedY = 0;
    paddleRight.speedY = 0;
  });
});
document.querySelectorAll('#change-reset .dropdown-item').forEach(e => {
  e.addEventListener('click', function () {
    document.getElementById('change-reset-text').innerHTML = this.innerHTML;
    resetType = !!+this.dataset.value;
  });
});
document.addEventListener('keydown', keyDownHandler_);
document.addEventListener('keyup', keyUpHandler_);
document.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', resizeHandler);

loop(function (frames) {
  ctx.drawImage(backgroundCanvas, 0, 0);
  paintCircle(ball.x, ball.y, ball.radius, ball.color);
  ctx.fillStyle = paddle.color;
  ctx.beginPath();
  drawRoundRect(paddleLeft.x, paddleLeft.y, paddle.width, paddle.height, paddle.arc, paddle.arc);
  drawRoundRect(paddleRight.x, paddleRight.y, paddle.width, paddle.height, paddle.arc, paddle.arc);
  ctx.fill();
  if (rockets.length > 0) {
    ctx.save();
    ctx.lineWidth = rocket.lineWidth;
    ctx.lineCap = rocket.lineCap;
    ctx.shadowBlur = rocket.shadowBlur;
    ctx.shadowColor = rocket.color;
    ctx.strokeStyle = rocket.color;
    ctx.beginPath();
    for (const r of rockets) {
      drawLine(r.x, r.y, r.x + rocket.width, r.y);
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText('Score: ' + paddleLeft.score, label.left, label.margin);
  ctx.fillText('Rockets: ' + Math.floor(paddleLeft.rockets), label.left, 2 * label.margin);
  ctx.fillText('Score: ' + paddleRight.score, label.right, label.margin);
  ctx.fillText('Rockets: ' + Math.floor(paddleRight.rockets), label.right, 2 * label.margin);
  processBall(frames);
  processPaddles(frames);
  processRockets(frames);
});

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
  if (ball.x < paddle.width + ball.radius && ball.speedX < 0 && isIntersectingRectangleWithCircle(paddleLeft, paddle.width, paddle.height, ball, ball.radius)) {
    jump(paddleLeft, 1, paddleRight);
    if (gameType === 0 && (paddleLeft.rockets >= 2 || (paddleLeft.rockets >= 1 && ball.speedY < ball.rocketThreshold && ball.speedY > -ball.rocketThreshold))) {
      fireRocket(paddleLeft, 1);
    }
  }
  if (ball.x > canvas.width - paddle.width - ball.radius && ball.speedX > 0 && isIntersectingRectangleWithCircle(paddleRight, paddle.width, paddle.height, ball, ball.radius)) {
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

function jump (p1, direction, p2) {
  p1.rockets += rocket.increment;
  ball.left = direction !== 1;
  p2.variance = Math.random() * paddle.height;
  const x = (p1.y + paddle.height / 2 - ball.y) / (paddle.height / 2);
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

function keyDownHandler_ (e) {
  if (animation !== undefined) {
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
}

function keyUpHandler_ (e) {
  if (animation !== undefined) {
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
  if (e.keyCode === 80) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function mouseMoveHandler (e) {
  if (animation !== undefined) {
    if (gameType === 1 || (gameType === 2 && e.clientX < canvas.width / 2)) {
      paddleLeft.y = e.clientY - canvas.offsetTop - paddle.height / 2;
    }
    if (gameType === 2 && e.clientX >= canvas.width / 2) {
      paddleRight.y = e.clientY - canvas.offsetTop - paddle.height / 2;
    }
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
