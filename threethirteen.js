// By Jasper Camber Holton. V0.0.971 - Fixed hand evaluator!
(function threethirteen(){
  var currentTurn = 0;
  const suitnames = ["S", "H", "C", "D"];
  const cardnames = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
  //const cardsroot = "/cards/"
  const cardsroot = "https://uglek.com/media/cards/";
  let seed = 24;
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
    let rangeSize = end - start;
    let randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
  RNG.prototype.choice = function(array) {
    return array[this.nextRange(0, array.length)];
  }
  let rng = new RNG(seed);


    let canvasid = "game239";
    let canvas = document.getElementById(canvasid);
    let width = canvas.width;
    let height = canvas.height;

    let TEXTTYPE = "bold " + 42 + "px Arial";
    let TEXTTYPE2 = "bold " + 70 + "px Arial";
    let TEXTTYPE3 = "bold " + 40 + "px Arial";

    let last = 0;
    let stage = new createjs.Stage(canvasid);
    let container = new createjs.Container();

    background = new createjs.Shape();
    background.graphics.beginFill("#b0afb3").drawRect(0, 0, window.innerWidth, window.innerHeight); //
    stage.addChild(background);
    stage.addChild(container);

    var dontshowad;
    try {
      dontshowad = document.getElementById("dontshowad").innerHTML;

    } catch {

    }
    let ADHEIGHT = 90;
    if(dontshowad == "true"){
      ADHEIGHT = 0;
    }

    var totalScore = 0;
    var gameOverOnNextDiscard = false;
    var opponentWinsOnNextDiscard = false;

    let id;
    let player1;
    let player2;
    let user;
    let canvasHeight
  try {

      id = document.getElementById("gameid").innerHTML;
      player1 = document.getElementById("player1").innerHTML;
      player2 = document.getElementById("player2").innerHTML;
      user = document.getElementById("user").innerHTML;
      rng = new RNG(parseInt(id));
      stage.canvas.width = window.innerWidth;
      canvasHeight = window.innerHeight-ADHEIGHT;
      stage.canvas.height = canvasHeight;

      } catch {
        //console.log("Three Thirteen - No game.")
        stage.canvas.height = 0;
      }

      var canPlayerDraw = false; // TODO change to false in production
      var canPlayerDiscard = false;
    if(user == player2){
      send("join,x,"+user);
      canPlayerDraw = false;
    }
    let less = window.innerWidth;
    if(window.innerHeight < less){
      less = window.innerHeight-ADHEIGHT;
    }
    scale = container.scale = less / 1000;


    leftbound = (stage.canvas.width - less)/2/scale;
    topbound = ((canvasHeight - less)/2)/scale;





var cardScale = 0.9;
var cardCount = 53;
var suits = ["S","H","C","D"]
var cards = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]
var images = []
  for(var x = 0; x < suits.length; x++){
    suit = suits[x];
    images[x] = []
    for(var y = 0; y < cards.length; y++){
      card = cards[y];
      images[x][y] = new Image();
      images[x][y].src = cardsroot + card + suit + ".png";
      images[x][y].onload = handleImageLoad;
    }

  }

  var backImage = new Image();
  backImage.src = cardsroot + "back.png";
  backImage.onload = handleImageLoad;
  var imageCount = 0;
  function handleImageLoad(event) {
    var image = event.target;
    //var bitmap = new createjs.Bitmap(image);
    //stage.addChild(bitmap);
    //stage.update();
    imageCount++;
    if(imageCount == cardCount){
      beginGame();
    }
  }

  function drawCard(suit,card,x,y){
    var bitmap = new createjs.Bitmap(images[suit][card]);
    bitmap.scale = cardScale;
    bitmap.x = leftbound + x-250 * cardScale/2;
    bitmap.y = topbound + y-350 * cardScale/2;
    container.addChild(bitmap);
    stage.update();
    return bitmap
  }

var playerHandCards = [];
var playerHandSuits = [];
var opponentHandCards = [];
var opponentHandSuits = [];

 var yo1 = 140;
 var yo2 = 30;

 var opponentHandCount = 0;
 var opponentHandObjects = []
 opponentHandCount = 0;
  function drawOpponentHand(){
    opponentHandCount = 0;
    for(var i = 0; i < opponentHandObjects.length; i++){
      container.removeChild(opponentHandObjects[i])
    }
    opponentHandObjects = []
    for(var i = currentRound - 1; i >= 0; i--){
      yoffset = yo2;
      ioffset = 0;
      if(i > 6){
        yoffset = yo1;
        ioffset = 7;
      }

      opponentHandObjects[opponentHandCount] = drawFacedownCard(1000-(1000/7 * (i-ioffset)), yoffset);
      opponentHandCount++;
    }
  }

  function drawFacedownCard(x,y){
    var bitmap = new createjs.Bitmap(backImage);
    bitmap.scale = cardScale;
    bitmap.x = leftbound + x-250 * cardScale/2;
    bitmap.y = topbound + y - 350 * cardScale/2;
    container.addChild(bitmap);
    stage.update();
    return bitmap;
  }

var playerHandCount = 0;
var playerHandObjects = []

// program to shuffle the deck of cards

// declare card elements
var currentRound = 3;
const nsuits = [0, 1, 2, 3];
const values = [0,1,2,3,4,5,6,7,8,9,10,11,12];

// empty array to contain cards
var deck = [];


function createAndShuffleDeck(){
  deck = [];
  // create a deck of cards
  for (let i = 0; i < nsuits.length; i++) {
      for (let x = 0; x < values.length; x++) {
          let card = { Value: values[x], Suit: nsuits[i] };
          deck.push(card);
      }
  }
  // shuffle the cards
  for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(rng.nextFloat() * i);
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
  }
}

