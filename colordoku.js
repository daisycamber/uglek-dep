// By Jasper Camber Holton. V1.0.9
var seed = Math.floor(Math.random() * 100);
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

function pythagorean(sideA, sideB) {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}
var canvasid = "game197";
var canvas = document.getElementById(canvasid);
var width = canvas.width;
var height = canvas.height;

var ADHEIGHT = 90;
var less = width;
if(height < less){
  less = height-ADHEIGHT;
}

var TEXTTYPE = "bold " + 34 + "px Arial";
var last = 0;
var stage = new createjs.Stage(canvasid);
var container = new createjs.Container();
scale = container.scale = less/1000;
background = new createjs.Shape();
background.graphics.beginFill("#b0afb3").drawRect(0, 0, window.innerWidth, window.innerHeight); //
stage.addChild(background);
stage.addChild(container);
var speedfactor = 50;

//stage.canvas.width = window.innerWidth;
//var canvasHeight = window.innerHeight-ADHEIGHT;
//stage.canvas.height = canvasHeight;
leftbound = (width - less)/2/scale;
topbound = ((height - less)/2)/scale;

// red, orange, yellow, dark green, light green, dark blue, light blue, dark purple, punk
var colors = ["#f50521","#fa8907","#fafa07","#2e8008","#33f707","#214bcc","#07eef2","#9b5bf0","#ed05c3","white"];


var ballSize = 37;

var selectorBall = new createjs.Shape();
      selectorBall.graphics.beginFill("white").drawCircle(0, 0, ballSize + 7);
      selectorBall.x = leftbound + 100 + 800/20;
      selectorBall.y = topbound + 900 + 800/18/2;
      container.addChild(selectorBall)




selectedBall = 0;
var selectorBalls = [];
var text;
for(var i = 0; i < 10; i++){
      selectorBalls[i] = new createjs.Shape();
      selectorBalls[i].graphics.beginFill(colors[i]).drawCircle(0, 0, ballSize);
      selectorBalls[i].x = leftbound + 100+800/10 * i + 800/20;
      selectorBalls[i].y = topbound + 900 + 800/18/2;
      selectorBalls[i].index = i
      selectorBalls[i].on("mousedown", function(event) {
        selectorBall.x = event.target.x;
        selectedBall = event.target.index
      });
  if(i == 9){
    text =  new createjs.Text("\u21bb", TEXTTYPE, "#000000")
    text.x = selectorBalls[i].x - 10;
    text.y = selectorBalls[i].y - 10;
    
  }
      container.addChild(selectorBalls[i])
}
container.addChild(text);

// Sudoku game class
class Sudoku {
  constructor() {
        this.board = this.blank_board_array();
        this.ogboard = this.blank_board_array();
    }

    blank_board_array() {
        return [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];
    }

  // I can't figure out how to get this working with the "set" keyword, so making a method for now
    set_board(board_string) {
        if ( ! board_string.match(/^\d{81}$/m) ) {
            this.board = this.blank_board_array();
            return;
        }
        this.ogboard = []
        for ( let row = 0; row <= 8; row++ ) {
          this.ogboard[row] = []
            for ( let column = 0; column <= 8; column++ ) {
                this.board[row][column] = board_string.charAt(row*9+column);
                this.ogboard[row][column] = board_string.charAt(row*9+column);
            }
        }

        /*
        if ( ! this.puzzle_is_valid() ) {
            this.board = this.blank_board_array();
            return;
        }
        */
    }

    get_board_array() {
        return this.board;
    }
  
  get_cell(row,col){
    return this.board[row][col];
  }
  
  get_available_balls(){
    let balls = [];
    var ballCounts = [];
      for(let i = 0; i < 10; i++){
        ballCounts[i] = 0;
      }
        for(let x = 0; x < 9; x++){
          for(let y = 0; y < 9; y++) {
            ballCounts[this.board[x][y]]++;
          }
        }
    for(let i = 1; i < 10; i++){
        balls[i] = true;
        if(ballCounts[i] == 9){
          balls[i] = false;
        }
      }
    return balls;
  }

    make_move(row, col, value) {
      if(value == 10){
        value = 0;
      }
        this.board[row][col] = value;
        let willDropConfetti = true;
        for(let x = 0; x < 9; x++){
          for(let y = 0; y < 9; y++) {
            if(this.board[x][y] == 0){
              willDropConfetti = false;
            }
          }
        }
        if(willDropConfetti){
          dropConfetti();
        }
    }

