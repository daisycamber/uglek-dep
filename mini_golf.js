
  var id = document.getElementById("gameid").innerHTML;
  var last = 0;
  var stage = new createjs.Stage("game156");
  stage.canvas.height = window.innerHeight - 54;
  green = new createjs.Shape();
  green.graphics.beginFill("green").drawRect(0, 0, window.innerWidth, window.innerHeight);
  stage.addChild(green);
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
  start.graphics.beginFill("grey").drawRect(0, 0, 100, 50);
  start.x = 0;
  start.y = 0;
var ballplaced = false;
var pressmovestarted = false;
var movestartx;
var movestarty;
  start.on("mousedown", function(evt) {
    if(!ballplaced){
      playerball = new createjs.Shape();
      playerball.graphics.beginFill("white").drawCircle(0, 0, 5);
      playerball.x = evt.stageX;
      playerball.y = evt.stageY;
      playerball.on("pressmove", function(evt) {
        if(!pressmovestarted){
          movestartx = evt.stageX;
          movestarty = evt.stageY;
        }
      });
      playerball.on("pressup", function(evt) {
          movex = movestartx - evt.stageX;
          movey = movestartx - evt.stageY;
          playerball.x = playerball.x + movex;
          playerball.y = playerball.y + movex;
        pressmovestarted = false;
      });
      stage.addChild(playerball)
      ballplaced = true;
    }
    else {
      playerball.x = evt.stageX;
      playerball.y = evt.stageY;
    }
  });
  stage.addChild(start);
  
    //Update stage will render next frame
  stage.update();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
    stage.update();
  }
