//non-tutorial comments are USUALLY closest to the left side. 
//*Please note, this code will be over commented on purpose. They're intended to be notes to learn from.
/* Short term task list

    - You can now create the 
    solver button. When doing this task DO NOT just fill out the tiles
    from the solution boards. You need to do the actual calculation in
    a way that if any board was stored properly, the solver would be able
    to actually solve the board. 

 */

//A board for each difficulty apparently. I would like deviate from the
//orginal tutorial a bit and create more of these. 
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",//board
    //"685329174971485326234761859362574981549618732718293465823946517197852643456137--8",
    //^29 is missing, use to test win condition ^
    "8-6-1------3-64-9-9-----816-8-396---7-2-4-3-9---572-8-521-----4-3-75-2------2-1-5",
    "-7--2--46-6----89-2--8--715-84-97---71-----59---13-48-697--2--8-58----6-43--8--7-",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298",//answers
    "856917423213864597947235816185396742762148359394572681521683974439751268678429135",
    "875921346361754892249863715584697123713248659926135487697412538158379264432586971"
];
const medium = [ //His tutorial had a mistake, medium[0].length == 80
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---",
    "5-72---9---6-3-7-14------6-1--49---7---5-8---8---27--5-7------92-9-8-6---4---93-8",
    "2-----69--5---3---17---94-5--3-25-18----4----72-38-5--5-26---41---5---7--67-----3",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
    "517264893926835741483971562135496287792518436864327915378642159259183674641759328",
    "234158697956473182178269435643925718815746329729381564592637841381594276467812953",
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "--65----8-95----2-7--9--3------4-27----873----79-5------2--8--9-5----81-3----54--",
    "-91-7----2-3----5----4-29-7--28-6--9---------9--1-46--1-52-7----8----5-1----1-76-",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
    "136524798895367124724981356583649271261873945479152683642718539957436812318295467",
    "491675238273981456856432917712856349564793182938124675145267893687349521329518764"
];

//Create variables
var timer; 
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;
var boardnum;
var theme=0; //current theme selected 0=light 1=dark 2=matrix


window.onload = function() {
    //Will wait until everything's loaded and then will run after.
    
    //Buttons
    //The Theme buttons will now start the game.
    id("light").addEventListener("click",lightTheme);
    id("dark").addEventListener("click",darkTheme);
    id("matrix").addEventListener("click",matrixTheme);

    id("solve").addEventListener("click", solve);
//ep. 4 00:00 - 9:30 selecting tiles STUDY CODE
/*  The for loop is going through the amount of elements in "number-container"
    So we're accessing the div id "number-container". we're going through each
    child element with <children[i]>. window.onload seems to make this a sort
    of endless loop that constantly scans the number container to see if any
    of them have been clicked on hence the addEventListener function. 
    From the two conditionals, the left is obvious while the anonymous 
    function requires more attention.
    if disableSelect == false (so it is enabled)
    if this (assuming that's the 'p' or tile of number-container) contains the
    .css attribute "selected", it will be deselected or this.classList.remove("selected");
    The else deselects any unselected numbers in case you pick a new one while one is
    already selected.
    *you can also look at "this" as the [i] in children[i]

 */

    for(let i=0; i < id("number-container").children.length; i++){
        id("number-container").children[i].addEventListener("click", function() {
            //If selecting is not disabled
            if (!disableSelect) {
                //If number is already selected.
                if (this.classList.contains("selected")){
                    //Then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //Deselect all other numbers
                    for (let i = 0; i < 9; i++){
                        id("number-container").children[i].classList.remove("selected");
                    }
                    //Select it and update selectedNum variable
                    this.classList.add("selected");
                    selectedNum=this;
                    updateMove(); //Start of ep. 4 - 14:30
                }
            }
        });
    }

} //End of window.onload

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//The solve button is hidden until a board is startGame()
//is executed 


