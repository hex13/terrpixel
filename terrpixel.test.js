import * as assert from 'assert';
import { Terrpixel, ELS_PER_PIXEL } from './terrpixel.js';

const X = [200, 210, 220, 255];
const _ = [0, 0, 0, 0];
describe('Terrpixel', () => {
	const width = 4;
	const height = 4;

	it('', () => {
		const terrpixel = new Terrpixel({ width, height });
		assert.strictEqual(terrpixel.width, width);
		assert.strictEqual(terrpixel.height, height);
		assert.ok(terrpixel.data instanceof Uint8Array);
		assert.strictEqual(terrpixel.data.length, width * height * ELS_PER_PIXEL);
		terrpixel.data.forEach((v) => {
			assert.strictEqual(v, 0);
		});
	});

	it('setPixel()', () => {
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.setPixel(1, 2, X);
		assert.deepStrictEqual(terrpixel.data, new Uint8Array([
			..._, ..._, ..._, ..._,
			..._, ..._, ..._, ..._,
			..._, ...X, ..._, ..._,
			..._, ..._, ..._, ..._,
		]));
		assert.deepStrictEqual(terrpixel.getPixel(1, 2), new Uint8Array(X));
		assert.deepStrictEqual(terrpixel.getPixel(2, 2), new Uint8Array(_));
	});

	it('setPixel() - dirtyColumns', () => {
		const terrpixel = new Terrpixel({ width: 10, height: 5 });
		terrpixel.dirtyColumns = new Uint8Array(10);
		terrpixel.setPixel(3, 2, X);
		assert.deepStrictEqual(terrpixel.dirtyColumns, new Uint8Array([
			0, 0, 0, 1, 0,
			0, 0, 0, 0, 0,
		]));
	});


	it('fall (whole map)', () => {
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			...X, ..._, ..._, ..._,
			...X, ..._, ..._, ..._,
			..._, ..._, ...X, ...X,
			...X, ..._, ..._, ...X,
		]);
		terrpixel.fall();
		assert.deepStrictEqual(terrpixel.data, new Uint8Array([
			..._, ..._, ..._, ..._,
			...X, ..._, ..._, ..._,
			...X, ..._, ..._, ...X,
			...X, ..._, ...X, ...X,
		]));
	});

	it('fall (fragment)', () => {
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			...X, ..._, ..._, ..._,
			...X, ...X, ..._, ...X,
			..._, ...X, ...X, ..._,
			...X, ..._, ..._, ..._,
		]);
		terrpixel.fall(1, 3);
		assert.deepStrictEqual(terrpixel.data, new Uint8Array([
			...X, ..._, ..._, ..._,
			...X, ..._, ..._, ...X,
			..._, ...X, ..._, ..._,
			...X, ...X, ...X, ..._,
		]));
	});


	it('circle()', () => {
		const width = 20;
		const height = 20;
		const terrpixel = new Terrpixel({ width, height });
		const r = 5;
		const x0 = 8;
		const y0 = 10;
		terrpixel.circle(x0, y0, r, X);

		let count = 0;
		let falseCount = 0;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				count++;
				const alpha = terrpixel.data[(y * width + x) * ELS_PER_PIXEL + 3];
				const inCircle = Math.hypot(x - x0, y - y0) <= r;
				if (inCircle) {
					if (alpha != X[3]) falseCount++;
					assert.strictEqual(alpha, X[3]);
				} else {
					if (alpha != 0) falseCount++;
					assert.strictEqual(alpha, 0);
				}
			}
		}
		console.log(`false: ${falseCount} / ${count}`)
	});


	it('circle() - dirtyColumns', () => {
		const width = 20;
		const height = 20;
		const terrpixel = new Terrpixel({ width, height });
		const r = 5;
		const x0 = 8;
		const y0 = 10;
		terrpixel.dirtyColumns = new Uint8Array(20);
		terrpixel.circle(x0, y0, r, X);
		assert.deepStrictEqual(terrpixel.dirtyColumns, new Uint8Array([
			0, 0, 0, 1, 1,
			1, 1, 1, 1, 1,
			1, 1, 1, 1, 0,
			0, 0, 0, 0, 0,
		]));
	});

	it('neighborY() - flat', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			..._, ..._, ..._,
			..._, ...X, ...X,
			..._, ..._, ..._,
			..._, ..._, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(1, 2), 2);
		assert.deepStrictEqual(terrpixel.neighborY(2, 2, -1), 2);
	});

	it('neighborY() - right rising', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			..._, ..._, ...X,
			..._, ...X, ..._,
			...X, ...X, ..._,
			..._, ...X, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(0, 3), 2);
		assert.deepStrictEqual(terrpixel.neighborY(1, 2), 1);
	});

	it('neighborY() - left rising', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			...X, ..._, ..._,
			..._, ...X, ..._,
			..._, ...X, ...X,
			..._, ...X, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(2, 3, -1), 2);
		assert.deepStrictEqual(terrpixel.neighborY(1, 2, -1), 1);
	});

	it('neighborY() - right rising - steep', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			..._, ..._, ...X,
			..._, ...X, ..._,
			..._, ...X, ..._,
			...X, ...X, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(0, 4), 2);
	});

	it('neighborY() - left rising - steep', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			...X, ..._, ..._,
			..._, ...X, ..._,
			..._, ...X, ..._,
			..._, ...X, ...X,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(2, 4, -1), 2);
	});


	it('neighborY() - right falling', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			..._, ..._, ..._,
			..._, ...X, ..._,
			..._, ..._, ...X,
			..._, ..._, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(1, 2), 3);
	});

	it('neighborY() - left falling', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			..._, ..._, ..._,
			..._, ...X, ..._,
			...X, ..._, ..._,
			..._, ..._, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(1, 2, -1), 3);
	});


	it('neighborY() - right falling - steep', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			..._, ...X, ..._,
			..._, ...X, ..._,
			..._, ..._, ...X,
			..._, ..._, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(1, 1), 3);
	});

	it('neighborY() - left falling - steep', () => {
		const width = 3;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._,
			..._, ...X, ..._,
			..._, ...X, ..._,
			...X, ..._, ..._,
			..._, ..._, ..._,
		]);
		assert.deepStrictEqual(terrpixel.neighborY(1, 1, -1), 3);
	});

	it('dirtyColumns - should not move columns that are not dirty', () => {
		const width = 4;
		const height = 5;
		const map = [
			..._, ..._, ..._, ..._,
			..._, ...X, ..._, ..._,
			..._, ...X, ..._, ..._,
			...X, ..._, ..._, ...X,
			..._, ..._, ..._, ...X,
		];
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array(map);
		terrpixel.dirtyColumns = new Uint8Array(4);
		terrpixel.fall();
		assert.deepStrictEqual(terrpixel.data, new Uint8Array(map));

	});


	it('dirtyColumns - cleaning dirty marks', () => {
		const width = 4;
		const height = 5;
		const terrpixel = new Terrpixel({ width, height });
		terrpixel.data = new Uint8Array([
			..._, ..._, ..._, ..._,
			..._, ...X, ..._, ..._,
			..._, ...X, ..._, ..._,
			...X, ..._, ..._, ...X,
			..._, ..._, ..._, ...X,
		]);
		assert.deepStrictEqual(terrpixel.dirtyColumns, new Uint8Array([1, 1, 1, 1]));
		terrpixel.fall();
		assert.deepStrictEqual(terrpixel.dirtyColumns, new Uint8Array([1, 1, 0, 0]));
		terrpixel.fall();
		assert.deepStrictEqual(terrpixel.dirtyColumns, new Uint8Array([0, 1, 0, 0]));
		terrpixel.fall();
		assert.deepStrictEqual(terrpixel.dirtyColumns, new Uint8Array([0, 0, 0, 0]));
	});


});