createAndShuffleDeck();

opponentHandCards = []
opponentHandSuits = []

playerHandCards = []// = [0,1,2,12,4,5,12,1,2,3]
playerHandSuits = []// = [0,1,3,3,0,1,0,3,2,1]
var deckCount = currentRound*2+1
// display 5 results
var firstdiscard = deck[currentRound*2 + 1].Value
var firstdiscardsuit = deck[currentRound*2 + 1].Suit
if(user == player1){
  console.log("Ready player 1")
  for (let i = 0; i < currentRound; i++) {
    playerHandCards[i] = deck[i].Value
    playerHandSuits[i] = deck[i].Suit
  }
  for (let i = currentRound; i < currentRound*2; i++) {
    opponentHandCards[i-currentRound] = deck[i].Value
    opponentHandSuits[i-currentRound] = deck[i].Suit
  }
} else {
  console.log("Ready player 2")
    for (let i = 0; i < currentRound; i++) {
      opponentHandCards[i] = deck[i].Value
      opponentHandSuits[i] = deck[i].Suit
    }
    for (let i = currentRound; i < currentRound*2; i++) {
      playerHandCards[i-currentRound] = deck[i].Value
      playerHandSuits[i-currentRound] = deck[i].Suit
    }
}

var discardcard = [firstdiscard]
var discardsuit = [firstdiscardsuit]

function drawOpponentHandFaceup(){
  opponentHandCount = 0;
  for(var i = 0; i < opponentHandObjects.length; i++){
    container.removeChild(opponentHandObjects[i])
  }
  opponentHandObjects = []
  for(var i = 0; i < opponentHandCards.length; i++){
    yoffset = yo2;
    ioffset = 0;
    if(i > 6){
      yoffset = yo1;
      ioffset = 7;
    }
    opponentHandObjects[opponentHandCount] = drawCard(opponentHandSuits[i],opponentHandCards[i],1000-(1000/7 * (i-ioffset+1)), yoffset);
    if(i > 6){
      container.setChildIndex(opponentHandObjects[opponentHandCount], container.getNumChildren()-12);
    }
    opponentHandCount++;
  }
}

  function drawHand(){
    var playerHandCount = 0;
    for(var i = 0; i < playerHandObjects.length; i++){
      container.removeChild(playerHandObjects[i])
    }
    playerHandObjects = []
    for(var i = playerHandCards.length-1; i >= 0; i--){
      yoffset = yo2;
      ioffset = 0;
      if(i > 6){
        yoffset = yo1;
        ioffset = 7;
      }
      playerHandObjects[playerHandCount] = drawCard(playerHandSuits[i],playerHandCards[i],1000-(1000/7 * (i-ioffset)), 1000-yoffset);
      playerHandObjects[playerHandCount].suit = playerHandSuits[i]
      playerHandObjects[playerHandCount].card = playerHandCards[i]
      playerHandObjects[playerHandCount].on("mousedown", function(event) {
        if(canPlayerDiscard){
          canPlayerDiscard = false;
          canPlayerDraw = false;
          nCards = [] // New cards and suits
          nSuits = []
          var count = 0; // our count for the new hand
          for(var x = 0; x < playerHandCards.length; x++){
            if(!(event.target.suit == playerHandSuits[x] && event.target.card == playerHandCards[x])){
              nCards[count] = playerHandCards[x]
              nSuits[count] = playerHandSuits[x]
              count++;
            }
          }
          discardcard[discardcard.length] = event.target.card
          discardsuit[discardsuit.length] = event.target.suit
          playerHandCards = nCards
          playerHandSuits = nSuits
          drawDiscard();
          send("discard,"+event.target.card + "." + event.target.suit,+","+user)

          checkPlayerWin();
          drawHand();
          if(opponentWinsOnNextDiscard){
            opponentWonGame();
            gameOverOnNextDiscard = false;
            opponentWinsOnNextDiscard = false;
          }
          canPlayerDiscard = false;
          canPlayerDraw = false;
          setCurrentPlayer(false);
        }
      });
      playerHandCount++;
    }
  }

