/* Using 'getElementById('id')' method to take element access */

var arraySize = document.getElementById("Array-Size_Meterid");
var sortSpeed = document.getElementById("Sort-Speed_Meterid");
var sortAlgorithm = document.getElementById("Sorting-Algorithm_Selectid");
var startSort = document.getElementById("Start-Sort_Buttonid");
var newArray = document.getElementById("New-Array_Buttonid");
var myCanvas = document.getElementById("Canvas");

var canvasArray ;

var canvasHeight = myCanvas.getAttribute("height");
var canvasWidth = myCanvas.getAttribute("width");

var colorPallete = {
    unsorted : "#00a8cc",
    sorted : "#aa26da",
    process : "#4dd599",
    swap : "#fb5b5a",
    pivot : "#ffdc34"
};

var canvasContext = myCanvas.getContext("2d");
var defaultColor = colorPallete.unsorted;
canvasContext.fillStyle = defaultColor;

function randomArray(size, limit) {
    var array = new Array(size);
    for(i = 0; i < size; i++)
        array[i] = Math.floor(Math.random()*limit)+1;

    return array;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function initCanvas(){

    var size = arraySize.value;

    canvasContext.clearRect(0,0,canvasWidth,canvasHeight);
    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    var array = randomArray(size,canvasHeight);

    for (i = 0; i < size; i++)
        canvasContext.fillRect (i*elementWidth,0,elementWidth-gap,array[i]);

    canvasArray = array;
    return array;
}

function swapCanvas(pos1, pos2) {

    var elem1 = canvasArray[pos1];
    var elem2 = canvasArray[pos2];

    var size = canvasArray.length;

    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    canvasContext.clearRect(pos1*elementWidth,0,elementWidth,canvasHeight);
    canvasContext.clearRect(pos2*elementWidth,0,elementWidth,canvasHeight);

    canvasContext.fillRect (pos1*elementWidth,0,elementWidth-gap,elem2);
    canvasContext.fillRect (pos2*elementWidth,0,elementWidth-gap,elem1);
}

function changeColor(pos,state) {
    var elem = canvasArray[pos];
    var size = canvasArray.length;

    var size = canvasArray.length;

    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    canvasContext.fillStyle = state;
    canvasContext.fillRect(pos*elementWidth,0,elementWidth-gap,elem);
    canvasContext.fillStyle = defaultColor;
}

function revertColor(pos) {
    var elem = canvasArray[pos];
    var size = canvasArray.length;

    var size = canvasArray.length;

    elementWidth = Math.floor(canvasWidth/size);
    gap = Math.floor((elementWidth/100)*20);

    canvasContext.fillRect(pos*elementWidth,0,elementWidth-gap,elem);
}

function swapArray(pos1, pos2) {
    var temp = canvasArray[pos1];
    canvasArray[pos1] = canvasArray[pos2];
    canvasArray[pos2] = temp;
}

function colorWhole(state,size) {
    for (i = 0;i < size; i++)
        changeColor(i,state);
}

function revertWhole(size) {
    for (i = 0;i < size; i++)
        revertColor(i);
}

function swap(pos1, pos2) {
    swapCanvas(pos1,pos2);
    swapArray(pos1, pos2);
}

async function bubblesort() {
    var size = canvasArray.length;
    var speed = sortSpeed.value;
    for(i = 0; i < size-1; i++){
        for(j = 0; j < size-1-i; j++){
            if(canvasArray[j]>canvasArray[j+1]){
                swap(j,j+1);
                changeColor(j,colorPallete.swap); changeColor(j+1,colorPallete.swap);
                await sleep(speed);
                revertColor(j); revertColor(j+1);
            }
            else{
                changeColor(j,colorPallete.process); changeColor(j+1,colorPallete.process);
                await sleep(speed);
                revertColor(j); revertColor(j+1);
            }
        }
        changeColor(size-i-1,colorPallete.sorted);
    }
    changeColor(0,colorPallete.sorted);
    await sleep(10*speed);
    revertWhole(size);
}

async function selectionsort() {
    var size = canvasArray.length;
    var speed = sortSpeed.value;
    for(i = 0; i < size; i++) {
        for(j = i+1; j < size; j++) {
            if(canvasArray[i]>canvasArray[j]){
                swap(i,j);
                changeColor(i,colorPallete.swap); changeColor(j,colorPallete.swap);
                await sleep(speed);
                revertColor(i); revertColor(j);
            }
            else{
                changeColor(i,colorPallete.process); changeColor(j,colorPallete.process);
                await sleep(speed);
                revertColor(i); revertColor(j);
            }
        }
        changeColor(i,colorPallete.sorted);
    }
    await sleep(10*speed);
    revertWhole(size);
}

async function insertionsort() {
    var size = canvasArray.length;
    var speed = sortSpeed.value;
    for(i = 1; i < size; i++){
        for(j = i; j>0&&canvasArray[j] < canvasArray[j-1]; j--){
                swap(j,j-1);
                changeColor(j,colorPallete.swap); changeColor(j-1,colorPallete.swap);
                await sleep(speed);
                revertColor(j); revertColor(j-1);
        }
        changeColor(i,colorPallete.process); changeColor(j,colorPallete.process);
        await sleep(speed);
        revertColor(i); revertColor(j);
    }
    colorWhole(colorPallete.sorted,size);
    await sleep(1000);
    revertWhole(size);
}

function sort() {
    var algorithm = sortAlgorithm.value;
    if (algorithm == "bubblesort")
        bubblesort();
    else if (algorithm == "selectionsort")
        selectionsort();
    else
        insertionsort();
 }

document.querySelector("body").onload = initCanvas();
startSort.addEventListener("click", sort);
newArray.addEventListener("click", initCanvas);
