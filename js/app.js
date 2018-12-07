//Create a list that holds all of your cards
let cards = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb'
];

//Const and var
const stelle = document.getElementsByClassName('fa fa-star');
const movesSpan = document.querySelector('.moves');
const restart = document.querySelector('.restart');
const deck = document.querySelector('.deck');
let matchedArr = document.getElementsByClassName('match');
let openedArr = [];
let moveCounter = 0;
let timerOff = true;
let sec = 0;
let min = 0;
let sec10 = 0;
let min10 = 0;
let timing;
let modal = document.getElementById('my-modal');
let modalBody = document.querySelector('.modal-body');
let lastButton = document.querySelector('.show-button-result');

//Booting function
function bootGame() {
  newDeck();
}

/*    Function to create the single card Use template literal
/     and placeholders ${}that contains the current card ------ */
function createCardList(card) {
  let rewriteCard = `<li class="card">
  <i class="fa ${card}"></i>
</li>`;
  return rewriteCard;
}

/* create the "pair" for the cards we have in the array and add the html created inot the ul.deck */
function newDeck() {
  const mixedCards = shuffle(cards.concat(cards));
  //const deck = document.querySelector('.deck');(messa globale togliere se non funziona)
  deck.innerHTML = mixedCards.map(function(card) {return createCardList(card);}).join('');
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

 // set up the event listener for a card.
 //If a card is clicked & the array is less then 2 & the card doesnt contain .show (so you cant click 2 times on the same card)
deck.addEventListener('click', function(evt) {
  let theClicked = evt.target;
  verifyTimer();
  if (theClicked.classList.contains('card') && openedArr.length <2 && !theClicked.classList.contains('show')) {
    showSymbol(theClicked);
    addToOpened(theClicked);
    //if the list already has another card, check to see if the two cards match
    if (openedArr.length === 2) {
      addingMoves();
      starAssigner();
      if (openedArr[0].firstElementChild.className === openedArr[1].firstElementChild.className) {
        scored(theClicked);//green color happy life
      } else {
        mistaken(theClicked);//red color bugged one @_@
        resetOpenedArr();//reset array and clear the cards
      }

    }
  }
});

//display the cards symbol (put this functionality in another function that you call from this one)
function showSymbol(theClicked) {
  theClicked.classList.toggle('show');
  theClicked.classList.toggle('open');
}

//red lights on mistake
function mistaken(theClicked) {
  openedArr[0].classList.toggle('notmatch');
  openedArr[1].classList.toggle('notmatch');
  setTimeout(function(){
    openedArr[0].classList.toggle('notmatch');
    openedArr[1].classList.toggle('notmatch');
  }, 700);
}

//add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
//if the list already has another card, check to see if the two cards match
function addToOpened(theClicked){
  openedArr.push(theClicked);
}

//  + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
//  plus check when the player wins
function scored(theClicked){
  openedArr[0].classList.add('match');
  openedArr[1].classList.add('match');
  openedArr = [];
  winner();
}

//  + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
function resetOpenedArr() {
  setTimeout(function() {
    openedArr.forEach(function(theClicked) {
      theClicked.classList.toggle('open');
      theClicked.classList.toggle('show');
    });
    openedArr = [];
  }, 700);
}

// restarting the game for user choice :)
restart.addEventListener('click', function(e){
  restarting();
  bootDelayed();
});

//buy some time to see the animations going
function bootDelayed() {
  setTimeout(function(){
    bootGame();
  }, 1000);
}
//Functions in action when the user want to restart the game Or when the user want to play again
function restarting() {
  resetOpenedArr();
  bootGame();
  resetCounters();
  reFlipping();
  startReset();
  resetCrono();
  stopTiming();
  timerOff = true;
  resetModalBody();
  showLastButton();
}

//nice effect appling flip class to all the card for future shuffling
function reFlipping() {
  let cardToFlip = document.querySelectorAll(".card");
  var i;
  for (i = 0; i < cardToFlip.length; i++) {
    cardToFlip[i].className += ' flip';
  }
}

//function that increment the Moves
function addingMoves() {
  moveCounter++;
  movesSpan.innerHTML = moveCounter;
}

//reset the counters...: stars and moves number
function resetCounters() {
  movesSpan.innerHTML = '0';
  moveCounter = 0;
}

//The score of the star managed by a switch with case :)
function starAssigner() {
  switch (moveCounter) {
    case 8 :
    stelle[4].classList.add('fa-star-o');
    stelle[4].classList.remove('fa-star');
    break;
    case 14 :
    stelle[3].classList.add('fa-star-o');
    stelle[3].classList.remove('fa-star');
    break;
    case 15 :
    stelle[2].classList.add('fa-star-o');
    stelle[2].classList.remove('fa-star');
    break;
    case 17 :
    stelle[1].classList.add('fa-star-o');
    stelle[1].classList.remove('fa-star');
    break;
    case 50: //50 moves is a 0 start rating :(  sorry! )
    stelle[0].classList.add('fa-star-o');
    stelle[0].classList.remove('fa-star');
    break;
  }
}

//reset for the element that cointans all the stars
function startReset() {
  document.querySelector('.stars').innerHTML = `
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`;
}

//reset for the cronograph
function resetCrono() {
  sec = 0;
  min = 0;
  sec10 = 0;
  min10 = 0;
  document.querySelector('.timer').innerHTML = '00:00';
}

//Lets make a chronograph
function crono() {
   timing = setInterval(function() {
    if ( sec <10) {
      sec10='0' + sec ;
    }
    else {
      sec10 = sec;
    }
    if (min<10){
      min10= '0' + min;
    }
    else {
      min10 = min;
    }
    if(sec<59){
      sec=sec+1;
    }
    else {
      sec = 0;
      min = min + 1;
    }
    document.querySelector('.timer').innerHTML = `${min10}:${sec10}`;
  }, 1000);
}

//with clearInterval we can stop the timing that is going on ever 1000
function stopTiming() {
  clearInterval(timing);
}

//if the timerOff is true we have to start the counting of the time with the Crono function! and a immediatly set the timerOff on false
function verifyTimer() {
  if (timerOff) {
    crono();
    timerOff = false;
  }
}

//check if we have 16 cards green to when it does we win! and we launch the function to have the last div with result button
function winner() {
  if (matchedArr.length === 16) {
    stopTiming(timing);
    modalBody.innerHTML = `<br><h2>!!!Congratulation!!!</h2>
    You've just WON the game with ${moveCounter} moves<br> in ${document.querySelector('.timer').innerHTML} seconds with ${document.querySelector('.stars').outerHTML} of 5 stars<br><br>`;
    modal.style.display = "block";
    showLastButton();
  }
}

//function to manage the last div with the result button
function showLastButton() {
  if (modalBody.children.length > 1 && modal.style.display === "none") {
    lastButton.style.display = "block";
  } else {
    lastButton.style.display = "none";
  }
}

//an hard reset on modalBody to have a better behaivor of the last div with the button for result
function resetModalBody() {
  modalBody.innerHTML = null;
  modal.style.display = "none";
}

//event lisntener for the result button to show the modal with the result if we closed it previously
lastButton.addEventListener('click', function(e) {
    modal.style.display = "block";
});

//event listener and delegation to manage the modal windows and what the player want to do after he wins :)
modal.addEventListener('click', function(e) {
  let modalEvent = e.target;
  console.log(modalEvent); //testing the event target! Just testing purpose :P
  if (modalEvent.classList.contains("close-btn") || modalEvent.classList.contains("close")) {
    modal.style.display = "none";
    showLastButton();
  } else {
    if (modalEvent.classList.contains("btn","cta")) {
      modal.style.display = "none";
      restarting();
      bootDelayed();
    }
  }
});

bootGame();