function solve () {
    console.log("entered solve()");
    //functions don't want to work with while, works with numbers though!
    //This will continue until the board is filled out

    
    //An array of an array to access board id's (thereby their numbers)
    //We need this due to the orginal way the board was established by
    //the tutorial unfortunately 
        
        
    
    /* perhaps then something can be learned from this.
    instead of using a while loop, you need to understand the
    concept of backtracing through recursion. You can keep 
    your process scanning through the board but you should get
    rid of the while loop and instead use recursion.
    
    You need to understand what goes in and what comes out of
    this block of code below, it needs to be turned into a 
    function named "possible" that returns true if a number
    is possible and false if NO number is possible. It will 
    take in row, col and the number between 1-9 that's being 
    tested. If the number being tested shows up in the set,
    it is possible. tiles can just be passed down too for now
    so we can keep access to them out here as well.
    */

    //don't need it in solve
    let tiles = qsa(".tile");
    
    //I know it sucks but the way the tutorial was structured 
    //it has to be done this way. Now doing more to build on the 
    //tutorial, I see how poorly it was done and would have done 
    //the entire project in a completely different way 
    let boardaccess = [
        [0,1,2,3,4,5,6,7,8],
        [9,10,11,12,13,14,15,16,17],
        [18,19,20,21,22,23,24,25,26],
        [27,28,29,30,31,32,33,34,35],
        [36,37,38,39,40,41,42,43,44],
        [45,46,47,48,49,50,51,52,53],
        [54,55,56,57,58,59,60,61,62],
        [63,64,65,66,67,68,69,70,71],
        [72,73,74,75,76,77,78,79,80]
    ];
    
    //Base tiles
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {


            if (tiles[boardaccess[row][col]].textContent == "") {
                console.log("Start of tile " + tiles[boardaccess[row][col]].id);
                for (let n = 1; n <= 9; n++) {
                    //console.log(n + ": " + possible(row, col, n, tiles, boardaccess));
                    //console.log(possible(row,col,n,tiles,boardaccess) + "  n: " + n);
                    console.log("  n: " + n);
                    if (possible(row,col,n,tiles,boardaccess)) {
                        console.log("possible n: " + n);
                        tiles[boardaccess[row][col]].textContent = n;
                        solve();
                        tiles[boardaccess[row][col]].textContent = "";
                    }
                }
                //tiles[boardaccess[row][col]].textContent = "";
                console.log("returned");
                return;
            }
           
            

        }// End of base tile col
    }// End of base tile row
    
    
    
    
    
}// End of solve


function possible(row,col,n,tiles,boardaccess) {
    
    
    
    //This will go through rows, col and box of tiq
    /*
    00,01,02,03,04,05,06,07,08
    10,11,12,13,14,15,16,17,18
    20,21,22,23,24,25,26,27,28
    30,31,32,33,34,35,36,37,38
    40,41,42,43,44,45,46,47,48
    50,51,52,53,54,55,56,57,58
    60,61,62,63,64,65,66,67,68...
    */


    //Delete if next plan returns proper results
    //Checks down the rows of the current base tile / vertical check
    // console.log("-------------- Base tile: " + boardaccess[row][col]);
    // for (let chkrow = 0; chkrow < 9; chkrow++) {
    //     //console.log("checking down the rows: " + boardaccess[chkrow][col]);
    //     for (let chkset = 0; chkset < 9; chkset++) {
    //         //console.log("set[chkset]: " + set[chkset] + "   tiles.textContent: " + tiles[boardaccess[chkrow][col]].textContent);
    //         if(set[chkset] == tiles[boardaccess[chkrow][col]].textContent) {
    //             //console.log("it's a match ^");
    //             set[chkset]=-1;
    //             //Now we're going through the process of elimination 
    //         }
    //     }
    // }

    //console.log("row, n: " + n);
    for (let i = 0; i < 9; i++) {
        if (tiles[boardaccess[row][i]].textContent == n) {
            return false;
        }
    }

    //Delete if next plan returns proper results
    //Checks over the columns of the current base tile / horizontal check
    // for (let chkcol = 0; chkcol < 9; chkcol++) {    
    //     //console.log("checking over the columns: " + boardaccess[row][chkcol]);
    //     for (let chkset = 0; chkset < 9; chkset++) {
    //         //console.log("set[chkset]: " + set[chkset] + "   tiles.textContent: " + tiles[boardaccess[row][chkcol]].textContent);
    //         if (set[chkset] == tiles[boardaccess[row][chkcol]].textContent) {
    //             //console.log("it's a match ^");
    //             set[chkset]=-1;
    //         }
    //     }
    // }
    //console.log("col n: " + n);
    for (let i = 0; i < 9; i++) {
        if (tiles[boardaccess[i][col]].textContent == n) {
            return false;
        }
    }

    //console.log("box n: " + n);
    //Checks all the numbers in the same box
    for (let chkrow = 0; chkrow < 9; chkrow++) { //Check tiles 
        for (let chkcol = 0; chkcol < 9; chkcol++) {

            for (let chkset = 0; chkset < 9; chkset++) {

                //If Base tile is in box 1, cycle through box 1 id's 
                if ((row<3 && col<3) && (chkrow<3 && chkcol<3)) {
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row<3) && (col>=3 && col<=5)) && ((chkrow<3) && (chkcol>=3 && chkcol<=5))) { //box 2
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row<3) && (col>=6)) && ((chkrow<3) && (chkcol>=6))) { //box 3
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row>=3 && row<=5) && (col<3)) && ((chkrow>=3 && chkrow<=5) && (chkcol<3))) { //box 4
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row>=3 && row<=5) && (col>=3 && col<=5)) && ((chkrow>=3 && chkrow<=5) && (chkcol>=3 && chkcol<=5))) { //box 5
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row>=3 && row<=5) && (col>5)) && ((chkrow>=3 && chkrow<=5) && (chkcol>5))) { //box 6
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row>5) && (col<3)) && ((chkrow>5) && (chkcol<3))) { //box 7
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row>5) && (col>=3 && col<=5)) && ((chkrow>5) && (chkcol>=3 && chkcol<=5))) { //box 8
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                } else if (((row>5) && (col>5)) && ((chkrow>5) && (chkcol>5))) { //box 9
                    if (n == tiles[boardaccess[chkrow][chkcol]].textContent) {
                        return false;
                    }
                }// End of all boxes 1-9
                
            }

        }
    }// End of check in box 

    return true;



}// End of possible()







