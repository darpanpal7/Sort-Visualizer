/* Using 'getElementById('id')' method to take element access */

var arraySize = document.getElementById("Array-Size_Meterid");
var sortSpeed = document.getElementById("Sort-Speed_Meterid");
var sortAlgorithm = document.getElementById("Sorting-Algorithm_Selectid");
var startSort = document.getElementById("Start-Sort_Buttonid");
var newArray = document.getElementById("New-Array_Buttonid");
var myCanvas = document.getElementById("Canvas");

var canvasArray ;

var canvasContext = myCanvas.getContext("2d");
canvasContext.fillStyle = "#00bdaa";

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

    canvasHeight = myCanvas.getAttribute("height");
    canvasWidth = myCanvas.getAttribute("width");

    canvasContext.clearRect(0,0,canvasWidth,canvasHeight);
    elementWidth = Math.floor(canvasWidth/size);

    var array = randomArray(size,canvasHeight);

    for (i = 0; i < size; i++)
        canvasContext.fillRect (i*elementWidth,0,elementWidth,array[i]);

    canvasArray = array;
    return array;
}

function swapCanvas(pos1, pos2) {

    var elem1 = canvasArray[pos1];
    var elem2 = canvasArray[pos2];

    var size = canvasArray.length;

    canvasHeight = myCanvas.getAttribute("height");
    canvasWidth = myCanvas.getAttribute("width");

    elementWidth = Math.floor(canvasWidth/size);

    canvasContext.clearRect(pos1*elementWidth,0,elementWidth,canvasHeight);
    canvasContext.clearRect(pos2*elementWidth,0,elementWidth,canvasHeight);

    canvasContext.fillRect (pos1*elementWidth,0,elementWidth,elem2);
    canvasContext.fillRect (pos2*elementWidth,0,elementWidth,elem1);
}

function changecolor(pos) {
    var elem = canvasArray[pos];
    var size = canvasArray.length;

    var size = canvasArray.length;

    canvasHeight = myCanvas.getAttribute("height");
    canvasWidth = myCanvas.getAttribute("width");

    elementWidth = Math.floor(canvasWidth/size);

    canvasContext.fillStyle = "#005082";
    canvasContext.fillRect(pos*elementWidth,0,elementWidth,elem);
    canvasContext.fillStyle = "#00bdaa";
}

function revertcolor(pos) {
    var elem = canvasArray[pos];
    var size = canvasArray.length;

    var size = canvasArray.length;

    canvasHeight = myCanvas.getAttribute("height");
    canvasWidth = myCanvas.getAttribute("width");

    elementWidth = Math.floor(canvasWidth/size);

    canvasContext.fillRect(pos*elementWidth,0,elementWidth,elem);
}

function swapArray(pos1, pos2) {
    var temp = canvasArray[pos1];
    canvasArray[pos1] = canvasArray[pos2];
    canvasArray[pos2] = temp;
}

function swap(pos1, pos2) {
    swapCanvas(pos1,pos2);
    swapArray(pos1, pos2);
}

async function bubblesort() {
    var size = canvasArray.length;
    var speed = sortSpeed.value;
    for(i = 0; i < size-1; i++)
        for(j = 0; j < size-1-i; j++)
            if(canvasArray[j]>canvasArray[j+1]){
                swap(j,j+1);
                changecolor(j); changecolor(j+1);
                await sleep(speed);
                revertcolor(j); revertcolor(j+1);
            }
}

async function selectionsort() {
    var size = canvasArray.length;
    var speed = sortSpeed.value;
    for(i = 0; i < size; i++)
        for(j = i+1; j < size; j++)
            if(canvasArray[i]>canvasArray[j]){
                swap(i,j);
                changecolor(j); changecolor(j+1);
                await sleep(speed);
                revertcolor(j); revertcolor(j+1);
            }
}

async function insertionsort() {
    var size = canvasArray.length;
    var speed = sortSpeed.value;
    for(i = 1; i < size; i++)
        for(j = i; j>0&&canvasArray[j] < canvasArray[j-1]; j--){
                swap(j,j-1);
                changecolor(j); changecolor(j+1);
                await sleep(speed);
                revertcolor(j); revertcolor(j+1);
        }
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
startSort.addEventListener("click" , sort);
newArray.addEventListener("click", initCanvas);
