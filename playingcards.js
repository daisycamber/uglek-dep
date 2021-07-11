  // By Jasper Camber Holton. V1.2.811
(function drawCard(){
  let canvasid = "card";
  let canvas = document.getElementById(canvasid);
  let width = canvas.width;
  let height = canvas.height;
  let TEXTTYPE = "bold " + 50 + "px Arial";

  let TEXTTYPE2 = "bold " + 70 + "px Arial";

  let TEXTTYPE3 = "bold " + 100 + "px Arial";
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
    var textoffset = 35;
    var textoffsety = 15;
    var textoffset2 = 30;

    // ♠	♥	♦	♣

    var card = "A"
    var suit = "♦"
    var color = "#FF0000";

    let text = new createjs.Text(card, TEXTTYPE, "#000000")
    text.x = textoffset;
    text.y = textoffsety;
    text.textAlign = 'center';
    stage.addChild(text);

    let text3 = new createjs.Text(suit, TEXTTYPE2, color)
    text3.x = textoffset;
    text3.y = textoffsety + textoffset2;
    text3.textAlign = 'center';
    stage.addChild(text3);

    let text2 = new createjs.Text(card, TEXTTYPE, "#000000")
    text2.x = 250-textoffset;
    text2.y = 350-textoffsety;
    text2.rotation = 180
    text2.textAlign = 'center';
    stage.addChild(text2);

    let text4 = new createjs.Text(suit, TEXTTYPE2, color)
    text4.x = 250-textoffset;
    text4.y = 350-textoffsety - textoffset2;
    text4.rotation = 180
    text4.textAlign = 'center';
    stage.addChild(text4);

    let text5 = new createjs.Text(suit, TEXTTYPE3, color)
    text5.x = logox;
    text5.y = logoy-40;
    text5.rotation = 0
    text5.textAlign = 'center';
    stage.addChild(text5);


    stage.update();






  stage.update();
})();
