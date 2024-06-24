const canvas = 
    document.querySelector("canvas"),
toolBtns = 
    document.querySelectorAll(".tool"),
clearCanvas = 
    document.querySelector(".clear-canvas"),
saveImage = 
    document.querySelector(".save-img"),
ctx = canvas.getContext("2d");
let model;
let num1=0, num2=0;
let bin1="", bin2="";

async function loadModel() {
    model = await tf.loadLayersModel('model.json');}

loadModel();

function predict(context, starty, wdt, ht, pos) {
    let startx = pos * wdt;
    const imageData = context.getImageData(startx, starty, 28, 28);
    const data = imageData.data;
    const grayscaleImage = new Float32Array(wdt * ht);
    for (let i = 0; i < wdt * ht; i++) {
        const offset = i * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grayscaleImage[i] = (255 - gray) / 255.0;
    }
    const tensor = tf.tensor(grayscaleImage, [1, 28, 28, 1], 'float32');
    const prediction = model.predict(tensor);
    const predictedProbability = prediction.dataSync()[0];
    const predictedLabel = predictedProbability >= 0.5 ? 1 : 0;
    return predictedLabel;
}


function binnum(bin){
    const integerValue = parseInt(bin, 2);
    return integerValue;
}

function intToBinaryString(number) {
    return number.toString(2);
  }

let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "pencil",
    brushWidth = 5,
    sizeSlider = "5",
    selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
const gridSize = 100;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.strokeStyle = "#ccc";
for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 100);
    ctx.moveTo(x, 200);
    ctx.lineTo(x, 300);
}
    ctx.moveTo(350, 100);
    ctx.lineTo(350, 200);
    ctx.moveTo(450, 100);
    ctx.lineTo(450, 200);
for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
}
ctx.stroke();
ctx.closePath();
ctx.restore();
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});


const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; 
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    snapshot = ctx.getImageData(0, 0, canvas.width,
    canvas.height);
}

const drawPencil = (e) => {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}


const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" && selectedTool === "pencil" 
    || selectedTool === "eraser") {

        ctx.strokeStyle = selectedTool === "eraser" 
        ? "#fff" : "#000";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } 
    else {
        drawPencil(e);

    }
}


toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active")
        .classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);

    });

});


clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    document.getElementById("firstnum").innerHTML = "00000000 * 00000000 = 0";
    document.getElementById("secondnum").innerHTML = "=> 0 * 0 = 0";
    setCanvasBackground();

})

saveImage.addEventListener("click", () => {
    const resizedCanvas = document.createElement("canvas");
    const ctx = resizedCanvas.getContext("2d", { willReadFrequently: true });
    const width = 224;
    const height = 84;
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    ctx.drawImage(canvas, 0, 0, 800, 300, 0, 0, width, height);
    const context = resizedCanvas.getContext('2d', { willReadFrequently: true });
    bin1 = bin1.concat(predict(context, 0, 28, 28, 0));
    bin1 = bin1.concat(predict(context, 0, 28, 28, 1));
    bin1 = bin1.concat(predict(context, 0, 28, 28, 2));
    bin1 = bin1.concat(predict(context, 0, 28, 28, 3));
    bin1 = bin1.concat(predict(context, 0, 28, 28, 4));
    bin1 = bin1.concat(predict(context, 0, 28, 28, 5));
    bin1 = bin1.concat(predict(context, 0, 28, 28, 6));
    bin1 = bin1.concat(predict(context, 0, 28, 28, 7));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 0));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 1));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 2));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 3));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 4));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 5));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 6));
    bin2 = bin2.concat(predict(context, 56, 28, 28, 7));
    num1 = binnum(bin1);
    num2 = binnum(bin2);
    document.getElementById("firstnum").innerHTML = bin1+" ÷ "+bin2+" = "+intToBinaryString(num1/num2);
    document.getElementById("secondnum").innerHTML = "=> "+num1+" ÷ "+num2+" = "+(num1/num2);
    bin1="";
    bin2="";
    num1=0;
    num2=0;
});


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

function grayscaleArrayToImage(grayscaleImage, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const imageData = context.createImageData(width, height);
    for (let i = 0; i < grayscaleImage.length; i++) {
        const value = grayscaleImage[i];
        const index = i * 4;
        imageData.data[index] = value;        // Red
        imageData.data[index + 1] = value;    // Green
        imageData.data[index + 2] = value;    // Blue
        imageData.data[index + 3] = 255;      // Alpha (fully opaque)
    }
    context.putImageData(imageData, 0, 0);
    const img = new Image();
    img.src = canvas.toDataURL();

    return img;
}
