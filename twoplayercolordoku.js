// By Jasper Camber Holton. V0.0.53
var seed = Math.floor(Math.random() * 5000);

function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;
  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}
var rng = new RNG(seed);

var id;
var player1;
var player2;
var user;
try {
  id = document.getElementById("gameid").innerHTML;
  player1 = document.getElementById("player1").innerHTML;
  player2 = document.getElementById("player2").innerHTML;
  user = document.getElementById("user").innerHTML;
} catch {
  console.log("No game")
}

var gameplay;

function send(text){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(text);
}




var currentTurn = 0;
function readCallback(){
  gp = gameplay;
  console.log("Read callback");
      for(var i = currentTurn; i < gp.length; i++){
        sp = gp[i].split(",");
        //if(sp[3] == user){
          //currentTurn = i+1;
          //console.log("Player turn syndicated");
        //} else
        if(sp[0] == "start"){
          newGame(parseInt(sp[1]));
          //container.removeChild(difficultyContainer);
          currentTurn = i+1;
          console.log("Start command");
        } else if(sp[0] == "set"){
          playTurn(parseInt(sp[1]),parseInt(sp[2]), parseInt(sp[3]))
          currentTurn = i+1;
          console.log("Set command");
        }
      }
}


var playerTurn = false;


function read(){
  const Http = new XMLHttpRequest();
  const url="https://uglek.com/game/" + id + "/play/";
  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange = (e) => {
    gameplay = Http.responseText.split("/");
    readCallback();
  }
}
function gameplayArray(){
  gameplay.split('/');
}

var canvasid = "game198";
var canvas = document.getElementById(canvasid);
var width = canvas.width;
var height = canvas.height;


/*
var ADHEIGHT = 90;
var less = width;
if (height < less) {
  less = height - ADHEIGHT;
}*/
var TEXTTYPE = "bold " + 42 + "px Arial";
var last = 0;
var stage = new createjs.Stage(canvasid);
var container = new createjs.Container();

background = new createjs.Shape();
background.graphics.beginFill("#b0afb3").drawRect(0, 0, window.innerWidth, window.innerHeight); //
stage.addChild(background);
stage.addChild(container);

var ADHEIGHT = 90;
var less = window.innerWidth;
if(window.innerHeight < less){
  less = window.innerHeight-ADHEIGHT;
}
scale = container.scale = less / 1000;

stage.canvas.width = window.innerWidth;
var canvasHeight = window.innerHeight-ADHEIGHT;
stage.canvas.height = canvasHeight;
leftbound = (window.innerWidth - less)/2/scale;
topbound = ((canvasHeight - less)/2)/scale;

//leftbound = (width - less) / 2 / scale;
//topbound = ((height - less) / 2) / scale;
// red, orange, yellow, dark green, light green, dark blue, light blue, dark purple, pink
var colors = ["#f50521", "#fa8907", "#fafa07", "#2e8008", "#33f707", "#214bcc", "#07eef2", "#9b5bf0", "#fa75e6", "grey"];
var selectorBallOffset = 5;
var ballSize = 37;
var selectorBall = new createjs.Shape();
selectorBall.graphics.beginFill("white").drawCircle(0, 0, ballSize + 7);
selectorBall.x = leftbound + 100 + 800 / 20 + selectorBallOffset;
selectorBall.y = topbound + 900 + 800 / 18 / 2;
container.addChild(selectorBall)
var selectedBall = 0;
var selectorBalls = [];
var text;
var text2;
var hints = 0;
for (var i = 0; i < 10; i++) {
  selectorBalls[i] = new createjs.Shape();
  selectorBalls[i].graphics.beginFill(colors[i]).drawCircle(0, 0, ballSize);
  selectorBalls[i].x = leftbound + 100 + 800 / 10 * i + 800 / 20 + selectorBallOffset;
  selectorBalls[i].y = topbound + 900 + 800 / 18 / 2;
  selectorBalls[i].index = i
  selectorBalls[i].on("mousedown", function(event) {
    var availableBalls = game1.get_available_balls();
    if(availableBalls[event.target.index + 1] || (hints > 0 && event.target.index == 9)){
      selectorBall.x = event.target.x;
      selectedBall = event.target.index
    }
  });
  if (i == 9) {
    //text = new createjs.Text("\u21ba", TEXTTYPE, "#000000")
    text2 = new createjs.Text("?", TEXTTYPE, "#000000")
    text2.x = selectorBalls[i].x - 13;
    text2.y = selectorBalls[i].y - 20;
  }
  container.addChild(selectorBalls[i])
}
container.addChild(text2)

