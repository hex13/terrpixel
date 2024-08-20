export const ELS_PER_PIXEL = 4;
const ALPHA = 3;
const NONE_PIXEL = [0, 0, 0, 0];

export class Terrpixel {
	constructor({ width, height}) {
		this.data = new Uint8Array(width * height * ELS_PER_PIXEL);
		this.width = width;
		this.height = height;
		this.dirtyColumns = new Uint8Array(width).fill(1);
	}
	getIndex(x, y) {
		if (x < 0 || y < 0 || x >= this.width || y >= this.height) return new Error(`invalid coords: ${x}, ${y}`);
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
		this.dirtyColumns[x] = 1;
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
	fall(x0 = 0, x1 = this.width) {
		for (let x = x0; x < x1; x++) {
			if (!this.dirtyColumns[x]) continue;
			let dirty = 0;
			for (let y = this.height - 2; y >= 0; y--) {
				if (this.getAlpha(x, y) > 0 && this.getAlpha(x, y + 1) == 0) {
					this.movePixel(x, y, x, y + 1)
					dirty = 1;
				}
			}
			this.dirtyColumns[x] = dirty;
		}
	}
	circle(x0, y0, r, color) {
		for (let y = y0 - r; y <= y0 + r; y++) {
			for (let x = x0 - r; x <= x0 + r; x++) {
				if (Math.hypot(x - x0, y - y0) <= r) {
					this.setPixel(x, y, color);
				}
			}
		}
	}
	neighborY(x, y, dir = 1) {
		if (this.getAlpha(x + dir, y - 1) > 0) {
			let y1;
			for (y1 = y - 1; this.getAlpha(x + dir, y1) > 0; y1--) /* noop */;
			return y1 + 1;
		}
		if (this.getAlpha(x + dir, y) > 0) return y;
		if (this.getAlpha(x + dir, y + 1) > 0) return y + 1;

		let y1;
		for (y1 = y + 1; this.getAlpha(x + dir, y1) == 0; y1++) /* noop */;
		return y1;
	}
}