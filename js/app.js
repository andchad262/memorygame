const cardList=["fa fa-diamond","fa fa-diamond","fa fa-paper-plane-o","fa fa-paper-plane-o","fa fa-anchor","fa fa-anchor","fa fa-bolt","fa fa-bolt","fa fa-cube","fa fa-cube","fa fa-leaf","fa fa-leaf","fa fa-bicycle","fa fa-bicycle","fa fa-bomb","fa fa-bomb"];

// Global moves
let moves = 0,
	moveCounter = document.querySelector(".moves"),
	flips = 0,
	starList = document.getElementById("stars"),
	flippedCards = [],
	matches = 0,
	freeze = document.getElementById("cardMatrix");

// Timer related variables
let clock = document.querySelector(".timer"),
    seconds = 0, 
	minutes = 0,
	t;

// Provided shuffle function
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function init(){
	let ul = document.createElement("ul"); //begin clearing variables for new game
	flips = 0;
	matches = 0;
	flippedCards = [];  //end clearing variables for new game	
	moves.innerHTML = "0 moves";//clears out the move counter for new game
	let deck = shuffle(cardList);//create the shuffled deck of cards
	document.getElementById("cardMatrix").appendChild(ul);//adds a new UL to the cardMatrix, will hold all cards
	ul.className = "deck";//adds the deck class to the ul
	deck.forEach(function(cardName) {
		let li = document.createElement("li"),
			i = document.createElement("i");
		ul.appendChild(li);//add li for each card
		li.append(i);//adds an icon tag for each li
		li.className = "card";//assigns card class to the newly created li
		i.className = cardName;//assigns FA icon name as class to each icon, which sets the appearance
		li.addEventListener("click", flipCard, false);
		li.addEventListener("click", matchCheck, false);
		li.addEventListener("click", chickenDinner, false);//event listeners added to the new card
	});
}

//Timer functions modified from https://jsfiddle.net/Daniel_Hug/pvk6p/
//Begin timer functions
function addTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
	clock.textContent = (minutes < 1 ? "" : minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
	timer();
}

function timer() {
    t = setTimeout(addTime, 1000);
}

function resetTimer() {
    seconds = 0;
	minutes = 0;
	clock.textContent = ":00";
}

function stopTimer() {
    clearTimeout(t);
}
//End timer functions

//Set the classes of the cards on a card flips
function flipCard(){
    flips++;
	//initiate timer here
	if (flips === 1) {
		timer();
	}
	this.classList.toggle("open");
	this.classList.toggle("show");
	this.classList.toggle("disabled");
}

//Checks to see if the cards are a match.
function matchCheck(){
	flippedCards.push(this);
	let index = flippedCards.length;
	if (index === 2){
		freeze.classList.add ("freeze");
		if(flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
			match(); }
		else { noMatch();
		}
	counter();
	}
}
//Fires modal upon completion of the game (8 matches)
function chickenDinner(){
	if (matches === 8) {
		stopTimer();
		modalOpen();		
	} 	
}

//Behavior if cards match
function match(){
	flippedCards[0].classList.add("match", "disabled");
	flippedCards[1].classList.add("match", "disabled");
	flippedCards[0].classList.remove("show", "open");
	flippedCards[1].classList.remove("show", "open");
	flippedCards=[];
	matches++;
	freeze.classList.remove ("freeze");
}

//Behavior if cards do not match
function noMatch(){
	flippedCards[0].classList.add("unmatched", "disabled");
	flippedCards[1].classList.add("unmatched", "disabled");
	setTimeout(function(){
		flippedCards[0].classList.remove("show", "open", "disabled", "unmatched");
		flippedCards[1].classList.remove("show", "open", "disabled", "unmatched");
		flippedCards=[];
		freeze.classList.remove ("freeze");
	}, 500);	
}
//Counter function which removes a star upon certain thresholds
function counter() {
	moves++;
	if (moves === 16) {
		rating();
	} else if (moves === 32) {
		rating();
	}
	moveCounter.innerHTML = (moves !==1 ? moves + " moves": moves + " move");
}

//Resets the counter, stops and resets the counter
function counterReset(){
	stopTimer();
	resetTimer();
	moves = 0;
	moveCounter.innerHTML = (moves !==1 ? moves + " moves": moves + " move");
}

//Removes star when called
function rating() {
	starList.removeChild(starList.childNodes[0]);
}
//Resets the stars, fills UL back to 3
function ratingReset() {
	starList.innerHTML = "";
	for (var i = 0; i < 3; i++) {
		let makeStar = document.createElement("li");
		let icon = document.createElement("i");
		starList.appendChild(makeStar);
		makeStar.append(icon);
		icon.className = "fa fa-star";		
	}
 }
// Destroys the old cards for a new game
function reset(){
	counterReset();
	ratingReset();
	var listNode = document.getElementById("cardMatrix");
	listNode.innerHTML = "";
	init();
}

//Modal window code modified from original source: https://www.w3schools.com/howto/howto_css_modals.asp
// Get the modal
var modal = document.getElementById("myModal");

//Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//Defines variables for modal window, then opens it 
function modalOpen() {
	var mStar = starList.cloneNode(true);
	var mStarList = document.querySelector(".mStarList");
	var mMoves = document.querySelector(".mMoves");
	var mTimer = document.querySelector(".mTimer");
	mMoves.textContent = moves + " moves";
	mTimer.textContent = (minutes === 1 ? minutes + " minute and " : (minutes < 1 ? "" : minutes + " minutes and ")) + (seconds === 1 ? seconds + " second" : (seconds > 9 ? seconds + " seconds" : seconds + " seconds"));
	mStar.id = "modal-stars";
	mStarList.innerHTML = "";
	mStarList.appendChild(mStar);
	modal.style.display = "block";	
};

//Closes the modal window and starts a new game
function playAgain() {
	modal.style.display = "none";
	reset();	
}

//Closes the window upon clicking the X in the modal window
span.onclick = function() {
    modal.style.display = "none";
};

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

//sets up a new game upon loading the page
window.onload = reset();