var playerSorted = false;

  function sortHand(numberOrSuit){
    playerSorted = numberOrSuit;
    //drawOpponentHandFaceup(); // TODO comment out in production
    //1) combine the arrays:
    var list = [];
    for (var j = 0; j < playerHandCards.length; j++)
        list.push({'card': playerHandCards[j], 'suit': playerHandSuits[j]});
    //2) sort:
    if(numberOrSuit){
      list.sort(function(a, b) {
          return ((a.card > b.card) ? -1 : ((a.card == b.card) ? 0 : 1));
          //Sort could be modified to, for example, sort on the age
          // if the name is the same.
      });
    } else {
      list.sort(function(a, b) {
          return ((a.suit < b.suit) ? -1 : ((a.suit == b.suit) ? 0 : 1));
          //Sort could be modified to, for example, sort on the age
          // if the name is the same.
      });
    }

    //3) separate them back out:
    for (var k = 0; k < list.length; k++) {
        playerHandCards[k] = list[k].card;
        playerHandSuits[k] = list[k].suit;
    }
    //playerHandCards.reverse(); // TODO reerse sorting
    //playerHandSuits.reverse();
  }


  function sortOpponentHand(numberOrSuit){
    //drawOpponentHandFaceup(); // TODO comment out in production
    //1) combine the arrays:
    var list = [];
    for (var j = 0; j < opponentHandCards.length; j++)
        list.push({'card': opponentHandCards[j], 'suit': opponentHandSuits[j]});
    //2) sort:
    if(numberOrSuit){
      list.sort(function(a, b) {
          return ((a.card > b.card) ? -1 : ((a.card == b.card) ? 0 : 1));
          //Sort could be modified to, for example, sort on the age
          // if the name is the same.
      });
    } else {
      list.sort(function(a, b) {
          return ((a.suit < b.suit) ? -1 : ((a.suit == b.suit) ? 0 : 1));
          //Sort could be modified to, for example, sort on the age
          // if the name is the same.
      });
    }

    //3) separate them back out:
    for (var k = 0; k < list.length; k++) {
        opponentHandCards[k] = list[k].card;
        opponentHandSuits[k] = list[k].suit;
    }
    //playerHandCards.reverse(); // TODO reerse sorting
    //playerHandSuits.reverse();
  }

  function Card(valueInput, suitInput) {
  var suit = suitInput;
  var value = Number(valueInput);
  var counted = true;
  var scoringMode = "";
  var ignored = false;  //whether or not conflicts should be ignored for this card

  this.getSuit = function() {return suit};
  this.setSuit = function(s) {suit = s};
  this.getValue = function() {return value};
  this.setValue = function(v) {value = Number(v)};
  this.isCounted = function() {return counted};
  this.setCounted = function(cnt) {counted = cnt};
  this.getScoringMode = function() {return scoringMode};
  this.setScoringMode = function(s) {scoringMode = s};
  this.ignored = function() {return ignored};
  this.setIgnored = function(i) {ignored = i};
}

var allCardsPlayed;

function isWildcard(value){
  return value.getValue() == currentRound-2
}