// Sudoku game class
class Sudoku {
  constructor() {
    this.board = this.blank_board_array();
    this.ogboard = this.blank_board_array();
  }
  blank_board_array() {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }
  // I can't figure out how to get this working with the "set" keyword, so making a method for now
  set_board(board_string, completed_board_string) {
    this.board = this.blank_board_array();
    this.completedboard = this.blank_board_array();
    this.ogboard = this.blank_board_array();
    for (let row = 0; row <= 8; row++) {
      for (let column = 0; column <= 8; column++) {
        this.completedboard[row][column] = completed_board_string.charAt(row * 9 + column);
        this.board[row][column] = board_string.charAt(row * 9 + column);
        this.ogboard[row][column] = board_string.charAt(row * 9 + column);
      }
    }
  }

  get_board_array() {
    return this.board;
  }

  get_cell(row, col) {
    return this.board[row][col];
  }

  get_completed_cell(row, col) {
    return this.completedboard[row][col];
  }

  get_available_balls() {
    let balls = [];
    var ballCounts = [];
    for (let i = 0; i < 10; i++) {
      ballCounts[i] = 0;
    }
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        ballCounts[this.board[x][y]]++;
      }
    }
    for (let i = 1; i < 10; i++) {
      balls[i] = true;
      if (ballCounts[i] == 9) {
        balls[i] = false;
      }
    }
    return balls;
  }

  make_move(row, col, value) {
    this.board[row][col] = value;
    let willDropConfetti = true;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (this.board[x][y] == 0) {
          willDropConfetti = false;
        }
      }
    }
    if (willDropConfetti && !isFinished) {
      isFinished = true;
      wonGame();
      dropConfetti();
    }
  }

  is_legal_move(row, col, value) {

    if (this.ogboard[row][col] > 0) {
      return false;
    }
    if (value == 10) {
      return true;
    }

    if (this.completedboard[row][col] == value) {
      return true;
    }
    return false;

    // check for non numbers
    // weird that JS match function doesn't put quotes around regex
    // check row

    for (let i = 0; i <= 8; i++) {
      if (value == this.board[row][i]) {
        return false;
      }
    }

    // check column
    for (let i = 0; i <= 8; i++) {
      if (value == this.board[i][col]) {
        return false;
      }
    }
    // check 3x3 grid
    let row_offset = Math.floor(row / 3) * 3;
    let col_offset = Math.floor(col / 3) * 3;
    for (let i = 0 + row_offset; i <= 2 + row_offset; i++) {
      for (let j = 0 + col_offset; j <= 2 + col_offset; j++) {
        if (value == this.board[i][j]) {
          return false;
        }
      }
    }


    return true;
  }
};

line1 = new createjs.Shape();
line1.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
line1.x = leftbound + 100 * 1;
line1.y = topbound + 100 + 645 / 3;
container.addChild(line1)

line2 = new createjs.Shape();
line2.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
line2.x = leftbound + 100 * 1;
line2.y = topbound + 582;
container.addChild(line2)

line3 = new createjs.Shape();
line3.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
line3.x = leftbound + 148 + 645 / 3;
line3.y = topbound + 50;
container.addChild(line3)

line4 = new createjs.Shape();
line4.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
line4.x = leftbound + 630;
line4.y = topbound + 50;
container.addChild(line4)
line5 = new createjs.Shape();
line5.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
line5.x = leftbound + 100 * 1;
line5.y = topbound + 50;
container.addChild(line5)

line8 = new createjs.Shape();
line8.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
line8.x = leftbound + 100 * 1 + 800;
line8.y = topbound + 50;
container.addChild(line8)

line6 = new createjs.Shape();
line6.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
line6.x = leftbound + 100;
line6.y = topbound + 50;
container.addChild(line6)

line7 = new createjs.Shape();
line7.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
line7.x = leftbound + 100;
line7.y = topbound + 50 + 800;
container.addChild(line7)

