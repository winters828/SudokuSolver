//*Please note, this code will be over commented on purpose. They're intended to be notes to learn from.

//A board for each difficulty apparently. I would like deviate from the
//orginal tutorial a bit and create more of these. 
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
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


window.onload = function() {
    //Will wait until everything's loaded and then will run after.
    //Run startgame function when button is clicked.
    id("start-btn").addEventListener("click", startGame);

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

}

//The breakdown and understanding of this function is answered in number 1.
function generateBoard(board) {
    //Clear previous board
    clearPrevious();

    //a let, used to incrememnt tile ids
    let idCount = 0;
    //create 81 tiles
    for (let i = 0; i<81; i++){
        //Create a new paragraph element
        let tile = document.createElement("p");

        //If the tile shouldn't be blank 
        if (board.charAt(i) != "-") {
            //Set tile text to correct number
            tile.textContent = board.charAt(i);
        } else {
            //Add click event listener to tile
        }

        //Assign tile id
        tile.id = idCount;
        //Incrememnt for next tile
        idCount++;
        tile.classList.add("tile");

        //These two if statements are boldining the appropriate 
        //bottom and right borders of the tile cells according to their id
        if ((tile.id > 17 && tile.id <27) || (tile.id > 44 & tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }

        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }

        //Add tile to board
        id("board").appendChild(tile);

//Left off at 27:14
//Make sure you understand down to the smallest detail how and
//why the board is generated the way it is. Once you're certain 
//you've done that you can continue. 
    }
}

function clearPrevious() {
    //Access all of the tiles
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




/*So maybe I can store some personal questions here.



    To do (to improve on the tutorial):

     - Learn the rules in order to create an autosolver

     - Add more boards with some kind of randomizer process.

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
    After setting each future paragraph elements attributes (while simultaniously 
    removing the previous board). We create a for loop which will create a tile
    for each itteration and attach it to the overall 'board' id. Other adjustments
    outside of the .css file can be made, such as the two if statements that more 
    heavier bolden the bottom and right sides of the proper paragraph element id's.
    The base element or the board itself is also created in the .css file.
    You'll notice that at the end of the for loop of generateBoard. Each tile
    create is lastly fitted to the board id by appending the tile to it. 

    2. Where does the interaction between the user and board begin? Explain.

    3. Creating a timer/working with time, is good knowledge for most websites 
    Explain how it was done.


    ----------------------------------------------------------------------
    *Notes | 
    
    *So an id is something to label an element in the .html file in order to 
    later access it in the javascript file. 

    *Difference between let and var is 
    let is defined within the scope of a single block (if, for loop, etc.)
    var is restricted to a function at the least or a global variable as the most.
*/
