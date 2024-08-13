import { Terrpixel } from './terrpixel.js';

const width = 400;
const height = 300;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
canvas.style.border = '1px solid red';
document.body.append(canvas);
const ctx = canvas.getContext('2d');
ctx.fillRect(100, 100, 30, 20);
ctx.fillRect(160, 230, 10, 20);
ctx.fillRect(60, 270, 100, 20);
ctx.fillStyle = 'rgb(250, 100, 20)';
ctx.fillRect(50, 70, 100, 20);


const terrpixel = new Terrpixel({ width, height });
const imageData = ctx.getImageData(0, 0, width, height);
terrpixel.data = imageData.data;

for (let i = 0; i < 20; i++) {
	imageData.data[i * 4] = 255;
	imageData.data[i * 4+3] = 255;
}

function render() {
	ctx.putImageData(imageData, 0, 0)
	for (let i = 0; i < 3; i++)
		terrpixel.fall();
	requestAnimationFrame(render);	
}

render();




