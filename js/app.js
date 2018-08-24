let deck = document.querySelector('.deck');
let allCards;
let openCards = [];
let matches = 0;

let clicks = 0;
const moveCounter = document.querySelector('.moves-num');
let moves = 0;
let noMatchMoves = 0;
let stars = 3;
const restartBtn = document.querySelector('.restart');

const winModal = document.querySelector('.win-modal');
const playAgainBtn = document.querySelector('.play-again');

let timerText = document.querySelector('.timer');
let seconds = 0;
let minutes = 0;
let hours = 0;
let t;
let formattedTime = '0';
let totalGameTime = '0';


/*
*
* GAMEPLAY
*
*/

newGame();


/*
*
* EVENT LISTENERS
*
*/

// Determine the first click on the deck to start the timer
deck.addEventListener('click', function () {
  clicks++;
  if (clicks == 1){
    timer();
  }
});

// Restart the game when the win modal button is clicked
playAgainBtn.addEventListener('click', function () {
  newGame();
  winModal.style.display = "none";
});

// Restart the game when the restart button is clicked
restartBtn.addEventListener('click', function () {
  stopTimer();
  newGame();
});


/*
*
* FUNCTIONS
*
*/


/* ------------------------ Gameplay ------------------------*/


// Initalize the board and handle gameplay
function newGame(){

  newGameboard();

  // Handle game play
  allCards.forEach(function(card) {
    card.addEventListener('click', function () {
      if(isFippable(card)){
        openCard(card);
        addToOpenCardList(card);
        if (openCards.length == 2){
          increaseMoveCounter();
          if (isMatch(openCards[0], openCards[1])){
            createMatch(openCards[0], openCards[1]);
            openCards = [];
            matches++;
            if(isWinner()){
              createWinModal();
            }
          }else{
            closeCards(openCards[0], openCards[1]);
            openCards = [];
            noMatchMoves++;
            updateStarStatus();
          }
        }
      }
    });
  });
}

// Reset all values, create cards, and start the timer, move counter, & star rating
function newGameboard(){
  clicks = 0;
  resetTimer();
  noMatchMoves = 0;
  resetStars();
  matches = 0;
  openCards = [];
  deck.innerHTML = ' ';
  createCardsHTML();
  allCards = document.querySelectorAll('.card');
  inializeMoveCounter();
}

// Dertermine if the user has won the game
function isWinner(){
  if (matches == 8){
    stopTimer();
    return true;
  }else{
    return false;
  }
}


/* ------------------------ Cards ------------------------*/


// Creates randomly shuffled cards on the gameboard
function createCardsHTML(){
  const cards = ['fa-anchor', 'fa-anchor',
  'fa-bicycle', 'fa-bicycle',
  'fa-bolt', 'fa-bolt',
  'fa-bomb', 'fa-bomb',
  'fa-cube', 'fa-cube',
  'fa-diamond', 'fa-diamond',
  'fa-leaf', 'fa-leaf',
  'fa-paper-plane-o', 'fa-paper-plane-o'];
  const cardsHTML = [];
  deck = document.querySelector('.deck');

  cards.forEach(function(card){
    cardsHTML.push('<li class="card"><i class="fa ' + card + '"></i></li>');
  });
  shuffle(cardsHTML);
  deck.innerHTML = cardsHTML.join('');
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Visually "open" (flip over) a card
function openCard(card){
  card.classList.add('open', 'show');
}

// Keep track of which cards are "open" (flipped)
function addToOpenCardList(card){
  openCards.push(card);
}

// Determine if a card can be "opened" (flipped)
function isFippable(card){
  if(!card.classList.contains('open') && !card.classList.contains('show') &&
  !card.classList.contains('match') && openCards.length < 2){
    return true;
  }else{
    return false;
  }
}

// Determine if a cards are a match
function isMatch(cardA, cardB){
  if (cardA.innerHTML == cardB.innerHTML){
    return true;
  }else{
    return false;
  }
}

// Indicate a successful match & create a match
function createMatch(cardA, cardB){
  cardA.classList.add('match');
  cardB.classList.add('match');
}

// Indicate an unsuccessful match & "close" card (flip it back over)
function closeCards(cardA, cardB){
  setTimeout(function(){
    cardA.classList.add('no-match');
    cardB.classList.add('no-match');
  }, 300);

  setTimeout(function(){
    cardA.classList.remove('open', 'show');
    cardB.classList.remove('open', 'show');
    cardA.classList.remove('no-match');
    cardB.classList.remove('no-match');
  }, 1200);
}


/* ------------------------ Score Panel ------------------------*/


// Determine the star rating based on the number of unsuccessful matches
function updateStarStatus(){
  if (noMatchMoves == 5){
    removeStar();
  }else if (noMatchMoves == 10){
    removeStar();
  }
}

function removeStar(){
  const star = document.querySelector('.fa-star');
  star.classList.remove('fa-star');
  star.classList.add('fa-star-o');
  stars--;
}

function addStar(){
  const star = document.querySelector('.fa-star-o');
  star.classList.remove('fa-star-o');
  star.classList.add('fa-star');
  stars++;
}

function resetStars(){
  const maxStars = 3;
  const starsNeeded = (maxStars - stars);
  for (let i = 0; i < starsNeeded; i++){
    addStar();
  }
}

function inializeMoveCounter(){
  moves = 0;
  moveCounter.innerHTML = moves;
}

function increaseMoveCounter(){
  moves++;
  moveCounter.innerHTML = moves;
}

//Timer functions from https://jsfiddle.net/Daniel_Hug/pvk6p/
function timer() {
  t = setTimeout(addOneSec, 1000);
}

function addOneSec(){
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  formattedTime = (hours ? (hours > 9 ? hours : '0' + hours) : '00') + ':'
  + (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':'
  + (seconds > 9 ? seconds : '0' + seconds);

  timerText.textContent = formattedTime

  timer();
}

function stopTimer(){
  clearTimeout(t);
  totalGameTime = timerText.textContent;
}

function resetTimer(){
  timerText.textContent = '00:00:00';
  seconds = 0;
  minutes = 0;
  hours = 0;
  formattedTime = '0';
  totalGameTime = '0';
}


/* ------------------------ Win Modal ------------------------*/


function createWinModal(){
  getResultTime();
  getResultMoves();
  getResultStars();
  winModal.style.display = 'block';
}

// Get the total time it took the user to play the game
function getResultTime(){
  let resultTime = document.querySelector('.timer-result');
  resultTime.textContent = timerText.textContent;
}

// Get the total number of moves it took the user to play the game
function getResultMoves(){
  let resultMoves = document.querySelector('.moves-result-num');
  resultMoves.textContent  = moveCounter.textContent;
}

// Get the star rating based on the user's gameplay
function getResultStars(){
  let resultStars = document.querySelector('.stars-result');
  let stars = document.querySelector('.stars');
  console.log(stars.innerHTML);
  console.log(resultStars.innerHTML);
  resultStars.innerHTML  = stars.innerHTML;
}
