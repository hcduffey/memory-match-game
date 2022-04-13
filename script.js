// CLASSES

class highScoreRecord {
    constructor(name, time, moves) {
        this.name = name;
        this.time = time;
        this.moves = moves;
    }
}


// VARIABLES

// let cards = new Array(48).fill(1);
let cards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
let firstCard = null;
let secondCard = null;
let active = false;
let gameStarted = false;
let startTime = Date.now();
let timerInterval;
let highScoreArray = [];

// HELPER FUNCTIONS

// Randomly assigns images to the card - ensuring there are 2 per image assigned (so there is always a pair)
function randomizeCards() {
    cards.forEach((element, index) => {
        let switchedIndex = parseInt(Math.random() * 24);
        cards[index] = cards[switchedIndex];
        cards[switchedIndex] = element;
    });
}

// Uses CSS to reveal the image assigned to a card
function revealCard(number) {
    $(`#${number}`).css("background-image", `url("images/image${cards[number-1]}.jpg")`);
    $(`#${number}`).removeClass("hidden");
}

// Uses CSS to hide a card back so the image is no longer displayed
function hideCard(number) {
    $(`#${number}`).css("background-image", "none");
    $(`#${number}`).addClass("hidden");
}

// Takes in #ids of two cards and determines whether a match has been found (boolean is returned)
function isSame(id1, id2) {
    if (cards[parseInt(id1)-1] === cards[parseInt(id2)-1]) {
        return true;
    }
    else {
        return false;
    }
}

// Determines if the player has won the game (no cards are hidden)
function wonGame() {
    let win = true;

    $(".card").each(function(){ 
        if($(this).hasClass("hidden")) {
            win = false;
        }
    });

    return win;
}

// Used in setInterval to update the timer
function updateTime() {
    let s = parseInt((Date.now() - startTime)/1000);
    let m = 0;
    let h = 0;

    while(s >= 60) {
        s -= 60;
        m++;
    }
    while(m >= 60) {
        m -= 60;
        h++;
    }

    if(s < 10) {
        s = "0" + s.toString();
    }
    if(m < 10) {
        m = "0" + m.toString();
    }
    if(h < 10) {
        h = "0" + h.toString();
    }


    $(".timer").text(`${h} : ${m} : ${s}`);
}

// cycles through 
function displayHallOfFame() {
    let table = "";

    highScoreArray.forEach((element) => {
        table += `<tr>
            <td>${element.name}</td>
            <td>${element.moves}</td>
            <td>${element.time}</td>
        </tr>`;
    });

    return table;
}

// EVENT HANDLERS

// Handles clicks to a card
$('.card').click(function() {
    if((gameStarted) && (active) && ($(this).hasClass("hidden"))) {
        if($(this).hasClass("hidden")) {
            if(firstCard === null) {
                firstCard = $(this).attr("id");
                revealCard(firstCard);
            }
            else {
                secondCard = $(this).attr("id")
                revealCard(secondCard);
                $(".moves").text(parseInt($(".moves").text())+1);
                if(isSame(firstCard, secondCard)) {
                    if(wonGame()) {
                        $("#win-modal").css("display", "block");
                        clearInterval(timerInterval);
                        gameStarted = false;
                    }
                    $(`#${firstCard}`).css("filter", "brightness(0.8)");
                    $(`#${secondCard}`).css("filter", "brightness(0.8)");
                    firstCard = null;
                    secondCard = null;
                } 
                else {
                    active = false;
                    setTimeout(function() {
                        hideCard(firstCard);
                        hideCard(secondCard);
                        firstCard = null;
                        secondCard = null;
                        active = true;
                    }, 750);
                }
            }
        }
    }
    if(gameStarted === false) {
        $(".reset-btn-container").effect("shake");
    }
});

// Handles clicks to the Start/Reset button
$(".reset-btn").click(function() {
    active = true;
    gameStarted = true;
    $(".card").each(function() {
        hideCard($(this).attr("id"));
    });

    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 1000);
    $(".moves").text(0);

    randomizeCards();
});

// Handles events on the win modal
$(".w3-button.w3-display-topright").click(function() {
    $("#win-modal").css("display", "none");
});

$("#high-score-name-btn").click(function() {
    const score = new highScoreRecord($("#highscore-name").val(), $(".timer").text(), $(".moves").text());
    highScoreArray.push(score);
    $("#win-modal").css("display", "none");
    console.log(highScoreArray);
});

// Handles High score modal events

$('#highscores-btn').click(function() {
    $('#highscores-modal').css("display", "block");
    $('#halloffame-tbody').html(displayHallOfFame());
});