// TODO Check for wildcards
  function calculateScore(ndeck) {
  //Step 1: Make all cards counted, not ignored
  ndeck.forEach(function(item) {item.setCounted(true); item.setIgnored(false)})

  //Step 2: calculate what cards are not counted based on triples or quadruples
  for(var i = 0; i < ndeck.length - 2; i ++) {
    var nextLoc = i + 1;
    var skipped = 0;
    while((isWildcard(ndeck[i]) || ndeck[nextLoc].getValue() == ndeck[i].getValue())
            && ndeck[i].getScoringMode() != 'run') {
      if(ndeck[nextLoc].getScoringMode() == 'run') {
        skipped ++;
      }
      nextLoc ++;
      if(nextLoc >= ndeck.length) {
        break;
      }
    }
    if(nextLoc - i - skipped >= 3) {
      for(var j = i; j < nextLoc; j ++) {
        if(skipped == 0 || ndeck[j].getScoringMode() != 'run')
          ndeck[j].setCounted(false);
      }
    }
  }

  //Setp 3: calculate a straight
  for(var i = 0; i < ndeck.length - 2; i ++) {
    var nextLoc = i + 1;
    var skipped = 0;
    var lastValue = ndeck[i].getValue();
    var lastGoodValue = lastValue;

    while((ndeck[i].getSuit() == ndeck[nextLoc].getSuit() && ndeck[i].getValue() + (nextLoc - i - skipped) == ndeck[nextLoc].getValue())
              || ndeck[nextLoc].getValue() == lastValue
              || ndeck[nextLoc].getValue() == lastValue + 1) {

      if(ndeck[i].getScoringMode() == 'set' || ndeck[nextLoc].getScoringMode() == 'set')
        break;

      if((ndeck[nextLoc].getValue() == lastValue && ndeck[nextLoc].getSuit() != ndeck[i].getSuit())
              || ndeck[nextLoc].getScoringMode() == 'set'
              || (ndeck[nextLoc].getValue() == lastValue + 1 && ndeck[nextLoc].getSuit() != ndeck[i].getSuit())) {
        skipped ++;
      }
      else {
        //the card is the correct suit, but there is a gap between
        //  the current cards value and the last value in the run
        if(lastGoodValue + 2 <= ndeck[nextLoc].getValue()) {
          skipped ++;
          break;
        }
        lastGoodValue = ndeck[nextLoc].getValue();
      }

      lastValue = ndeck[nextLoc].getValue();
      nextLoc ++;

      if(nextLoc >= ndeck.length)
         break;
    }

    if(nextLoc - i - skipped >= 3) {
      for(var j = i; j < nextLoc; j ++) {
        if(ndeck[j].getSuit() == ndeck[i].getSuit()) {
          if(ndeck[j].isCounted() || ndeck[j].getScoringMode() != '' || ndeck[j].ignored()) {
            ndeck[j].setIgnored(true); //makes sure that if this is detected as a run
                                      // again because the length is greater than 3,
                                      // it is ignored the second time the loop goes over it
            ndeck[j].setCounted(false);
          }
          else {
            ndeck[j].setScoringMode('set');
            var setScore = calculateScore(ndeck);

            ndeck[j].setScoringMode('run');
            var runScore = calculateScore(ndeck);

            if(setScore < runScore)
              ndeck[j].setScoringMode('set');

            calculateScore(ndeck);
          }
        }
      }
    }
  }
  var score = 0;
  allCardsPlayed = true;
  ndeck.forEach(function(card) {
    if(card.ignored()){

      console.log("Ignoring card with value " + cardnames[card.getValue()] + " and suit " + suitnames[card.getSuit()]);
    } else {

      console.log("Scoring card with value " + cardnames[card.getValue()] + " and suit " + suitnames[card.getSuit()]);
    }
    console.log("Is counted? " + card.isCounted())
    if(card.isCounted()){
      val = card.getValue() + 2
      if(val == 14){
        val = 1;
      }
      if(val > 10){
        val = 10;
      }
      score += val;
      allCardsPlayed = false;
    }
    // score += card.getValue() * !card.ignored();//(card.getValue() > 10 ? 10 * card.isCounted() : card.getValue()) * card.isCounted();
  });
  console.log("All cards played? " + allCardsPlayed)
  return score;
}


function stringCard(card) {
  var result = "";
  result += card.getValue();
  result += " of ";
  result += card.getSuit();
  return result;
}