//!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function startGame() {
    //Choose board difficulty
    //.checked can be used with checkboxes and radio input types
    //it will take an action if the element with id "diff-1" is 
    //checked 
    let board;

    //For some reason, multiplying instead of dividing gives you a number
    //between 0 and n-1. Take indexing into account, start at 0
    boardnum = Math.floor(Math.random() * 3); //0,1,2

    if(id("diff-1").checked) board = easy[boardnum];
    else if(id("diff-2").checked) board = medium[boardnum];
    else board = hard[boardnum];

    //Set lives to 3 and enable selecting numbers and tiles. 
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: " + lives;

    //Creates board based on difficulty
    generateBoard(board);

    //Starts the timer
//startTimer(); //Removed for testing purposes

    //Show number container and solve button
    id("number-container").classList.remove("hidden");
    id("solve").classList.remove("hidden");

}

//Your next step seems to be getting an understanding of the timer.
function startTimer() {
    //Sets time remaining based on input
    if(id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;

    //Sets timer for first second
    id("timer").textContent = timeConversion(timeRemaining);

    //Sets timer to update every second 
    timer = setInterval(function() {
        timeRemaining--;
        //if no time remaining end the game
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000); 
    //Understanding setInterval();
    //setInterval(<action taken...>,<... every 1000 milliseconds>)
}

//Converts seconds into string of MM:SS format.
function timeConversion(time) {

    if(time == 69) {
        return "ay lmao, nice"; //Stupid/funny little easter egg lol
    } else {
        let minutes = Math.floor(time / 60);
        if (minutes < 10) minutes = "0" + minutes; //if a leading zero is important to you
        let seconds = time % 60;
        if (seconds < 10) seconds = "0" + seconds;
        return minutes + ":" + seconds;
    }
}

//Start of ep. 4 - 14:30
function updateMove() {
    // If a tile and a number is selected
    if (selectedTile && selectedNum) {
        // Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        //If the number matches the corresponding number in the solution key
        //this is done in this function in order to use the code elsewhere
        containCheckCorrect(selectedTile);
    }

}

//not sure if using <selectedTile> twice will break it
function containCheckCorrect(selectedTile) {

    if(checkCorrect(selectedTile)) {
        //Deselect the tiles
        for (let i = 0; i < 81; i++) {
            qsa(".tile")[i].classList.remove("selected");
        }
        //Deselect the number container tiles
        for (let i = 0; i < id("number-container").children.length; i++) {
            id("number-container").children[i].classList.remove("selected");
        }

        //Clear the selected variables, keeping these on top fixed
        //the stay selected switch issue.
        selectedNum = null;
        selectedTile = null;
        
        //Check if board is completed 
        if (checkDone()) {
            endGame();
        }

    } else { //If the number does not match the solution key
        //Disable selecting new number for one second
        disableSelect = true;
        //Make the tile turn red
        selectedTile.classList.add("incorrect");
        //Run in one second
        setTimeout(function() {
            //Subtract lives by one
            lives --;
            //If no lives left end the game
            if (lives === 0) {
                endGame();
            } else {
                //If lives is not equal to zero
                //update lives text
                id("lives").textContent = "Lives Remaining: " + lives;
                //Renable selecting numbers and tiles
                disableSelect = false;
            }
            // Restore tile color and remove selected from both
            selectedTile.classList.remove("incorrect");
            selectedTile.textContent = "";
            //We'll have to  remove selected from all tiles here
            for (let i = 0; i < 81; i++) {
                qsa(".tile")[i].classList.remove("selected");
            }
            selectedNum.classList.remove("selected");
            //Clear the tiles text and clear selected variables
            selectedTile.textContent = "";
            selectedTile = null;
            selectedNum = null;

        }, 1000);
    }

}

//Will check if the board is fully filled out.
function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === "") return false;
    }
    console.log("checkDone");
    filled = 1; //For solve() while loop
    return true;
}

