# Battle Pong

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=berkerol_battle-pong&metric=alert_status)](https://sonarcloud.io/dashboard?id=berkerol_battle-pong)
[![CI](https://github.com/berkerol/battle-pong/actions/workflows/lint.yml/badge.svg?branch=master)](https://github.com/berkerol/battle-pong/actions/workflows/lint.yml)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/berkerol/battle-pong/issues)
[![semistandard](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)
[![ECMAScript](https://img.shields.io/badge/ECMAScript-latest-brightgreen.svg)](https://www.ecma-international.org/ecma-262)
[![license](https://img.shields.io/badge/license-GNU%20GPL%20v3.0-blue.svg)](https://github.com/berkerol/battle-pong/blob/master/LICENSE)

Remake of the classic game with rockets and different game types. It may also work as a beautiful simulation when computer controls both of the paddles.

[![button](play.png)](https://berkerol.github.io/battle-pong/battle-pong.html)

## Controls

- With mouse

  - If user controls just the left paddle

    - Left paddle follows mouse.

  - If users control left and right paddles

    - Left paddle moves when mouse is in the left half.
    - Right paddle moves when mouse is in the right half.

- With keyboard

  - Left paddle

    - Goes up by pressing _W_.
    - Goes down by pressing _S_.

  - Right paddle

    - Goes up by pressing _UP_.
    - Goes down by pressing _DOWN_.

- Left paddle fires rockets by pressing _D_.

- Right paddle fires rockets by pressing _LEFT_.

- Reset the ball by pressing _R_.

- Pause the game by pressing _P_.

- Click buttons to change game type and reset type.

## Gameplay & Features

- Game types

  - Computer controls left and right paddles.
  - User controls left and computer controls right paddle.
  - Users control left and right paddles.

- Reset types

  - Ball starts from center.
  - Ball continues and bounces from edge.

## Continous Integration

It is setup using GitHub Actions in `.github/workflows/lint.yml`

## Contribution

Feel free to [contribute](https://github.com/berkerol/battle-pong/issues) according to the [semistandard rules](https://github.com/Flet/semistandard) and [latest ECMAScript Specification](https://www.ecma-international.org/ecma-262).

## Distribution

You can distribute this software freely under [GNU GPL v3.0](https://github.com/berkerol/battle-pong/blob/master/LICENSE).
