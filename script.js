const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const memeInput = document.getElementById('memeInput');
const faceInput = document.getElementById('faceInput');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const scaleSlider = document.getElementById('faceScale');
const xSlider = document.getElementById('faceX');
const ySlider = document.getElementById('faceY');
const downloadBtn = document.getElementById('downloadBtn');

// Image Objects
let memeImg = new Image();
let faceImg = new Image();
let memeLoaded = false;
let faceLoaded = false;

// Default Canvas Size (will update when meme loads)
canvas.width = 500;
canvas.height = 500;

// Draw initial placeholder
ctx.fillStyle = '#b2bec3';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#2d3436';
ctx.font = '30px Comic Neue';
ctx.textAlign = 'center';
ctx.fillText('Waiting for your spicy meme...', canvas.width/2, canvas.height/2);

// Handle Meme Upload
memeInput.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        memeImg.src = event.target.result;
        memeImg.onload = () => {
            memeLoaded = true;
            // Set canvas dimensions to match meme image
            canvas.width = memeImg.width;
            canvas.height = memeImg.height;
            
            // Adjust sliders max values based on canvas size
            xSlider.max = canvas.width;
            ySlider.max = canvas.height;
            xSlider.value = canvas.width / 2;
            ySlider.value = canvas.height / 2;
            
            drawMeme();
        }
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Handle Face Upload
faceInput.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        faceImg.src = event.target.result;
        faceImg.onload = () => {
            faceLoaded = true;
            drawMeme();
        }
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Event Listeners for real-time updates
topTextInput.addEventListener('input', drawMeme);
bottomTextInput.addEventListener('input', drawMeme);
scaleSlider.addEventListener('input', drawMeme);
xSlider.addEventListener('input', drawMeme);
ySlider.addEventListener('input', drawMeme);

// Main rendering function
function drawMeme() {
    if (!memeLoaded) return;

    // 1. Draw the base meme
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(memeImg, 0, 0, canvas.width, canvas.height);

    // 2. Draw the face overlay if loaded
    if (faceLoaded) {
        const scale = parseFloat(scaleSlider.value);
        const x = parseFloat(xSlider.value);
        const y = parseFloat(ySlider.value);
        
        const faceWidth = faceImg.width * scale;
        const faceHeight = faceImg.height * scale;

        // Draw face centered on the X,Y coordinates
        ctx.drawImage(faceImg, x - (faceWidth/2), y - (faceHeight/2), faceWidth, faceHeight);
    }

    // 3. Draw the Text (Standard Meme Impact Font style)
    const topText = topTextInput.value.toUpperCase();
    const bottomText = bottomTextInput.value.toUpperCase();

    // Responsive font size based on canvas width
    const fontSize = Math.floor(canvas.width / 10);
    ctx.font = `bold ${fontSize}px Impact, Anton, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 15;

    // Draw Top Text
    if (topText) {
        ctx.fillText(topText, canvas.width / 2, fontSize + 10);
        ctx.strokeText(topText, canvas.width / 2, fontSize + 10);
    }

    // Draw Bottom Text
    if (bottomText) {
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
    }
}

// Handle High-Quality Download
downloadBtn.addEventListener('click', () => {
    if (!memeLoaded) {
        alert("Hold your horses! You need to upload a meme first.");
        return;
    }
    
    // Convert canvas to highest quality PNG data URL
    const image = canvas.toDataURL('image/png', 1.0);
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.download = 'my-epic-meme.png';
    link.href = image;
    link.click();
});