function stringDeck(deck) {
  var result = "";
  deck.forEach(function(item) {
    result += item.getValue() + " of " + item.getSuit() + "|";
  });

  return result;
}




  function drawGameFinishedDialog(){
    console.log("Game finished")
      var bitmap2 = new createjs.Bitmap(backImage);
      bitmap2.scale = cardScale * 2;
      bitmap2.x = leftbound + 300-250 * cardScale/2*2;
      bitmap2.y = topbound + 500-350 * cardScale/2*2;
      container.addChild(bitmap2);
      var toDisplay = []
      if(user == player1){
        toDisplay[0] = player1 + ": " + playerscore
      } else {
        toDisplay[0] = player1 + ": " + opponentscore
      }
      if(user == player1){
        toDisplay[1] = player2 + ": " + opponentscore
      } else {
        toDisplay[1] = player2 + ": " + playerscore
      }
      if(playerscore > opponentscore){
        toDisplay[2] = "You won!"
      } else if(playerscore < opponentscore){
        toDisplay[2] = "Your opponent won!"
      } else {
        toDisplay[2] = "It's a tie!"
      }
      var texts = []
      var extra = 0
      for(x = 0; x < toDisplay.length; x++){
        if(x == toDisplay.length - 1){
          extra = 300;
        }
        texts[x] = new createjs.Text(toDisplay[x], TEXTTYPE3, "#000000")
        texts[x].x = leftbound + 500 - 400;
        texts[x].y = topbound + 500 - 270 + 80 * x + extra;
        container.addChild(texts[x]);
      }
      stage.update();


  }
  //
  function prepareForNextRound(){
    createAndShuffleDeck();

    opponentHandCards = []
    opponentHandSuits = []

    playerHandCards = [] // = [0,1,2,12,4,5,12,1,2,3]
    playerHandSuits = [] // = [0,1,3,3,0,1,0,3,2,1]
    var cr = currentRound + 1
    var deckCount = cr*2+1
    // display 5 results

    if(user == player1){
      console.log("Ready player 1")
      for (let i = 0; i < cr; i++) {
        playerHandCards[i] = deck[i].Value
        playerHandSuits[i] = deck[i].Suit
      }
      for (let i = cr; i < cr*2; i++) {
        opponentHandCards[i-cr] = deck[i].Value
        opponentHandSuits[i-cr] = deck[i].Suit
      }
      if(cr%2 == 1){
        canPlayerDraw = true;
      } else {
        canPlayerDraw = false;
      }
    } else {
      console.log("Ready player 2")
        for (let i = 0; i < cr; i++) {
          opponentHandCards[i] = deck[i].Value
          opponentHandSuits[i] = deck[i].Suit
        }
        for (let i = cr; i < cr*2; i++) {
          playerHandCards[i-cr] = deck[i].Value
          playerHandSuits[i-cr] = deck[i].Suit
        }
        if(cr%2 == 0){
          canPlayerDraw = true;
        } else {
          canPlayerDraw = false;
        }
    }
    firstdiscard = deck[cr*2 + 1].Value
    firstdiscardsuit = deck[cr*2 + 1].Suit
    currentCard = cr*2 + 1 + 1;



    var discardcard = [firstdiscard]
    var discardsuit = [firstdiscardsuit]
    setCurrentPlayer(canPlayerDraw);
  }

  function nextRound(){
    currentRound = currentRound + 1;
    if(currentRound == 14){
      drawGameFinishedDialog();
    } else {


    gameOverOnNextDiscard = false;
    opponentWinsOnNextDiscard = false;
    sortHand(false);
    drawHand();
    drawDiscard()
    drawOpponentHand();

    setCurrentPlayer(canPlayerDraw);
  }
  }


  function checkPlayerWin(){
    sortHand(true);
    sortHand(true);
    ndeck = []
    for(var x = 0; x < playerHandCards.length; x++){
      ndeck[ndeck.length] = (new Card(playerHandCards[x], playerHandSuits[x]))
    }
    score = calculateScore(ndeck)
    sortHand(false);
    sortHand(false);
    ndeck = []
    for(var x = 0; x < playerHandCards.length; x++){
      ndeck[ndeck.length] = (new Card(playerHandCards[x], playerHandSuits[x]))
    }
    score2 = calculateScore(ndeck)
    sortHand(playerSorted);

    //console.log("PLAYER SCORED: " + score + " or " + score2)
    if(score == 0 || score2 == 0){
      gameOverOnNextDiscard = true;
      //console.log("You go out next round")
      //wonGame();
    }
  }
  function checkOpponentWin(){

    sortOpponentHand(true);
    sortOpponentHand(true);
    ndeck2 = []
    for(var x = 0; x < opponentHandCards.length; x++){
      ndeck2[ndeck2.length] = (new Card(opponentHandCards[x], opponentHandSuits[x]))
    }
    score = calculateScore(ndeck2)
    sortOpponentHand(false);
    sortOpponentHand(false);
    ndeck2 = []
    for(var x = 0; x < opponentHandCards.length; x++){
      ndeck2[ndeck2.length] = (new Card(opponentHandCards[x], opponentHandSuits[x]))
    }
    score2 = calculateScore(ndeck2)
    //sortOpponentHand(true);
    //score = calculateScore(ndeck2)
    //console.log("OPPONENT SCORED: " + score)
    if(score == 0 || score2 == 0){
      opponentWinsOnNextDiscard = true;
      //console.log("Opposite player goes out next round")
    }
  }
  var radius = 10;
  var buttonSize = 100;
  function drawSortButtons(){

    var button333 = new createjs.Shape();
    button333.graphics.beginFill("lightgreen").drawRoundRectComplex(leftbound + 1000 - buttonSize, topbound + 350 , buttonSize, buttonSize, radius,radius,radius,radius);
    var text333 = new createjs.Text("333", TEXTTYPE, "#000000")
      text333.x = leftbound + 1000 - 50;
      text333.textAlign = 'center';
      text333.y = topbound + 350 +30;

    container.addChild(button333)
    container.addChild(text333)
    button333.on("mousedown", function(event) {
      sortHand(true);
      drawHand();
    });


    var button456 = new createjs.Shape();
    button456.graphics.beginFill("lightblue").drawRoundRectComplex(leftbound + 1000 - buttonSize, topbound + 550 , buttonSize, buttonSize, radius,radius,radius,radius);
    var text456 = new createjs.Text("456", TEXTTYPE, "#000000")
      text456.x = leftbound + 1000-50;
      text456.textAlign = 'center';
      text456.y = topbound + 550+30;

    container.addChild(button456)
    container.addChild(text456)
    button456.on("mousedown", function(event) {
      sortHand(false);
      drawHand();
    });
  }