let game1 = new Sudoku();

let rand = rng.nextRange(0, 399);
let import_string = games[rand * 2];
let completed_import_string = games[rand * 2 + 1];
game1.set_board(completed_import_string, completed_import_string);
let sudoku_squares = createArray(9, 9);
var balls = [];
for (var i = 0; i < 9; i++) {
  balls[i] = [];
  for (var j = 0; j < 9; j++) {
    balls[i][j] = new createjs.Shape();
    balls[i][j].graphics.beginFill("white").drawCircle(0, 0, ballSize); //
    balls[i][j].x = leftbound + 100 + 800 / 9 * i + 800 / 18;
    balls[i][j].y = topbound + 50 + 800 / 9 * j + 800 / 18;
    balls[i][j].row = j;
    balls[i][j].col = i;
    balls[i][j].on("mousedown", function(evt) {
      if (!game1.is_legal_move(evt.target.row, evt.target.col, selectedBall + 1)) {
        evt.target.graphics.beginFill("grey").drawCircle(0, 0, ballSize);
        if (game1.get_board_array()[evt.target.row][evt.target.col] > 0) {
          setTimeout(() => {
            evt.target.graphics.beginFill(colors[game1.get_cell(evt.target.row, evt.target.col) - 1]).drawCircle(0, 0, ballSize);
          }, 2000);
        } else {
          setTimeout(() => {
            evt.target.graphics.beginFill("white").drawCircle(0, 0, ballSize);
          }, 1000);
        }
      } else {
        if (selectedBall != 9) {
          game1.make_move(evt.target.row, evt.target.col, selectedBall + 1);
          evt.target.graphics.beginFill(colors[selectedBall]).drawCircle(0, 0, ballSize);
          send("set,"+evt.target.row+","+evt.target.col+","+selectedBall)
        } else if (hints > 0) {
          game1.make_move(evt.target.row, evt.target.col, game1.get_completed_cell(evt.target.row, evt.target.col));
          evt.target.graphics.beginFill(colors[game1.get_completed_cell(evt.target.row, evt.target.col) - 1]).drawCircle(0, 0, ballSize);
          send("set,"+evt.target.row+","+evt.target.col+","+selectedBall)
          hints = hints - 1;
          if (hints == 0) {
            selectorBalls[selectedBall].alpha = 0.3;
            var availableBalls = game1.get_available_balls();
            if(!availableBalls[selectedBall+1]){
              for (var i = 1; i < 10; i++) {
                if(availableBalls[i]){
                  selectedBall = i-1
                  selectorBall.x = selectorBalls[selectedBall].x
                  break;
                }
              }
            }
          }
        } else if (hints == 0) {
          evt.target.graphics.beginFill("grey").drawCircle(0, 0, ballSize);
          if (game1.get_board_array()[evt.target.row][evt.target.col] > 0) {
            setTimeout(() => {
              evt.target.graphics.beginFill(colors[game1.get_cell(evt.target.row, evt.target.col) - 1]).drawCircle(0, 0, ballSize);
            }, 2000);
          } else {
            setTimeout(() => {
              evt.target.graphics.beginFill("white").drawCircle(0, 0, ballSize);
            }, 1000);
          }
        }
      }
      var availableBalls = game1.get_available_balls();
      for (var i = 1; i < 10; i++) {
        if (!availableBalls[i]) {
          selectorBalls[i - 1].alpha = 0.3; //graphics.beginFill("grey").drawCircle(0,0,ballSize);
        } else {
          selectorBalls[i - 1].alpha = 1;
        }
      }
      if(selectedBall < 9 && !availableBalls[selectedBall+1]){
        for (var i = 1; i < 10; i++) {
          if(availableBalls[i]){
            selectedBall = i-1
            selectorBall.x = selectorBalls[selectedBall].x
            break;
          }
        }
      }
    });
    container.addChild(balls[i][j])

  }
}