    is_legal_move(row, col, value) {

      if(this.ogboard[row][col] > 0) {
        return false;
      }
      if(value == 10) {
        return true;
      }
      if(value == 10){
        value = 0;
      }

        // check for non numbers
      // weird that JS match function doesn't put quotes around regex
        // check row

        for ( let i = 0; i <= 8; i++ ) {
            if ( value == this.board[row][i] ) {
                return false;
            }
        }

        // check column
        for ( let i = 0; i <= 8; i++ ) {
            if ( value == this.board[i][col] ) {
                return false;
            }
        }
        // check 3x3 grid
        let row_offset = Math.floor(row/3)*3;
        let col_offset = Math.floor(col/3)*3;
        for ( let i = 0 + row_offset; i <= 2 + row_offset; i++ ) {
            for ( let j = 0 + col_offset; j <= 2 + col_offset; j++ ) {
                if ( value == this.board[i][j] ) {
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
line1.y = topbound + 100 + 645/3;
container.addChild(line1)

line2 = new createjs.Shape();
line2.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
line2.x = leftbound + 100 * 1;
line2.y = topbound + 582;
container.addChild(line2)

line3 = new createjs.Shape();
line3.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
line3.x = leftbound + 148 + 645/3;
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
let games = ["080100007000070960026900130000290304960000082502047000013009840097020000600003070",
"003020600900305001001806400008102900700000008006708200002609500800203009005010300",
"200080300060070084030500209000105408000000000402706000301007040720040060004010003",
"000000907000420180000705026100904000050000040000507009920108000034059000507000000",
"030050040008010500460000012070502080000603000040109030250000098001020600080060020",
"020810740700003100090002805009040087400208003160030200302700060005600008076051090",
"100920000524010000000000070050008102000000000402700090060000000000030945000071006",
"043080250600000000000001094900004070000608000010200003820500000000000005034090710",
"480006902002008001900370060840010200003704100001060049020085007700900600609200018",
"000900002050123400030000160908000000070000090000000205091000050007439020400007000",
"001900003900700160030005007050000009004302600200000070600100030042007006500006800",
"000125400008400000420800000030000095060902010510000060000003049000007200001298000",
"062340750100005600570000040000094800400000006005830000030000091006400007059083260",
"300000000005009000200504000020000700160000058704310600000890100000067080000005437",
"630000000000500008005674000000020000003401020000000345000007004080300902947100080",
"000020040008035000000070602031046970200000000000501203049000730000000010800004000",
"361025900080960010400000057008000471000603000259000800740000005020018060005470329",
"050807020600010090702540006070020301504000908103080070900076205060090003080103040",
"080005000000003457000070809060400903007010500408007020901020000842300000000100080",
"003502900000040000106000305900251008070408030800763001308000104000020000005104800",
"000000000009805100051907420290401065000000000140508093026709580005103600000000000",
"020030090000907000900208005004806500607000208003102900800605007000309000030020050",
"005000006070009020000500107804150000000803000000092805907006000030400010200000600",
"040000050001943600009000300600050002103000506800020007005000200002436700030000040",
"004000000000030002390700080400009001209801307600200008010008053900040000000000800",
"360020089000361000000000000803000602400603007607000108000000000000418000970030014",
"500400060009000800640020000000001008208000501700500000000090084003000600060003002",
"007256400400000005010030060000508000008060200000107000030070090200000004006312700",
"000000000079050180800000007007306800450708096003502700700000005016030420000000000",
"030000080009000500007509200700105008020090030900402001004207100002000800070000090",
"200170603050000100000006079000040700000801000009050000310400000005000060906037002",
"000000080800701040040020030374000900000030000005000321010060050050802006080000000",
"000000085000210009960080100500800016000000000890006007009070052300054000480000000",
"608070502050608070002000300500090006040302050800050003005000200010704090409060701",
"050010040107000602000905000208030501040070020901080406000401000304000709020060010",
"053000790009753400100000002090080010000907000080030070500000003007641200061000940",
"006080300049070250000405000600317004007000800100826009000702000075040190003090600",
"005080700700204005320000084060105040008000500070803010450000091600508007003010600",
"000900800128006400070800060800430007500000009600079008090004010003600284001007000",
"000080000270000054095000810009806400020403060006905100017000620460000038000090000",
"000602000400050001085010620038206710000000000019407350026040530900020007000809000",
"000900002050123400030000160908000000070000090000000205091000050007439020400007000",
"380000000000400785009020300060090000800302009000040070001070500495006000000000092",
"000158000002060800030000040027030510000000000046080790050000080004070100000325000",
"010500200900001000002008030500030007008000500600080004040100700000700006003004050",
"080000040000469000400000007005904600070608030008502100900000005000781000060000010",
"904200007010000000000706500000800090020904060040002000001607000000000030300005702",
"000700800006000031040002000024070000010030080000060290000800070860000500002006000",
"001007090590080001030000080000005800050060020004100000080000030100020079020700400",
"000003017015009008060000000100007000009000200000500004000000020500600340340200000"]
let import_string = games[rng.nextRange(0,49)];
game1.set_board(import_string);
let sudoku_squares = createArray(9,9);

var balls = [];
for(var i = 0; i < 9; i++){
  balls[i] = [];
  for(var j = 0; j < 9; j++){
      balls[i][j] = new createjs.Shape();
      balls[i][j].graphics.beginFill("white").drawCircle(0, 0, ballSize); //
      balls[i][j].x = leftbound + 100+800/9 * i + 800/18;
      balls[i][j].y = topbound + 50+800/9 * j + 800/18;
      balls[i][j].row = j;
      balls[i][j].col = i;
      balls[i][j].on("mousedown", function(evt) {
        console.log("Click")
        console.log("Row:" + evt.target.row)
        console.log("Col:" + evt.target.col)
        console.log(game1.get_board_array()[evt.target.row][evt.target.col])
        console.log("Selected ball: " + selectedBall)
        console.log("Value: " + (selectedBall + 1))
        if (!game1.is_legal_move(evt.target.row, evt.target.col, selectedBall + 1)) {
          evt.target.graphics.beginFill("grey").drawCircle(0, 0, ballSize);
          if(game1.get_board_array()[evt.target.row][evt.target.col] > 0){
            setTimeout(() => {  evt.target.graphics.beginFill(colors[game1.get_cell(evt.target.row, evt.target.col) - 1]).drawCircle(0, 0, ballSize); }, 2000);
          } else {
            setTimeout(() => {  evt.target.graphics.beginFill("white").drawCircle(0, 0, ballSize); }, 1000);
          }

        } else {
            game1.make_move(evt.target.row, evt.target.col, selectedBall + 1);
            evt.target.graphics.beginFill(colors[selectedBall]).drawCircle(0, 0, ballSize);
          var balls = game1.get_available_balls();
          for(var i = 1; i < 10; i++){
            if(!balls[i]){
              selectorBalls[i-1].alpha = 0.3;//graphics.beginFill("grey").drawCircle(0,0,ballSize);
            }
            else {
              selectorBalls[i-1].alpha = 1;
            }
          }
        }
      });
      container.addChild(balls[i][j])

    }
}
function print_sudoku_to_webpage(sudoku_object) {
    let board = sudoku_object.get_board_array();
    for ( let row = 0; row <= 8; row++ ) {
        for ( let col = 0; col <= 8; col++ ) {
            if ( board[row][col] != 0 ) {
                let input = balls[col][row];
                input.graphics.beginFill(colors[board[row][col]-1]).drawCircle(0, 0, ballSize);
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
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}





COLORS = ["Red","Orange","Yellow","Green","Blue","Purple"];
var confettiCount = 60;
var confetti = [];
var confettivx = [];
var confettivy = [];
var confettiv = 4;
var confettimin = -600;
function drawConfetti(){
  for(i = 0; i < confettiCount; i++){
    confetti[i] = new createjs.Shape();
    confetti[i].graphics.beginFill(COLORS[0,rng.nextRange(0,COLORS.length)]).drawCircle(0, 0, rng.nextRange(10,20));
    confetti[i].x = rng.nextRange(0,window.innerWidth);
    confetti[i].y = rng.nextRange(window.innerHeight + 30);
    confetti[i].visible = false;
    confettivx[i] = rng.nextRange(-1,1)/5.0;
    confettivy[i] = rng.nextRange(-1,1)/5.0;
    stage.addChild(confetti[i]);
  }
}

function dropConfetti(){
  droppedConfetti = false;
  for(i = 0; i < confettiCount; i++){
    confetti[i].visible = true;
    confetti[i].y = rng.nextRange(confettimin,-20);
    confetti[i].x = rng.nextRange(0,window.innerWidth);
    confettivx[i] = rng.nextRange(-3,3)
    confettivy[i] = rng.nextRange(-3,3)/3.0;
  }
}

drawConfetti();


//Update stage will render next frame

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", stage);
createjs.Ticker.addEventListener("tick", handleTick);

var droppedConfetti = false;

function handleTick(event) {
if(!droppedConfetti){
  dropped = true;
  for(i = 0; i < confettiCount; i++){
    if(confetti[i].y < window.innerHeight + 20){
      confetti[i].x = confetti[i].x + confettivx[i]
      confetti[i].y = confetti[i].y + confettivy[i] + confettiv
      dropped = false;
    } else {
      confetti[i].visible = false;
    }
  }
  if(dropped){
    droppedConfetti = true;
  }
}
stage.update();
}

stage.update();

dropConfetti();
