// By Jasper Camber Holton. V0.0.205
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

var rng = new RNG(22);

function pythagorean(sideA, sideB){
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function send(text){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(text);
}
var id = document.getElementById("gameid").innerHTML;
var gameplay;
function read(){
  $.get( "https://uglek.com/game/" + id + "/play/", function( data ) {
    gameplay = data;
  });
}
function gameplayArray(){
  gameplay.split('/');
}

var ADHEIGHT = 90;
var less = window.innerWidth;
if(window.innerHeight < less){
  less = window.innerHeight-ADHEIGHT;
}

var last = 0;
var stage = new createjs.Stage("game156");
var container = new createjs.Container();
scale = container.scale = less/1000;  
background = new createjs.Shape();
background.graphics.beginFill("black").drawRect(0, 0, window.innerWidth, window.innerHeight);
stage.addChild(background);
stage.addChild(container);
var speedfactor = 50;

stage.canvas.width = window.innerWidth;
var canvasHeight = window.innerHeight-ADHEIGHT;
stage.canvas.height = canvasHeight;
leftbound = (window.innerWidth - less)/2/scale;
topbound = ((canvasHeight - less)/2)/scale;
green = new createjs.Shape();
green.graphics.beginFill("green").drawRect(leftbound, topbound, 1000, 1000);
  container.addChild(green);
  createjs.Touch.enable(stage);
  
  start = new createjs.Shape();
  start.graphics.beginFill("grey").drawRect(leftbound, topbound, 200, 100);
  start.x = 0;
  start.y = 0;
var ballplaced = false;
var pressmovestarted = false;
var movestartx;
var movestarty;
var playerball;
var hitx = 0;
var hity = 0;
var ballSize = 20;
  start.on("mousedown", function(evt) {
    if(!ballplaced){
      playerball = new createjs.Shape();
      playerball.graphics.beginFill("white").drawCircle(0, 0, ballSize);
      playerball.x = evt.stageX/scale;
      playerball.y = evt.stageY/scale;
      container.addChild(playerball);
      playerball.on("mousedown", function(evt) {
        pressmovestarted = true;
      });
      ballplaced = true;
    }
    else {
      playerball.x = evt.stageX/scale;
      playerball.y = evt.stageY/scale;
    }
  });
  container.addChild(start);
var line;
function drawLine(x,y,xx,yy){
   // Get a new 'shape' which comes with a 'graphics' property that allows us to draw
  container.removeChild(line);
            line = new createjs.Shape();

            // Add this line shape to the canvas
            container.addChild(line);

            // Set the 'brush stroke' style (basically the thickness of the line)
            //      Then start drawing a black line
            line.graphics.setStrokeStyle(4).beginStroke("rgba(0,0,0,1)");

            // Tell EaselJS where to go to start drawing the line
            line.graphics.moveTo(x, y);

            // Tell EaselJS where to draw the line to
            line.graphics.lineTo(xx, yy);
}

hole = new createjs.Shape();
      hole.graphics.beginFill("black").drawCircle(0, 0, ballSize+2);
      hole.x = leftbound + 800;
      hole.y = topbound + 900;
      container.addChild(hole)

var movefactor = 10;

var obstacles = [];
var obstacleSize = [];

for(var i = 0; i < 10; i++){
  obstacles[i] = new createjs.Shape();
  var size = (rng.nextFloat()*30 + 30);
  obstacleSize[i] = size;
      obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
      obstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
      obstacles[i].y = topbound + rng.nextFloat() * 400 + 200;
    obstacles[i].hitx = 0;
  obstacles[i].hity = 0;
      container.addChild(obstacles[i])
}

var fixedobstacles = [];
var fixedobstacleSize = [];
for(var i = 0; i < 7; i++){
  fixedobstacles[i] = new createjs.Shape();
  var size = (rng.nextFloat()*60 + 60);
  fixedobstacleSize[i] = size;
      fixedobstacles[i].graphics.beginFill("blue").drawRect(0, 0, size, size);
      fixedobstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
      fixedobstacles[i].y = topbound + rng.nextFloat() * 400 + 200;
    fixedobstacles[i].hitx = 0;
  fixedobstacles[i].hity = 0;
      container.addChild(fixedobstacles[i])
}
stage.on("stagemousedown", function(evt) {
          if(!pressmovestarted){
          movestartx = evt.stageX;
            movestarty = evt.stageY;
            pressmovestarted = true;
          }
      });
var maxhit = 15;
stage.on("stagemouseup", function(evt) {
          movex = movestartx - evt.stageX;
          movey = movestarty - evt.stageY;
        console.log("Move:");
              console.log(movex);
            console.log(movey);
  if(hitx == 0 && hity == 0){
          if(pythagorean(Math.abs(movex),Math.abs(movey)) > 5){
            hitx = movex/movefactor;
            hity = movey/movefactor;
            if(hitx > maxhit) {
              hitx = maxhit;
            }
            if(hity > maxhit) {
              hity = maxhit;
            }
            if(hitx < -maxhit) {
              hitx = -maxhit;
            }
            if(hity < -maxhit) {
              hity = -maxhit;
            }
          }
  }
  container.removeChild(line);
      pressmovestarted = false;
      });
stage.on("stagemousemove", function(evt) {
  if(pressmovestarted){
          movex = movestartx - evt.stageX;
          movey = movestarty - evt.stageY;
        if(hitx == 0 && hity == 0){
          drawLine(playerball.x,playerball.y,playerball.x + movex,playerball.y + movey);
        }
  }
      });
  
    //Update stage will render next frame
  stage.update();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
    hitx = hitx - hitx/speedfactor;
    hity = hity - hity/speedfactor;
    if(hitx > 0 && hitx < 0.1){
      hitx = 0;
    }
    if(hity > 0 && hity < 0.1){
      hity = 0;
    }
    if(hitx < 0 && hitx > -0.1){
      hitx = 0;
    }
    if(hity < 0 && hity > -0.1){
      hity = 0;
    }
    if(playerball){
    playerball.x = playerball.x + hitx;
    playerball.y = playerball.y + hity;
      if(playerball.x < leftbound + ballSize){
        hitx = -hitx;
      }
      if(playerball.y < topbound + ballSize){
        hity = -hity;
      }
      if(playerball.x > leftbound+1000-ballSize){
        hitx = -hitx;
      }
      if(playerball.y > topbound+1000-ballSize){
        hity = -hity;
      }
      if(pythagorean(Math.abs(playerball.x - hole.x),Math.abs(playerball.y - hole.y)) < ballSize * 1.5){
        container.removeChild(playerball);
      }
      for(var o = 0; o < obstacles.length; o++){
        var obs = obstacles[o];
        obs.x = obs.x + obs.hitx;
        obs.y = obs.y + obs.hity;
        obs.hitx = obs.hitx - obs.hitx/speedfactor;
        obs.hity = obs.hity - obs.hity/speedfactor;
        // If collided
        if(pythagorean(Math.abs(playerball.x - obstacles[o].x),Math.abs(playerball.y - obstacles[o].y)) < obstacleSize[o] + ballSize){
          let vCollision = {x: obs.x - playerball.x, y: obs.y - playerball.y};
          let distance = Math.sqrt((obs.x-playerball.x)*(obs.x-playerball.x) + (obs.y-playerball.y)*(obs.y-playerball.y));
          let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
          let vRelativeVelocity = {x: obs.hitx - playerball.hitx, y: obs.hity - playerball.hity};
          let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
          playerball.hitx -= (speed * vCollisionNorm.x);
          playerball.hity -= (speed * vCollisionNorm.y);
          obs.hitx += (speed * vCollisionNorm.x);
          obs.hity += (speed * vCollisionNorm.y);

          if(obs.hitx > 0 && obs.hitx < 0.1){
            obs.hitx = 0;
          }
          if(obs.hity > 0 && obs.hity < 0.1){
            obs.hity = 0;
          }
          if(obs.hitx < 0 && obs.hitx > -0.1){
            obs.hitx = 0;
          }
          if(obs.hity < 0 && obs.hity > -0.1){
            obs.hity = 0;
          }
          if(obs.x < leftbound + obstacleSize[o]){
            obs.hitx = -obs.hitx;
          }
          if(obs.y < topbound + obstacleSize[o]){
            obs.hity = -obs.hity;
          }
          if(obs.x > leftbound+1000-obstacleSize[o]){
            obs.hitx = -obs.hitx;
          }
          if(obs.y > topbound+1000-obstacleSize[o]){
            obs.hity = -obs.hity;
          }
        }
      }
      //for(var o = 0; o < fixedobstacles.length; o++){
      //  var obs = fixedobstacles[o];
      //}
    }
    stage.update();
  }