function playTurn(col,row,selBall){
  target = balls[col][row];
  if (selBall != 9) {
    game1.make_move(row, col, selBall + 1);
    target.graphics.beginFill(colors[selBall]).drawCircle(0, 0, ballSize);
  } else if (hints > 0) {
    game1.make_move(row, col, game1.get_completed_cell(row, col));
    target.graphics.beginFill(colors[game1.get_completed_cell(row, col) - 1]).drawCircle(0, 0, ballSize);
    hints = hints - 1;
    if (hints == 0) {
      selectorBalls[selBall].alpha = 0.3;
      var availableBalls = game1.get_available_balls();
      if(!availableBalls[selBall+1]){
        for (var i = 1; i < 10; i++) {
          if(availableBalls[i]){
            selBall = i-1
            selectorBall.x = selectorBalls[selBall].x
            break;
          }
        }
      }
    }
  } else if (hints == 0) {
    target.graphics.beginFill("grey").drawCircle(0, 0, ballSize);
    if (game1.get_board_array()[row][col] > 0) {
      setTimeout(() => {
        target.graphics.beginFill(colors[game1.get_cell(row, col) - 1]).drawCircle(0, 0, ballSize);
      }, 2000);
    } else {
      setTimeout(() => {
        target.graphics.beginFill("white").drawCircle(0, 0, ballSize);
      }, 1000);
    }
  }
  var availableBalls = game1.get_available_balls();
  for (var i = 1; i < 10; i++) {
    if (!availableBalls[i]) {
      selectorBalls[i - 1].alpha = 0.3; //graphics.beginFill("grey").drawCircle(0,0,ballSize);
    } else {
      selectorBalls[i - 1].alpha = 1;
    }
  }
  if(selBall < 9 && !availableBalls[selBall+1]){
    for (var i = 1; i < 10; i++) {
      if(availableBalls[i]){
        selectedBall = i-1
        selectorBall.x = selectorBalls[selectedBall].x
        break;
      }
    }
  }
}

function print_sudoku_to_webpage(sudoku_object) {
  let board = sudoku_object.get_board_array();
  for (let row = 0; row <= 8; row++) {
    for (let col = 0; col <= 8; col++) {
      let input = balls[col][row];
      if (board[row][col] != 0) {
        input.graphics.beginFill(colors[board[row][col] - 1]).drawCircle(0, 0, ballSize);
      } else {
        input.graphics.beginFill("white").drawCircle(0, 0, ballSize);
      }
    }
  }
}
print_sudoku_to_webpage(game1)

// This code is borrowed from another website. Thanks google.
function createArray(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }
  return arr;
}

COLORS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
var confettiCount = 60;
var confetti = [];
var confettivx = [];
var confettivy = [];
var confettiv = 4;
var confettimin = -600;

function drawConfetti() {
  for (i = 0; i < confettiCount; i++) {
    confetti[i] = new createjs.Shape();
    confetti[i].graphics.beginFill(COLORS[0, rng.nextRange(0, COLORS.length)]).drawCircle(0, 0, rng.nextRange(7, 15));
    confetti[i].x = rng.nextRange(0, window.innerWidth);
    confetti[i].y = rng.nextRange(window.innerHeight + 30);
    confetti[i].visible = false;
    confettivx[i] = rng.nextRange(-1, 1) / 5.0;
    confettivy[i] = rng.nextRange(-1, 1) / 5.0;
    stage.addChild(confetti[i]);
  }
}

function dropConfetti() {
  droppedConfetti = false;
  for (i = 0; i < confettiCount; i++) {
    confetti[i].visible = true;
    confetti[i].y = rng.nextRange(confettimin, -20);
    confetti[i].x = rng.nextRange(0, width);
    confettivx[i] = rng.nextRange(-3, 3) / 7.0;
    confettivy[i] = rng.nextRange(-3, 3) / 3.0;
  }
}

drawConfetti();

//Update stage will render next frame

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", stage);
createjs.Ticker.addEventListener("tick", handleTick);

var droppedConfetti = false;

function handleTick(event) {
  if (!droppedConfetti) {
    dropped = true;
    for (i = 0; i < confettiCount; i++) {
      if (confetti[i].y < window.innerHeight + 20) {
        confetti[i].x = confetti[i].x + confettivx[i]
        confetti[i].y = confetti[i].y + confettivy[i] + confettiv
        dropped = false;
      } else {
        confetti[i].visible = false;
      }
    }
    if (dropped) {
      droppedConfetti = true;
    }
  }
  stage.update();
}