var discardx = 650;
var discardy = 500;
var discard;

var discardcard = [firstdiscard]
var discardsuit = [firstdiscardsuit]


function takeDiscard(){
  container.removeChild(discard)
  playerHandCards[playerHandCards.length] = discardcard[discardcard.length-1]
  playerHandSuits[playerHandSuits.length] = discardsuit[discardsuit.length-1]
  discardcard.splice(discardcard.length-1, 1);
  discardsuit.splice(discardsuit.length-1, 1);
  drawHand();
  if(discardcard.length > 0){
    drawDiscard();
  }
}

function opponentDrawDeck(){
  if(currentCard < 52){
    // Draw card to the opponents hand from the deck
    opponentHandCards[opponentHandCards.length] = deck[currentCard].Value
    opponentHandSuits[opponentHandSuits.length] = deck[currentCard].Suit
    currentCard++;
  } else {
    // Use discard as ndeck
    ndeck = []
    for(var x = 0; x < discardcard.length; x++){
      ndeck[ndeck.length] = (new Card(discardcard[x], discardsuit[x]))
    }
    currentCard = 1;
    discardcard = [ndeck[0].Value]
    discardsuit = [ndeck[0].Suit]
    deck = []
    for(var x = 1; x < ndeck.length; x++){
      deck[x-1] = ndeck[x]
    }
    drawDiscard();
  }
  drawOpponentHand();
  //console.log("Opponent drew from deck")
  canPlayerDraw = false;
}
function opponentTakeDiscard(){
  // Draw card to the oppponents hand from the discard
  container.removeChild(discard) // TODO add discard array to make this work
  opponentHandCards[opponentHandCards.length] = discardcard[discardcard.length-1]
  opponentHandSuits[opponentHandSuits.length] = discardsuit[discardsuit.length-1]
  discardcard.splice(discardcard.length-1, 1);
  discardsuit.splice(discardsuit.length-1, 1);
  drawOpponentHand();
  if(discardcard.length > 0){
    drawDiscard();
  }
  //console.log("Opponent drew discard")
  canPlayerDraw = false;
}

