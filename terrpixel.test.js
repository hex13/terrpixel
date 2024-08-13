import * as assert from 'assert';
import { Terrpixel, ELS_PER_PIXEL } from './terrpixel';

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

	it('', () => {
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


	it('', () => {
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
});
