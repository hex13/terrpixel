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

let pointer = {x: 0, y: 0};

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
	ctx.fillStyle = 'red';

	ctx.fillRect(pointer.x, pointer.y, 2, 2);


	ctx.beginPath();

	const w = 50;
	for (let i = 0, x = pointer.x, y = pointer.y; i < w; i++) {
		y = terrpixel.neighborY(x, y);
		x += 1;
		if (i == 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
	}
	for (let i = 0, x = pointer.x, y = pointer.y; i < w; i++) {
		y = terrpixel.neighborY(x, y, -1);
		x -= 1;
		if (i == 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
	}

	ctx.stroke();


	for (let i = 0; i < 5; i++)
		terrpixel.fall();
	requestAnimationFrame(render);
}

render();

const computeXY = e => {
	const bounds = e.target.getBoundingClientRect();
	const x = ~~(e.clientX - bounds.x);
	const y = ~~(e.clientY - bounds.y);
	return {x, y};
}

canvas.addEventListener('pointerdown', e => {
	const shouldCreate = document.getElementById('create').checked;
	const {x, y} = computeXY(e);
	terrpixel.circle(~~x, ~~y, 30, shouldCreate? [200, 100, 50, 255] : [0, 0, 0, 0]);
});


canvas.addEventListener('pointermove', e => {
	pointer = computeXY(e);
});
