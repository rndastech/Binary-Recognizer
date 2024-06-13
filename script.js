const canvas = 
    document.querySelector("canvas"),
toolBtns = 
    document.querySelectorAll(".tool"),
clearCanvas = 
    document.querySelector(".clear-canvas"),
saveImage = 
    document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

async function loadModel() {
    // Load the model
    const model = await tf.loadLayersModel('model/model.json');
    model.summary();}

loadModel();

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
    setCanvasBackground();

})

// saveImage.addEventListener("click", () => {
//     const link = document.createElement("a");
//     link.download = `${Date.now()}`.jpg;
//     link.href = canvas.toDataURL();
//     link.click();
// })

saveImage.addEventListener("click", () => {
    // Create an off-screen canvas for resizing
    const resizedCanvas = document.createElement("canvas");
    const ctx = resizedCanvas.getContext("2d");

    // Set the desired dimensions for the resized image
    const width = 228;
    const height = 84;
    resizedCanvas.width = width;
    resizedCanvas.height = height;

    // Draw the original canvas content onto the resized canvas with scaling
    ctx.drawImage(canvas, 0, 0, 800, 300, 0, 0, width, height);

    // Create a download link for the resized image
    const link = document.createElement("a");
    link.download = `${Date.now()}.png`;
    link.href = resizedCanvas.toDataURL("image/png");
    link.click();
});


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
