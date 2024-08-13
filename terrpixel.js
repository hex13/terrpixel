export const ELS_PER_PIXEL = 4;
const ALPHA = 3;
const NONE_PIXEL = [0, 0, 0, 0];

export class Terrpixel {
	constructor({ width, height}) {
		this.data = new Uint8Array(width * height * ELS_PER_PIXEL);
		this.width = width;
		this.height = height;
	}
	getIndex(x, y) {
		return (y * this.width + x) * ELS_PER_PIXEL;
	}
	getPixel(x, y, data = this.data) {
		const idx = this.getIndex(x, y);
		return data.slice(idx, idx + ELS_PER_PIXEL);
	}
	getAlpha(x, y, data = this.data) {
		const idx = this.getIndex(x, y);
		return data[idx + 3];
	}
	setPixel(x, y, value) {
		const idx = this.getIndex(x, y);
		this.data[idx] = value[0];
		this.data[idx + 1] = value[1];
		this.data[idx + 2] = value[2];
		this.data[idx + 3] = value[3];
	}
	movePixel(fromX, fromY, toX, toY) {
		const fromIdx = this.getIndex(fromX, fromY);
		const toIdx = this.getIndex(toX, toY);
		this.data.copyWithin(toIdx, fromIdx, fromIdx + ELS_PER_PIXEL);
		this.data[fromIdx] = 0;
		this.data[fromIdx + 1] = 0;
		this.data[fromIdx + 2] = 0;
		this.data[fromIdx + 3] = 0;
	}
	fall() {
		for (let x = 0; x < this.width; x++) {
			for (let y = this.height - 2; y >= 0; y--) {
				if (this.getAlpha(x, y) > 0 && this.getAlpha(x, y + 1) == 0) {
					this.movePixel(x, y, x, y + 1)
				}
			}
		}
	}
}