function opponentDiscard(input){
  // Discard card according to opponents input
  theDiscard = input.split('.')

  discardCard = parseInt(theDiscard[0])
  discardSuit = parseInt(theDiscard[1])
  //console.log("Opponent discarded " + cardnames[discardCard] + " of " + suitnames[discardSuit])
  nCards = [] // New cards and suits
  nSuits = []
  var count = 0; // our count for the new hand
  for(var x = 0; x < opponentHandCards.length; x++){
    if(!(discardSuit == opponentHandSuits[x] && discardCard == opponentHandCards[x])){
      nCards[count] = opponentHandCards[x]
      nSuits[count] = opponentHandSuits[x]
      count++;
    }
  }
  discardcard[discardcard.length] = discardCard
  discardsuit[discardsuit.length] = discardSuit
  opponentHandCards = nCards
  opponentHandSuits = nSuits
  drawOpponentHand();
  drawDiscard();
  checkOpponentWin();
  canPlayerDraw = true;
  canPlayerDiscard = false;

  if(gameOverOnNextDiscard){
    wonGame();
  }
  setCurrentPlayer(true);
}

  function drawDiscard(){
    discard = drawCard(discardsuit[discardsuit.length-1],discardcard[discardcard.length-1],discardx,discardy);
    discard.on("mousedown", function(event) {
      //console.log("canPlayerDraw: " + canPlayerDraw);
      if(canPlayerDraw && playerHandCards.length < currentRound + 1){
        canPlayerDraw = false;
        canPlayerDiscard = true;
        takeDiscard();
        send("draw,discard,"+user)
      } else {
        canPlayerDraw = false;
        canPlayerDiscard = true;
      }
    });
  }
  var currentCard = currentRound*2 + 1 + 1;

  function drawCardFromDeck(){
    if(currentCard < 52){
      playerHandCards[playerHandCards.length] = deck[currentCard].Value
      playerHandSuits[playerHandSuits.length] = deck[currentCard].Suit
      currentCard++;
    } else {
      // Use discard as ndeck
      ndeck = []
      for(var x = 0; x < discardcard.length; x++){
        ndeck[ndeck.length] = (new Card(discardcard[x], discardsuit[x]))
      }
      currentCard = 1;
      discardcard = [ndeck[0].Value]
      discardsuit = [ndeck[0].Suit]
      deck = []
      for(var x = 1; x < ndeck.length; x++){
        deck[x-1] = ndeck[x]
      }
      drawDiscard();
    }
    canPlayerDraw = false;
    canPlayerDiscard = true;
    drawHand();

  }

  function drawDeck(cardsInDeck) { // The number of cards to draw
    var deckoffset = 5;
    for(var x = 0; x < cardsInDeck; x++){
      drawFacedownCard(350+deckoffset*(cardsInDeck-x),500+deckoffset*(cardsInDeck-x));
    }
    cardDeck = drawFacedownCard(350,500);
    cardDeck.on("mousedown", function(event) {
      //console.log("canPlayerDraw: " + canPlayerDraw);
      if(canPlayerDraw && playerHandCards.length < currentRound + 1){
        canPlayerDraw = false;
        canPlayerDiscard = true;
        drawCardFromDeck();
        send("draw,deck,"+user)
      } else {
        canPlayerDraw = false;
        canPlayerDiscard = true;
      }
    });
  }

  function beginGame(){
    sortHand(false);
    drawHand();
    drawDeck(4);
    drawOpponentHand();
    drawDiscard();
    drawSortButtons();
    //drawOpponentHandFaceup();
    //drawGameFinishedDialog();
    stage.update();
  }

  let gameplay;

  function send(text){
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      xhr.send(text);
      canPlayerDraw = false;
      currentTurn++;
  }

  var opjContainer;
  function opponentJoinedGame(){
    opjContainer = new createjs.Container();
      var opjText = new createjs.Text("Opponent Joined Game", TEXTTYPE, "#000000")
      opjText.x = leftbound + 500;
      opjText.y = topbound + 270;
      opjText.textAlign = 'center';
      opjContainer.addChild(opjText);
    setTimeout(() => {
              container.removeChild(opjContainer);
            }, 5000);
    container.addChild(opjContainer);
    if(user == player1){
      canPlayerDraw = true;
    }

  }
  //opponentJoinedGame();

  var playerscore = 0;
  var psoffset = 30;
  var playerScore = new createjs.Shape();
  playerScore.graphics.beginFill("lightyellow").drawRoundRectComplex(leftbound, topbound + 550 , buttonSize, buttonSize, radius,radius,radius,radius);
  var playerScoreText = new createjs.Text("--", TEXTTYPE, "#000000")
  playerScoreText.x = leftbound + 50;
  playerScoreText.textAlign = 'center';
  playerScoreText.y = topbound + 550 + 30;

  var currentPlayer = new createjs.Text("★", TEXTTYPE2, "#E8CD71")
  currentPlayer.x = leftbound + 50;
  currentPlayer.textAlign = 'center';
  if(user == player1){
    currentPlayer.y = topbound + 700-psoffset;
  } else {
    currentPlayer.y = topbound + 300-psoffset;
  }

  container.addChild(currentPlayer)

  function setCurrentPlayer(userOrOpponent){
    if(userOrOpponent) {
      currentPlayer.y = topbound + 700-psoffset;
    } else {
      currentPlayer.y = topbound + 300-psoffset;
    }
  }







  var opponentscore = 0;

  var opponentScore = new createjs.Shape();
  opponentScore.graphics.beginFill("#f0655b").drawRoundRectComplex(leftbound, topbound + 350 , buttonSize, buttonSize, radius,radius,radius,radius);
  var opponentScoreText = new createjs.Text("--", TEXTTYPE, "#000000")
  opponentScoreText.x = leftbound + 50;
  opponentScoreText.textAlign = 'center';
  opponentScoreText.y = topbound + 350 + 30;
  container.addChild(playerScore)
  container.addChild(opponentScore)
  container.addChild(opponentScoreText)
  container.addChild(playerScoreText)

  function drawPlayerScore(input){
playerScoreText.text = input
  }

  function drawOpponentScore(input){
opponentScoreText.text = input
  }



  function readCallback(){
    gp = gameplay;
        for(let i = currentTurn; i < gp.length; i++){
          sp = gp[i].split(",");
          if(sp[0] == "join" && sp[2] != user){
            opponentJoinedGame();
            currentTurn = i+1;
          } else if(sp[0] == "draw" && sp[2] != user){
              if(sp[1] == "deck"){
                opponentDrawDeck();
              } else if(sp[1] == "discard"){
                opponentTakeDiscard();
              }
              canPlayerDraw = false;
            currentTurn = i+1;
          } else if(sp[0] == "discard" && sp[2] != user){
            opponentDiscard(sp[1]);
            currentTurn = i+1;
          }/* else {
            currentTurn = i+1;
          }*/
        }
  }

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
    return gameplay.split('/');
  }

  // This code is borrowed from another website. Thanks google.
  function createArray(length) {
    let arr = new Array(length || 0),
      i = length;

    if (arguments.length > 1) {
      let args = Array.prototype.slice.call(arguments, 1);
      while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
  }

  var colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
    var COLORS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
  let confettiCount = 60;
  let confetti = [];
  let confettivx = [];
  let confettivy = [];
  let confettiv = 10;
  let confettimin = -600;

  function drawConfetti() {
    for (i = 0; i < confettiCount; i++) {
      confetti[i] = new createjs.Shape();
      confetti[i].graphics.beginFill(COLORS[0, rng.nextRange(0, COLORS.length)]).drawCircle(0, 0, rng.nextRange(7, 15));
      confetti[i].x = rng.nextRange(0, width);
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
  createjs.Ticker.addEventListener("tick", handleTick2);

  let droppedConfetti = false;

  function handleTick2(event) {
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

  let gamesfactor = 4*2; // gamesFactor is number of games / 400 (1600 games gamesFactor is 4)
  function newGame(difficulty) {

  }

  function calculateAndDrawScores(){
    opponentscore+=calculateOpponentScore();
    playerscore+=calculatePlayerScore();

    drawOpponentScore(opponentscore);
    drawPlayerScore(playerscore);
  }

  let difficultyColors = ["#bafa25", "#e4f218", "#faa537", "#c70808"];
  let difficultyNames = ["Easy", "Medium", "Difficult", "Expert"]; //["Simple", "Easy", "Intermed.", "Expert"];
  let wonContainer;
  let wonDialog;
  let isFinished = false;
  var gameIsWon = false;
  // Draw a dialog to create a new game
  function wonGame() {
    if(!gameIsWon){
      calculateAndDrawScores();
      gameIsWon = true;
      wonContainer = new createjs.Container();
      wonDialog = new createjs.Shape();
      wonDialog.graphics.beginFill("lightgreen").drawCircle(0, 0, 1000);
      wonDialog.y = topbound + 1000 + 900;
      wonDialog.x = leftbound + 500;
      let wonText = new createjs.Text("You won! (Tap)", TEXTTYPE, "#000000")
      wonText.x = leftbound + 360;
      wonText.y = topbound + 925;
      wonContainer.on("mousedown", function(event) {

        container.removeChild(wonContainer);
        // Start next game
        nextRound();
        gameIsWon = false;

      });
      wonContainer.addChild(wonDialog);
      wonContainer.addChild(wonText);
      container.addChild(wonContainer);

      drawOpponentHandFaceup();
      prepareForNextRound();
    }
  }

  function calculateOpponentScore(){
    sortOpponentHand(true);
    sortOpponentHand(true);
    ndeck2 = []
    for(var x = 0; x < opponentHandCards.length; x++){
      ndeck2[ndeck2.length] = (new Card(opponentHandCards[x], opponentHandSuits[x]))
    }
    score = calculateScore(ndeck2)
    sortOpponentHand(false);
    sortOpponentHand(false);
    ndeck2 = []
    for(var x = 0; x < opponentHandCards.length; x++){
      ndeck2[ndeck2.length] = (new Card(opponentHandCards[x], opponentHandSuits[x]))
    }
    score2 = calculateScore(ndeck2)
    if(score < score2){
      return score
    }
    return score2
  }
  function calculatePlayerScore(){
    sortHand(true);
    sortHand(true);
    ndeck = []
    for(var x = 0; x < playerHandCards.length; x++){
      ndeck[ndeck.length] = (new Card(playerHandCards[x], playerHandSuits[x]))
    }
    score = calculateScore(ndeck)
    sortHand(false);
    sortHand(false);
    ndeck = []
    for(var x = 0; x < playerHandCards.length; x++){
      ndeck[ndeck.length] = (new Card(playerHandCards[x], playerHandSuits[x]))
    }
    score2 = calculateScore(ndeck)
    if(score < score2){
      return score
    }
    return score2

  }
  // Draw a dialog to create a new game
  function opponentWonGame() {
    if(!gameIsWon){
      calculateAndDrawScores();
      gameIsWon = true;
      wonContainer = new createjs.Container();
      wonDialog = new createjs.Shape();
      wonDialog.graphics.beginFill("lightblue").drawCircle(0, 0, 1000);
      wonDialog.y = topbound + 1000 + 900;
      wonDialog.x = leftbound + 500;
      let wonText = new createjs.Text("Your opponent won!", TEXTTYPE, "#000000")
      wonText.textAlign = 'center'
      wonText.x = leftbound + 500;
      wonText.y = topbound + 925;
      wonContainer.on("mousedown", function(event) {

        container.removeChild(wonContainer);
        gameIsWon = false
        nextRound();
        // Start next game
      });
      wonContainer.addChild(wonDialog);
      wonContainer.addChild(wonText);
      container.addChild(wonContainer);
      drawOpponentHandFaceup();
      prepareForNextRound();
    }
  }
  let ticks = 0;

  function handleTick(event) {
    if(ticks > 5*60){
      ticks = 0;
      read();
      //console.log("Reading");
    }
    ticks++;
    stage.update();
  }
  createjs.Ticker.addEventListener("tick", handleTick);
  stage.update();
})();
