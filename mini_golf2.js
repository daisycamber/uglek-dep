// By Jasper Camber Holton. V0.0.2033
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
var id = document.getElementById("gameid").innerHTML;
function send(text){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(text);
}

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
var canvasHeight = window.innerHeight-ADHEIGHT;
leftbound = (window.innerWidth - less)/2/scale;
topbound = ((canvasHeight - less)/2)/scale;

// Game Classes
class GameObject
{
    constructor (context, x, y, vx, vy){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
    }
}

class Square extends GameObject
{
    constructor (context, x, y, vx, vy){
        super(context, x, y, vx, vy);

        // Set default width and height
        this.width = 50;
        this.height = 50;
    }

    draw(){
        // Draw a simple square
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(secondsPassed){
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

class GameWorld {

    constructor(canvasId){
        this.canvas = null;
        this.context = null;
        this.oldTimeStamp = 0;
        this.gameObjects = [];
        this.resetCounter = 0;

        this.init(canvasId);
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.context.scale(less/1000,less/1000);
        this.canvas.width = window.innerWidth;
        this.canvas.height = canvasHeight;

        this.createWorld();

        // Request an animation frame for the first time
        // The gameLoop() function will be called as a callback of this request
        window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)});
    }

    createWorld() {
        this.gameObjects = [
            new Square(this.context, 250, 50, 0, 50, 1),
            new Square(this.context, 250, 300, 0, -50, 200),
            new Square(this.context, 200, 0, 50, 50, 1),
            new Square(this.context, 250, 150, 50, 50, 1),
            new Square(this.context, 300, 75, -50, 50, 1),
            new Square(this.context, 300, 300, 50, -50, 1)
        ];
    }

    gameLoop(timeStamp) {
        // Calculate how much time has passed
        var secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        // Loop over all game objects to update
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(secondsPassed);
        }

        this.detectCollisions();

        this.clearCanvas();

        // Loop over all game objects to draw
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        // The loop function has reached it's end
        // Keep requesting new frames
        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }

    detectCollisions() {
        var obj1;
        var obj2;

        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].isColliding = false;
        }

        for (var i = 0; i < this.gameObjects.length; i++)
        {
            obj1 = this.gameObjects[i];
            for (var j = i + 1; j < this.gameObjects.length; j++)
            {
                obj2 = this.gameObjects[j];

                if (this.rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;

                    var vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                    var distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                    var vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                    var vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                    var speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                    if (speed < 0) {
                        break;
                    }

                    var impulse = 2 * speed / (obj1.mass + obj2.mass);
                    obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                    obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                    obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                    obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
                }
            }
        }
    }

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {

        // Check x and y for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }

        return true;
    }

    clearCanvas() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.onload = function (){
      var gameWorld = new GameWorld("game156");
}



/*
var last = 0;
//var stage = new createjs.Stage("game156");
//var container = new createjs.Container();
scale = container.scale = less/1000;  
background = new createjs.Shape();
background.graphics.beginFill("black").drawRect(0, 0, window.innerWidth, window.innerHeight);
stage.addChild(background);
stage.addChild(container);
var speedfactor = 50;

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
        obs.hitx = obs.hitx - obs.hitx/100;
    obs.hity = obs.hity - obs.hity/speedfactor;
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
        if(pythagorean(Math.abs(playerball.x - obstacles[o].x),Math.abs(playerball.y - obstacles[o].y)) < obstacleSize[o] + ballSize){
            hitx = -hitx * 3/4;
            hity = -hity * 3/4;
            obs.hitx = -hitx*3/4;
            obs.hity = -hity*3/4;
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
      for(var o = 0; o < fixedobstacles.length; o++){
        var obs = fixedobstacles[o];
        if(playerball.x > fixedobstacles[o].x && playerball.x < fixedobstacles[o].x + fixedobstacleSize[o] && playerball.y > fixedobstacles[o].y && playerball.y < fixedobstacles[o].y + fixedobstacleSize[o]) {
          hitx = -hitx * 3/4;
          playerball.x = playerball.x + hitx;
        }
        if(playerball.y > fixedobstacles[o].y && playerball.y < fixedobstacles[o].y + fixedobstacleSize[o] && playerball.x > fixedobstacles[o].x && playerball.x < fixedobstacles[o].x + fixedobstacleSize[o]) {
          hity = -hity * 3/4;
          playerball.y = playerball.y + hity;
        }
        
      }
    }
    stage.update();
  }*/
