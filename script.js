
// Global Variables
//============================================================================================


/* Using 'getElementById('id')' method to take HTML element access */

var arraySize = document.getElementById("Array-Size_Meterid");
var sortSpeed = document.getElementById("Sort-Speed_Meterid");
var sortAlgorithm = document.getElementById("Sorting-Algorithm_Selectid");
var startSort = document.getElementById("Start-Sort_Buttonid");
var newArray = document.getElementById("New-Array_Buttonid");
var myCanvas = document.getElementById("Canvas");

/* 'canvasArray' contains array elements at any point of time */
var canvasArray ;

var canvasHeight = myCanvas.getAttribute("height"); //height of the canvas
var canvasWidth = myCanvas.getAttribute("width");   //height of the canvas

/*
    'colorPallete' object contains different colours for each state
        1. unsorted -> when element is not at its correct position
        2. sorted -> when element is at its correct position
        3. process -> when two elements are in border
        4. swap -> when two elements are swapped
        5. pivot -> when element is the pivot element
*/
var colorPallete = {
    unsorted : "#00a8cc",
    sorted : "#aa26da",
    process : "#4dd599",
    swap : "#fb5b5a",
    pivot : "#ffdc34"
};

// setting Context of Canvas to 2-Dimension
var canvasContext = myCanvas.getContext("2d");
var defaultColor = colorPallete.unsorted;
canvasContext.fillStyle = defaultColor;

/*
    'algos' object that conatins different algorithms for sorting
*/
var algos = {
    "bubble" : bubblesort,
    "selection" : selectionsort,
    "insertion" : insertionsort,
    "shell" : shellsort
};


//Helper Functions
//============================================================================================


function randomArray(size, limit) {
    /*
        Function that generates random elements
            size -> number of elements
            limit -> range (0 - limit)
    */
    var array = new Array(size);
    for(i = 0; i < size; i++)
        array[i] = Math.floor(Math.random()*limit)+1;

    return array;
}

