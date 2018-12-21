var cards = ["diamond","plane","anchor","bolt","leaf","bicycle","bomb","cube"];

let openedCard,	blocked, moves, found, clickedFirst, rating, startDate, time;

var cardsArray = [];

for (var i=0; i<cards.length; ++i) {
	cardsArray.push(cards[i]);
	cardsArray.push(cards[i]);
}

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

function startGame() {
  cardsArray = shuffle(cardsArray);
	resetVariables();
	clearTimer();
	clearRating();
  $("ul.deck").empty();
	for (let i=0; i<cardsArray.length; ++i) {
		$('<li class="card"><i class="fa fa-'+cardsArray[i]+'"></i></li>').on("click",function() {
			if (!blocked) {
				if (!clickedFirst){
					renderTimer();
				}
				cardClicked($(this),i);
			}
		}).appendTo($("ul.deck"));
	}
}

function cardClicked(obj,i) {

	clickedFirst = true
	obj.addClass("open").addClass("show");
	if (openedCard) {
		blocked = true;
		if (cardsArray[openedCard.index] === cardsArray[i]) {
			if (openedCard.index === i) {
				blocked = false;
				return false;
			};
			openedCard.jqObject.off("click");
			obj.off("click");
				setTimeout(function() {
				openedCard.jqObject.removeClass("show").addClass("good");
				obj.removeClass("show").addClass("good");
			},500);
			setTimeout(function() {
				openedCard.jqObject.removeClass("good").addClass("match");
				obj.removeClass("good").addClass("match");
				openedCard = null;
				blocked = false;
			},1000);
			found = found + 1;
      renderFound();
		} else {
			setTimeout(function() {
				openedCard.jqObject.removeClass("show").addClass("nomatch");
				obj.removeClass("show").addClass("nomatch");
			},500);
			setTimeout(function() {
				openedCard.jqObject.removeClass("open").removeClass("nomatch");
				obj.removeClass("open").removeClass("nomatch");
				// reset blocker and opened card variables due to no match
				openedCard = null;
				blocked = false;
			},1000);
		}
		moves = moves + 1;

		renderMoves();

		renderRating();
	} else {
		openedCard = {
			jqObject: obj,
			index: i
		};
		blocked = false;
	}
}

function resetVariables() {
	openedCard = null;
	blocked = false;
	moves = 0;
	found = 0;
	startDate = new Date();
	clickedFirst = false;
}

function renderMoves() {
	$("span.moves").text(moves);
}

function renderFound() {
	$("span.found").text(found);
	if (found === cards.length) {
		setTimeout(function() {
			renderModal()
		},1000);
	}
}

function renderModal() {
	clearInterval(time);
	$("ul.stars").clone().appendTo($("div.starlets"));
	$("div.timer").text($(".time").text().slice(5));
	$("div.moves").text(moves);
	$(".modal").show();
}

function renderRating() {
	if (moves <= 13) {
		num = 3;
	} else if (moves > 13 && moves <= 18) {
		num = 2;
	} else {
		num = 1;
	}
	$("ul.stars").empty();
	for (var i=0; i<num; ++i) {
		$('<li><i class="fa fa-star"></i></li>').appendTo($("ul.stars"));
	}
}

function clearRating() {
	var num = 3;
	$("ul.stars").empty();
	for (var i=0; i<num; ++i) {
		$('<li><i class="fa fa-star"></i></li>').appendTo($("ul.stars"));
	}
}

function renderTimer() {
	let startTime = new Date().getTime();
	time = setInterval(function() {
		current = new Date().getTime();
		timer = current - startTime;
		let minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timer % (1000 * 60)) / 1000);
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		$(".time").text("Time: "+minutes+":"+seconds);
  }, 1000);
}

function clearTimer() {
	clearInterval(time);
	timer = "0:00";
	$(".time").text("Time: "+timer);
}


$(document).ready(function() {
 	startGame();
 	$("div.restart").on("click", function() {
 		cardsArray = shuffle(cardsArray);
    startGame();
		clearTimer();
 		renderMoves();
 		renderFound();
		clearRating();
 	})
	$("#init").on("click", function() {
		$(".modal").hide();
		cardsArray = shuffle(cardsArray);
		startGame();
		clearTimer();
		renderMoves();
		renderFound();
		clearRating();
	})
	$("#end").on("click", function() {
		$(".modal").hide();
	})
});

startGame();