function endGame() {
    //Disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);
    //Display win or loss message
    if (lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You Lost!";
    } else {
        id("lives").textContent = "You Won!";
    }
}

//ep. 4 - 17:00
function checkCorrect(tile) {
    //Set solution bsed on difficulty selection
    let solution;

    if (id("diff-1").checked) {solution = easy[boardnum+3];}
    else if(id("diff-2").checked) {solution = medium[boardnum+3];}
    else {solution = hard[boardnum+3];}
    
    //If tile's number is equal to solution's number.
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}




//Allowing the user to use keys to enter answers for faster interaction
document.onkeydown = function(e) {
    e = e || window.event; //Studying what this does!
    if (e.keyCode == 49 || e.keyCode == 97) {
        selectedTile.textContent = 1;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 50 || e.keyCode == 98) {
        selectedTile.textContent = 2;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 51 || e.keyCode == 99) {
        selectedTile.textContent = 3;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 52 || e.keyCode == 100) {
        selectedTile.textContent = 4;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 53 || e.keyCode == 101) {
        selectedTile.textContent = 5;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 54 || e.keyCode == 102) {
        selectedTile.textContent = 6;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 55 || e.keyCode == 103) {
        selectedTile.textContent = 7;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 56 || e.keyCode == 104) {
        selectedTile.textContent = 8;
        containCheckCorrect(selectedTile);
    } else if (e.keyCode == 57 || e.keyCode == 105) {
        selectedTile.textContent = 9;
        containCheckCorrect(selectedTile);
    }
};

