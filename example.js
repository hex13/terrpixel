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

ctx.fillStyle = 'rgb(60, 200, 60)';
ctx.fillRect(10, 20, 350, 150);
ctx.fillStyle = 'rgb(100, 250, 0)';



const terrpixel = new Terrpixel({ width, height });
let imageData = ctx.getImageData(0, 0, width, height);
terrpixel.data = imageData.data;

for (let i = 0; i < 20; i++) {
	imageData.data[i * 4] = 255;
	imageData.data[i * 4+3] = 255;
}

requestAnimationFrame = (a) => setTimeout(a, 100);
function render() {
	ctx.putImageData(imageData, 0, 0)
	for (let i = 0; i < 5; i++)
		terrpixel.fall();
	requestAnimationFrame(render);
}

setInterval(() => {
	const x = ~~(Math.random() * width);
	const y = 200 + ~~(Math.random() * (height - 200));

	// terrpixel.circle(x, y, 30, [255, 0, 0, 0]);
	// ctx.save();
	// ctx.beginPath();
	// ctx.arc(x, 200 + y, 30, 0, Math.PI * 2);
	// ctx.closePath();
	// ctx.clip();
	// ctx.fillStyle = 'rgb(0 0 0 / 1.0)';
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	// ctx.restore();
	// imageData = ctx.getImageData(0, 0, width, height);
	// terrpixel.data = imageData.data;

	console.log("clear")
	}, 2000);
render();

canvas.addEventListener('pointerdown', e => {
	const shouldCreate = document.getElementById('create').checked;
	const bounds = e.target.getBoundingClientRect();
	const x = e.clientX - bounds.x;
	const y = e.clientY - bounds.y;
	terrpixel.circle(~~x, ~~y, 30, shouldCreate? [200, 100, 50, 255] : [0, 0, 0, 0]);
})

