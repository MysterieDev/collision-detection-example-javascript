import { field, playBall, speedUnit } from "./config";
import { canvas, ball } from "./dom-utils";

//INITIALIZE Everything with the init function
init();

/**
 * This function has all relevant methods, to ensure that the program works
 */
function init() {
  createField();
  createPlayball();
  moveBallOnKeyboard();
}

/**
 * this method creates the field in which the ball will move
 */
function createField() {
  //first check if the DOM-reference is valid, then if the function get context is available
  if (canvas && canvas.getContext) {
    //set the dimensions of the canvas according to our config object
    canvas.width = field.width;
    canvas.height = field.height;

    //draw the canvas element
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "LightSalmon";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}

function createPlayball() {
  //first check if the DOM-reference is valid, then if the function get context is available
  if (ball && ball.getContext) {
    // set dimensions of the canvas
    ball.width = playBall.width;
    ball.height = playBall.height;
    //draw the canvas element
    const ctx = ball.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = playBall.color;
      ctx.arc(
        playBall.radius,
        playBall.radius,
        playBall.radius - 1,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.fill();
      // set the css values according to the computed Viewport values
      ball.style.left = `${ball.getBoundingClientRect().left.toString()}px`;
      ball.style.top = `${ball.getBoundingClientRect().top.toString()}px`;
    }
  }
}

/**
 * This method initializes a listener for Keyboard Events
 */
function moveBallOnKeyboard() {
  document.addEventListener("keydown", (event) => {
    // our controls will be W,A,S,D to move around
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
  // get values as string unit (with pixel) eg. 10px, slice the 'px' and parse to Int
  const currentPositionLeft = parseInt(ball.style.left.slice(0, -2));
  const currentPositionTop = parseInt(ball.style.top.slice(0, -2));

  //check which direction the user wants the ball to go, then move by adding or subtracting pixels
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

//Checks if the ball is still within the field -- returns a boolean
function isInPlayfield(position: BallDirections) {
  // get Viewport references of DOM-Elements to get the  current positions with getBoundingClientRect
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  const backgroundField = canvas.getBoundingClientRect();
  const playBall = ball.getBoundingClientRect();
  //check if the ball will hit the edge of one dimension
  const hitsTop = playBall.top >= backgroundField.top;
  const hitsBottom = playBall.bottom <= backgroundField.bottom;
  const hitsLeft = playBall.left >= backgroundField.left;
  const hitsRight = playBall.right <= backgroundField.right;

  //create an object with the keys of our enum
  const collisionObject = {
    [BallDirections.Up]: hitsTop,
    [BallDirections.Down]: hitsBottom,
    [BallDirections.Left]: hitsLeft,
    [BallDirections.Right]: hitsRight,
  };
  //only return the boolean for the direction, that the user wants to move
  //that makes it possible to move up and down the edge of the field but not out of the field
  return collisionObject[position];
}

enum BallDirections {
  Up = "top",
  Down = "bottom",
  Left = "left",
  Right = "right",
}