//The breakdown and understanding of this function is answered in question one on bottom.
function generateBoard(board) {
    //Clear previous board
    clearPrevious();

    //a let, used to incrememnt tile ids
    let idCount = 0;
    //create 81 tiles
    for (let i = 0; i<81; i++){
        //Create a new paragraph element (which act as the tiles)
        let tile = document.createElement("p");

        //If the tile shouldn't be blank 
        if (board.charAt(i) != "-") { // replace . with -
            //Set tile text to correct number
            tile.textContent = board.charAt(i);
        } else {

            //ep.4 9:30 - 14:30 Giving the board the ability to have tiles be highlighted
            //After the rest of the tutorial, add more by fixing same row/col crosshair clicks
            //Add click event listener to tile
            tile.addEventListener("click", function() {
                //If selecting is not disabled
                if(!disableSelect) {  
                    //If the tile is already selected

                    //doubling up is ok for now with one extra theme, but there should
                    //be a better system for this, one that switches multiple themes
                    if(selectedTile==tile){ //tile.classList.contains("selected") tutorial orginal
                        for (let i = 0; i < 81; i++) {
                                qsa(".tile")[i].classList.remove("mselected");
                                qsa(".tile")[i].classList.remove("selected");
                        }
                        selectedTile = null;
                    } else { 
                        //Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            //"Accessing any element that has the .tile class"
                                qsa(".tile")[i].classList.remove("mselected"); 
                                qsa(".tile")[i].classList.remove("selected");
                        }
                        //This is an enhancement to create crosshairs for the user.
                        for (let i = 0; i < 81; i++){
                            //This will selected everything above and below selected tile
                            let toprow = tile.id%9;
                            for (let k = 0; k < 9; k++) { //A simple, take 9 actions.
                                if (theme == 2){
                                    qsa(".tile")[toprow].classList.add("mselected");
                                } else {
                                    qsa(".tile")[toprow].classList.add("selected");
                                }
                                toprow+=9;
                            }
                            //This will select everything left and right of selected tile
                            let startrow = Math.floor(tile.id/9)*9; //gets rid of remainder
                            for(let j = 0; j < 9; j++) {
                                if (theme == 2){
                                    qsa(".tile")[startrow + j].classList.add("mselected");
                                } else {
                                    qsa(".tile")[startrow + j].classList.add("selected");
                                }
                            } 
                        }
                        selectedTile = tile;
                        updateMove(); //Starting ep.4 - 14:30
                    }
                }
            });
        }

        //Assign tile id
        tile.id = idCount;
        //Incrememnt for next tile
        idCount++;
        tile.classList.add("tile");

        //Changes the theme of the 
        if(theme!=0){ //Matrix
            tile.classList.add("mBorder");

            if ((tile.id > 17 && tile.id <27) || (tile.id > 44 & tile.id < 54)) {
                tile.style.borderBottom = "4px solid rgb(255,255,255)";
            }
            if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
                tile.style.borderRight = "4px solid rgb(255,255,255)";
            }

        } else {
            //These two if statements are boldining the appropriate 
            //bottom and right borders of the tile cells according to their id
            if ((tile.id > 17 && tile.id <27) || (tile.id > 44 & tile.id < 54)) {
                tile.classList.add("bottomBorder");
            }
            if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
                tile.classList.add("rightBorder");
            }
        }


        //Add tile to board
        id("board").appendChild(tile);

    }
}

function clearPrevious() {
    //So it seems that .tile, the .css selector, is holding the data
    //for all tiles created both before and after they're created. 
    
    let tiles = qsa(".tile");

    //Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    //If there is a timer clear it
    if (timer) clearTimeout(timer);
    //Deslect any numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
    
}

    //helper functions
function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

function id(id) {
    //Seems to be a simple getter function for an "id"
    return document.getElementById(id);
}

    //Themes (I feel like there's a better way to do this with radios.)
function lightTheme() {
    qs("body").classList.remove("dark");
    qs("body").classList.remove("matrix");
    theme=0;
    startGame();
}
function darkTheme() {
    qs("body").classList.remove("matrix");
    qs("body").classList.add("dark");
    theme=1;
    startGame();
}
function matrixTheme() {
    qs("body").classList.remove("dark");
    qs("body").classList.add("matrix");
    theme=2;
    startGame();
}




