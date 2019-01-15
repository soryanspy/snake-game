/**
 * class Canvas - will be initialize in class Draw.
 */
export class Canvas {
	/* Get canvas */
	private _canvas: HTMLCanvasElement = document
		.getElementById('game')!
		.appendChild(document.createElement('canvas'))
	private _ctx: CanvasRenderingContext2D = this._canvas.getContext('2d')!

	/* Getters */
	public get canvas(): HTMLCanvasElement {
		return this._canvas
	}

	public get ctx(): CanvasRenderingContext2D {
		return this._ctx
	}

	constructor() {
		/* Canvas initialize size */
		this._canvas.width = window.innerWidth
		this._canvas.height = window.innerHeight

		this._canvas.setAttribute('class', 'canvas')
	}
}
