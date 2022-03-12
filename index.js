//non-tutorial comments are USUALLY closest to the left side. 

//*Please note, this code will be over commented on purpose. They're intended to be notes to learn from.

//A board for each difficulty apparently. I would like deviate from the
//orginal tutorial a bit and create more of these. 
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [ //His tutorial had a mistake, medium[0].length == 80
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//Create variables
var timer; 
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;
var theme=0; //current theme selected 0=light 1=dark 2=matrix


window.onload = function() {
    //Will wait until everything's loaded and then will run after.
    
    //Theme buttons
    //The Theme buttons will now start the game.
    id("light").addEventListener("click",lightTheme);
    id("dark").addEventListener("click",darkTheme);
    id("matrix").addEventListener("click",matrixTheme);


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

    maybe rewatch from the beginning 

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
                    updateMove(); //doesn't seem to do anything *yet*
                }
            }
        });
    }

}

function startGame() {
    //Choose board difficulty
    //.checked can be used with checkboxes and radio input types
    //it will take an action if the element with id "diff-1" is 
    //checked 
    let board;

    if(id("diff-1").checked) board = easy[0];
    else if(id("diff-2").checked) board = medium[0];
    else board = hard[0];

    //Set lives to 3 and enable selecting numbers and tiles. 
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: " + lives;

    //Creates board based on difficulty
    generateBoard(board);

    //Starts the timer
//startTimer(); The timer was just getting a little annoying.

    //Show number container / but why though?
    id("number-container").classList.remove("hidden");

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

    if(time == 69){
        return "ay lmao, nice"; //Stupid/funny little easter egg lol
    } else {
        let minutes = Math.floor(time / 60);
        if (minutes < 10) minutes = "0" + minutes; //if a leading zero is important to you
        let seconds = time % 60;
        if (seconds < 10) seconds = "0" + seconds;
        return minutes + ":" + seconds;
    }
}

//The breakdown and understanding of this function is answered in number 1.
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
                    if(selectedTile==tile){ //tile.classList.contains("selected") tutorial orginal
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        selectedTile = null;
                    } else { 
                        //Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            //"Accessing any element that has the .tile class"
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //This is an enhancement to create crosshairs for the user.
                        for (let i = 0; i < 81; i++){
                            //This will selected everything above and below selected tile
                            let toprow = tile.id%9;
                            for(let k = 0; k < 9; k++) { //A simple, take 9 actions.
                                qsa(".tile")[toprow].classList.add("selected");
                                toprow+=9;
                            }
                            //This will select everything left and right of selected tile
                            let startrow = Math.floor(tile.id/9)*9; //gets rid of remainder
                            for(let j = 0; j < 9; j++) {
                                qsa(".tile")[startrow + j].classList.add("selected");
                            } 
                        }
                        selectedTile = tile;
                        updateMove();
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
            //tile.style.border = "1px solid rgb(255,255,255)";
            tile.classList.add("mBorder");

            if ((tile.id > 17 && tile.id <27) || (tile.id > 44 & tile.id < 54)) {
                tile.style.borderBottom = "4px solid rgb(255,255,255)";
                //tile.classList.add("mbottomBorder");
            }
            if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
                tile.style.borderRight = "4px solid rgb(255,255,255)";
                //tile.classList.add("mrightBorder"); didn't want to work...
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
    *Notes | 
    
    *So an id is something to label an element in the .html file in order to 
    later access it in the javascript file. 

    *Difference between let and var is 
    let is defined within the scope of a single block (if, for loop, etc.)
    var is restricted to a function at the least or a global variable as the most.

    *.css selectors - So it seems that .tile, the .css selector, is holding the data
    for all tiles created both before and after they're created. 

    *Another interesting fun fact. If a function fails to get called, all the code after
    that won't run. Zum bespiel, in startgame(), if you fail to call the timer, the remove 
    hide function for the number container won't work anymore. 
*/