/*So maybe I can store some personal questions here.

    These are improvements that need to be included in the readme, in 
    order to tell the difference between what I've done and what was 
    followed in the tutorial.
    ----------------------------------------------------------------------
    Tasks (Added code that goes beyond the tutorial)

           *Finish the tutorial first!
        T: Learn the rules in order to create an autosolver (After finishing)
        A:

        T: Add more boards with some kind of randomizer process.
        A:

        T: highlighting tiles is already set for which single tile is clicked on.
    To enhance this, add an option to see what numbers are in a line from 
    left, right, top and bottom. 
        A: In generateBoard(), there's an event listener where the highlighting portion
    takes place. I did some simple math to find the far left number and highlight the 
    entire row of that start number based on the tile clicked. Similiar to left and right,
    I started at the top row with a module function and added select to each tile +9 places
    in the array of tiles. Combined, this makes a crosshair for the user. This was enhanced
    further by making the if statement if(selectedTile == tile) instead of if(...contains("selected"))
        E: 

        T: create more themes with the selectors, do something similiar 
    to the dark and light screen settings. 
        A: Because the tiles id/names come up as "undefined" in the 
    console log therefore I'm not able to switch the theme mid game, I
    came up with a solution. keep track of the theme selected and change
    it during generation. So now you select your theme to begin. I achieved 
    my goal but it'd be a better challenge if the theme could be changed
    mid game. 
        E: Also try to make the theme change instant, not when you press start game.

    -----------------------------------------------------------------------
    Questions
    
    1. Where does the creation of the board itself begin? Explain.

    The tutorial guide added a border to each tile by adding <border: 1px black;>
    to a variable called with <document.queryselectorall(.tile);>. Anything created
    with a call to this .css variable will gain its attributes. This was done first
    through clearPrevious();.
    The board and .tile elements in the .css fil were centered and made the proper 
    size that would automatically push the next elements down a line after 9 elements.
    You can change the size but if the ratio of the sizes of the tiles, font and board
    aren't adjusted appropriately, you won't have a proper 9x9 board.  
    After setting each future paragraph elements attributes (while simultaneously 
    removing the previous board). We create a for loop which will create a tile
    for each itteration and attach it to the overall 'board' id. Other adjustments
    outside of the .css file can be made, such as the two if statements that more 
    heavier bolden the bottom and right sides of the proper paragraph element id's.
    The base element or the board itself is also created in the .css file.
    You'll notice that at the end of the for loop of generateBoard. Each tile
    create is lastly fitted to the board id by appending the tile to it. 

    2. Where does the interaction between the user and board begin? Explain.

    As far as highlighting goes, you need to create a listener function. The two 
    conditions are what is being clicked (can be looked up) and the second condition
    is a function (usually an anonymous one) that takes a specific action upon that 
    button being pressed. This function will wait for an interaction by the user and
    take the action included in the code of the second condition aka the anonymous function.
    In this case, highlighting a tile on the board that is clicked.

    3. Creating a timer/working with time, is good knowledge for most websites 
    Explain how it was done.

    This one is actually easier than what I'm used to with java. In JS, you can just 
    create a value with a number and consider it seconds so long as you use 
    1000 milliseconds(1 second) with the setInterval function's second condition. 
    Within that supposedly anonymous function, you subtract one from the variable and
    include what you want to happen each time that int ticks down by 1. Making it look
    like time is all about formatting and that can be seen in the timeConversion function.

    4. 


    ----------------------------------------------------------------------
    *Notes | https://www.youtube.com/watch?v=s598MZBH0iY
    instruction: follow the rest of video, 
    updateMove 14:30 - 27:43 // study this section 
    endGame 27:43 - end? // study this as well.

    *Selection system - The tutorial's system was apparently uncomplete.
    it seemed that it wouldn't deselect in some conditions. My newer and 
    imporoved version gives the user two options. Click the board to see
    the crosshairs and then select your number from the right, or if you
    know the answer, select the number on the right and click a tile and 
    if correct, crosshairs will be avoided. If wrong, crosshairs will 
    highlight for assistance.
    
    *Keep it just in case 
    //console.log((a*9)+(tiq%9));
    //console.log((Math.floor(tiq/9)*9)+b);

    *So an id is something to label an element in the .html file in order to 
    later access it in the javascript file. 

    *added 2 more boards for each difficulty, made a quick randomizer
    for the extra boards. 

    *Difference between let and var is 
    let is defined within the scope of a single block (if, for loop, etc.)
    var is restricted to a function at the least or a global variable as the most.

    *.css selectors - So it seems that .tile, the .css selector, is holding the data
    for all tiles created both before and after they're created. 

    *Another interesting fun fact. If a function fails to get called, all the code after
    that won't run. Zum bespiel, in startgame(), if you fail to call the timer, the remove 
    hide function for the number container won't work anymore. 

    *A good idea for future projects is to keep short term versions of files 
    that you change.

    *included the ability to type in your answer 1-9
    
    *later you should also filter the improvements out of these notes

    *I think what I learned most about this is that the orginal tutorial guide went
    about this completely wrong. They went down a linear tile.id assignment 
    when what he should have done was make an array in an array and organize 
    the tiles that way. I've gone ahead and combined the orginal concept with 
    my own for the solution function but I think if I had to do this over, it 
    would be done in a completely different way. 
*/
