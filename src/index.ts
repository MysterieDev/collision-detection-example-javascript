import { field, playBall, speedUnit } from "./config";
import { canvas, ball } from "./dom-utils";

//INITIALIZE Everything
init();

function init() {
  createField();
  createPlayball();
  moveBallOnKeyboard();
}

function createField() {
  if (canvas && canvas.getContext) {
    canvas.width = field.width;
    canvas.height = field.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "LightSalmon";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}

function createPlayball() {
  if (ball && ball.getContext) {
    ball.width = playBall.width;
    ball.height = playBall.height;
    const ctx = ball.getContext("2d");
    if (ctx) {
      const ballRadius = ball.width / 2;
      ctx.beginPath();
      ctx.fillStyle = "blue";
      ctx.arc(ballRadius, ballRadius, ballRadius - 1, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      ball.style.left = `${ball.getBoundingClientRect().left.toString()}px`;
      ball.style.top = `${ball.getBoundingClientRect().top.toString()}px`;
    }
  }
}

function moveBallOnKeyboard() {
  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "KeyA":
        moveBall(BallDirections.Left);
        break;
      case "KeyW":
        moveBall(BallDirections.Up);
        break;
      case "KeyD":
        moveBall(BallDirections.Right);
        break;
      case "KeyS":
        moveBall(BallDirections.Down);
        break;
    }
  });
}

function moveBall(position: BallDirections) {
  if (!isInPlayfield(position)) {
    return;
  }
  const currentPositionLeft = parseInt(ball.style.left.slice(0, -2));
  const currentPositionTop = parseInt(ball.style.top.slice(0, -2));
  if (position === BallDirections.Left) {
    ball.style.left = `${currentPositionLeft - speedUnit}px`;
  }
  if (position === BallDirections.Right) {
    ball.style.left = `${currentPositionLeft + speedUnit}px`;
  }
  if (position === BallDirections.Down) {
    ball.style.top = `${currentPositionTop + speedUnit}px`;
  }
  if (position === BallDirections.Up) {
    ball.style.top = `${currentPositionTop - speedUnit}px`;
  }
}

function isInPlayfield(position: BallDirections) {
  const backgroundField = canvas.getBoundingClientRect();
  const playBall = ball.getBoundingClientRect();
  const hitsTop = playBall.top >= backgroundField.top;
  const hitsBottom = playBall.bottom <= backgroundField.bottom;
  const hitsLeft = playBall.left >= backgroundField.left;
  const hitsRight = playBall.right <= backgroundField.right;

  const collisionObject = {
    [BallDirections.Up]: hitsTop,
    [BallDirections.Down]: hitsBottom,
    [BallDirections.Left]: hitsLeft,
    [BallDirections.Right]: hitsRight,
  };
  return collisionObject[position];
}

enum BallDirections {
  Up = "top",
  Down = "bottom",
  Left = "left",
  Right = "right",
}
