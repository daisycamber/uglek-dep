// By Jasper Camber Holton. V0.0.17
function pythagorean(sideA, sideB){
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}
var ADHEIGHT = 90;
var less = window.innerWidth;
if(window.innerHeight < less){
  less = window.innerHeight-ADHEIGHT;
}
var id = document.getElementById("gameid").innerHTML;
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
  /*stage.on("stagemousedown", function(evt) {
    playerball = new createjs.Shape();
    playerball.graphics.beginFill("red").drawCircle(0, 0, 20);
    playerball.x = evt.x
    
    console.log("https://uglek.com/game/" + id + "/post/")
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send("put 90 50");
  });*/
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
      hole.x = 800;
      hole.y = 900;
      container.addChild(hole)

var movefactor = 10;

var obstacles = [];
var obstacleSize = [];
for(var i = 0; i < 30; i++){
  obstacles[i] = new createjs.Shape();
  var size = (Math.random()*30 + 30);
  obstacleSize[i] = size;
      obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
      obstacles[i].x = leftbound + Math.random() * 1000;
      obstacles[i].y = topbound + Math.random() * 500 + 200;
    obstacles[i].hitx = 0;
  obstacles[i].hity = 0;
      container.addChild(obstacles[i])
}
stage.on("stagemousedown", function(evt) {
          if(!pressmovestarted){
          movestartx = evt.stageX;
            movestarty = evt.stageY;
            pressmovestarted = true;
          }
      });
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
            if(hitx > 10) {
              hitx = 10;
            }
            if(hity > 10) {
              hity = 10;
            }
            if(hitx < -10) {
              hitx = -10;
            }
            if(hity < -10) {
              hity = -10;
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
      }
    }
    stage.update();
  }