var gamesfactor = 4*2; // gamesFactor is number of games / 400 (1600 games gamesFactor is 4)
function newGame(difficulty) {
  // New game
  selectedBall = 0
  selectorBall.x = selectorBalls[selectedBall].x
  //var d = difficulty * gamesfactor * 100 + 100*gamesfactor;
  //var rand = rng.nextRange(d - 100*gamesfactor, d);
  let import_string = games[difficulty * 2];
  let completed_import_string = games[difficulty * 2 + 1];
  game1.set_board(import_string, completed_import_string);
  print_sudoku_to_webpage(game1);
  var availableBalls = game1.get_available_balls();
  selectorBalls[9].alpha = 1;
  hints = 3;
  for (var i = 1; i < 10; i++) {
    if (!availableBalls[i]) {
      selectorBalls[i - 1].alpha = 0.3; //graphics.beginFill("grey").drawCircle(0,0,ballSize);
    } else {
      selectorBalls[i - 1].alpha = 1;
    }
  }
  if(!availableBalls[selectedBall+1]){
    for (var i = 1; i < 10; i++) {
      if(availableBalls[i]){
        selectedBall = i-1
        selectorBall.x = selectorBalls[selectedBall].x
        break;
      }
    }
  }
}

var difficultyColors = ["#bafa25", "#e4f218", "#faa537", "#c70808"];
var difficultyNames = ["Easy", "Medium", "Difficult", "Expert"]; //["Simple", "Easy", "Intermed.", "Expert"];

var difficultyContainer;

function drawDifficultySelector() {
  difficultyContainer = new createjs.Container();
  var difficulties = [];
  var diffText = [];
  for (var i = 0; i < difficultyColors.length; i++) {
    difficulties[i] = new createjs.Shape();
    difficulties[i].graphics.beginFill(difficultyColors[i]).drawCircle(0, 0, 110);
    difficulties[i].x = leftbound + 1000 / 4.0 * (i) + 125;
    difficulties[i].y = topbound + 1000 / 2.0;
    difficulties[i].diff = i;
    diffText[i] = new createjs.Text(difficultyNames[i], TEXTTYPE, "#000000")
    diffText[i].x = leftbound + 1000 / 4.0 * (i) + 125;
    diffText[i].y = topbound + 1000 / 2.0 - 20;
    diffText[i].textAlign = 'center';
    difficultyContainer.addChild(difficulties[i]);
    difficultyContainer.addChild(diffText[i]);
    difficulties[i].on("mousedown", function(event) {
      var d = event.target.diff * gamesfactor * 100 + 100*gamesfactor;
      var rand = rng.nextRange(d - 100*gamesfactor, d);
      newGame(rand);
      send("start,"+rand);
      container.removeChild(difficultyContainer);
    });
  }
  container.addChild(difficultyContainer);
}

var wonContainer;
var wonDialog;
var isFinished = false;
// Draw a dialog to create a new game
function wonGame() {
  wonContainer = new createjs.Container();
  wonDialog = new createjs.Shape();
  wonDialog.graphics.beginFill(colors[0]).drawCircle(0, 0, 1000);
  wonDialog.y = topbound + 1000 + 900;
  wonDialog.x = leftbound + 500;
  var wonText = new createjs.Text("You won! (Tap)", TEXTTYPE, "#000000")
  wonText.x = leftbound + 360;
  wonText.y = topbound + 925;
  wonContainer.on("mousedown", function(event) {
    container.removeChild(wonContainer);
    if(user == player1){
      drawDifficultySelector();
    }
    isFinished = false;
  });
  wonContainer.addChild(wonDialog);
  wonContainer.addChild(wonText);
  container.addChild(wonContainer);

}
if(user == player1){
  drawDifficultySelector();
}
var ticks = 0;

/*function handleTick(event) {
  if(ticks > 5*60){
    ticks = 0;
    read();
    console.log("Reading");
  }
  stage.update();
}*/

const interval = setInterval(function() {
    read();
    console.log("Reading");
    stage.update();
 }, 5000);

//createjs.Ticker.addEventListener("tick", handleTick);



stage.update();

//dropConfetti();
//wonGame();