function sleep(ms) {
    // to delay execution for 'ms' milliseconds
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Canvas Modifications
//============================================================================================


function initCanvas(){
    /*
        Function that initializes canvas with random height bars,
        uses 'randomArray' function to take an array with random values
    */
    var size = arraySize.value; //input from the 'arraySize' meter

    canvasContext.clearRect(0,0,canvasWidth,canvasHeight);

    //calculating width and gap for canvas
    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    var array = randomArray(size,canvasHeight);

    // filling rectangular bars on canvas
    for (i = 0; i < size; i++)
        canvasContext.fillRect (i*elementWidth,0,elementWidth-gap,array[i]);

    canvasArray = array;
    return array;
}

function setCanvasElem(pos, ht) {
    /*
        Function that set the canvas element
        at position 'pos' to height 'ht'
    */
    var size = arraySize.value; //input from the 'arraySize' meter

    canvasContext.clearRect(pos*elementWidth,0,elementWidth,canvasHeight);

    //calculating width and gap for canvas
    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    canvasContext.fillStyle = defaultColor;
    canvasContext.fillRect(pos*elementWidth,0,elementWidth-gap,ht);
}

function changeColor(pos,state) {
    /*
        Function that changes color of a element at position 'pos'
        on the canvas according to the 'state'

    */
    var elem = canvasArray[pos];
    var size = canvasArray.length;

    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    //changing fill color according to state
    canvasContext.fillStyle = state;
    canvasContext.fillRect(pos*elementWidth,0,elementWidth-gap,elem);
    //changing fill color to default value
    canvasContext.fillStyle = defaultColor;
}

function revertColor(pos) {
    /*
        Function that reverts color of a element at position 'pos'
        on the canvas to the default value

    */
    var elem = canvasArray[pos];
    var size = canvasArray.length;

    var size = canvasArray.length;

    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    //filling with default value
    canvasContext.fillRect(pos*elementWidth,0,elementWidth-gap,elem);
}

function colorRange(pos1,pos2,state) {
    //changes color of range canvas according to state
    for(i = pos1; i <= pos2; i++)
        changeColor(i,state);
}

function colorWhole(state) {
    //changes color of whole canvas according to state
    for (i = 0;i < canvasArray.length; i++)
        changeColor(i,state);
}

function revertWhole() {
    //reverting color of whole canvas to the default value
    for (i = 0;i < canvasArray.length; i++)
        revertColor(i);
}

function swapCanvas(pos1, pos2) {
    /*
        Fucntion that swaps two elements
        on Canvas given their positions
    */
    var elem1 = canvasArray[pos1]; //value of element at pos1
    var elem2 = canvasArray[pos2]; //value of element at pos2

    var size = canvasArray.length;

    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    //clearing positions
    canvasContext.clearRect(pos1*elementWidth,0,elementWidth,canvasHeight);
    canvasContext.clearRect(pos2*elementWidth,0,elementWidth,canvasHeight);

    //filling positions with swapped heights
    canvasContext.fillRect (pos1*elementWidth,0,elementWidth-gap,elem2);
    canvasContext.fillRect (pos2*elementWidth,0,elementWidth-gap,elem1);
}

function swapArray(pos1, pos2) {
    //swap function for 'canvasArray'
    var temp = canvasArray[pos1];
    canvasArray[pos1] = canvasArray[pos2];
    canvasArray[pos2] = temp;
}

function swap(pos1, pos2) {
    //function that triggers both 'swapArray' and 'swapCanvas'
    swapCanvas(pos1,pos2);
    swapArray(pos1, pos2);
}

async function comp(pos1, pos2) {
    // comparator function two compare two elements
    changeColor(pos1,colorPallete.process);
    changeColor(pos2,colorPallete.process);

    var speed = sortSpeed.max - sortSpeed.value;
    var elem1 = canvasArray[pos1];
    var elem2 = canvasArray[pos2];

    await sleep(speed);

    if(elem1 > elem2){
        swap(pos1,pos2);
        changeColor(pos1,colorPallete.swap); changeColor(pos2,colorPallete.swap);
        await sleep(speed);
    }
    revertColor(pos1); revertColor(pos2);
}


//Sorting Algorithms
//============================================================================================

async function bubblesort() {
    //Bubble Sort
    var size = canvasArray.length; //size of the array
    var speed = sortSpeed.max-sortSpeed.value;   //speed of delay

    for (i = 0;i < size-1; i++){
        for (j = 0; j < size-1-i; j++){
            await comp(j,j+1);
        }
        changeColor(j,colorPallete.sorted);
    }
    changeColor(0,colorPallete.sorted);
    await sleep((10*speed));
    revertWhole();
}

async function selectionsort() {
    //Selection Sort
    var size = canvasArray.length; //size of array
    var speed = sortSpeed.max-sortSpeed.value;   //speed of delay

    for(i = 0; i < size; i++) {
        for(j = i+1; j < size; j++) {
            await comp(i,j);
        }
        changeColor(i,colorPallete.sorted);
    }
    await sleep((10*speed)); //delaying some more
    revertWhole();     //reverting to default
}

async function insertionsort() {
    // Insertion Sort
    var size = canvasArray.length; //size of array
    var speed = sortSpeed.max-sortSpeed.value;   //speed of delay

    for(i = 1; i < size; i++){
        for(j = i; j>0&&canvasArray[j] < canvasArray[j-1]; j--){
                await comp(j-1,j);
        }
        changeColor(i,colorPallete.process); changeColor(j,colorPallete.process);
        await sleep(speed);
        revertColor(i); revertColor(j);
    }
    colorWhole(colorPallete.sorted); //all elements sorted
    await sleep(1000);  //delaying some more
    revertWhole();  //reverting to default
}

async function shellsort() {
    //Shell Sort
    var size = canvasArray.length; //size of array
    var speed = sortSpeed.max-sortSpeed.value;   //speed of delay

    for (var gap = Math.floor(size/2); gap > 0; gap = Math.floor(gap/2)) {
        for (var i = gap; i < size; i += 1) {
            var temp = canvasArray[i];
            for (var j = i; j >= gap && canvasArray[j-gap] > temp; j = j-gap) {
                await comp(j-gap, j);
            }
            setCanvasElem(j,temp);
            canvasArray[j] = temp;
            changeColor(j,colorPallete.process);
            await sleep(speed);
            revertColor(j);
        }
    }
    colorWhole(colorPallete.sorted); //all elements sorted
    await sleep(1000);  //delaying some more
    revertWhole();  //reverting to default
}

function sort() {
    /*
        Function that takes input from 'Algorithm Drop Select'
        and calls the sorting fucntion accordingly
    */
    var algorithm = sortAlgorithm.value;
    algos[algorithm]();
 }


//Main Execution
//============================================================================================


//loading the canvas ,as the body loads
document.querySelector("body").onload = initCanvas();

//adding event listeners to buttons
startSort.addEventListener("click", sort);
newArray.addEventListener("click", initCanvas);
