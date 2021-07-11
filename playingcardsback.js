  // By Jasper Camber Holton. V1.2.811
(function drawCard(){
  let canvasid = "card";
  let canvas = document.getElementById(canvasid);
  let width = canvas.width;
  let height = canvas.height;
  let TEXTTYPE = "bold " + 210 + "px Arial";
  let last = 0;
  let stage = new createjs.Stage(canvasid);

 var size = 512;
  var logox = 250/2;
  var logoy = 350/2;

    let colors = ["#f50521", "#fa8907", "#fafa07", "#2e8008", "#33f707", "#214bcc", "#07eef2", "#9b5bf0", "#fa75e6"];
    var mul = 1.2 * 250/500;
    let logoSize = 90 * mul;
    let ballSize = 50 * mul;
    var logo = [];
var radius = 30;
    var card = new createjs.Shape();
    card.graphics.beginFill("white").drawRoundRectComplex(0,0 , 250, 350, radius, radius, radius, radius);
    stage.addChild(card)

    var logo = [];

for(var i = 0; i < colors.length; i++){
    logo[i] = new createjs.Shape();
    console.log(colors[i])
    logo[i].graphics.beginFill(colors[i]).drawCircle(0, 0, ballSize);
    logo[i].x = logox + Math.cos(40 * i * Math.PI/180) * logoSize;
    logo[i].y = logoy + Math.sin(40 * i * Math.PI/180) * logoSize;
    stage.addChild(logo[i])
}

var arc = new createjs.Shape();
      arc.graphics.beginFill(colors[0]).arc(0, 0, ballSize, 0, Math.PI);
      arc.rotation = 180;
      arc.x = logox + Math.cos(40 * 0 * Math.PI/180) * logoSize;
      arc.y = logoy + Math.sin(40 * 0 * Math.PI/180) * logoSize;
    stage.addChild(arc);
    stage.update();

    stage.update();






  stage.update();
})();
