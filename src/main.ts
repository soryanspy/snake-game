// Settings
let cellSize: number = 40
let timeSpeed: number = 100

// canvas
const gameWindowWidth: number = 800
const gameWindowHeight: number = 600

const canvas = <HTMLCanvasElement>document.getElementById('canvas')
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d')

// modes
let isPortalMode = true // walls portal
let isAimMode = true // snake aim
let isSnakeInSelfMode = true // snake eat self
let isMovingBackwardMode = true // snake moving backward

// game's logic
let isGameOver = false
let isFruitTaken = false
let isIncrease = false

let isUpdateColission = true

// colors
// TODO: let Colors = {} // all colors here
let color_aimTrue = 'rgba(0, 0, 255, 0.1)'
let color_aimFalse = 'rgba(255, 255, 0, 0.8)'
let color_canvasBody = '#f0f0f0'
let color_snake = generateColor(255, 190, 220)
let color_snakeHead = generateColor(210, 180, 180)
let color_snakeDead = 'red'
let color_fruit = generateColor(150, 210, 210)

function generateColor(r = 255, g = 255, b = 255) {
	return `rgb(${Math.floor(Math.random() * r)},${Math.floor(Math.random() * g)},${Math.floor(Math.random() * b)})`
}


/* snake direction */
let moveDirection = 'pause' // w - up, s - down, a - left, d - right

/* coordinates arrays declaration */
let snake = generateSnake()
let fruit: Array<number> = []

/* updating in colission */
let snakeHead: Array<number> = []

/* update in move */
let lastDirection: string


function startGame() {
	/* setup resolution of the canvas in html */
	ctx.canvas.width = gameWindowWidth
	ctx.canvas.height = gameWindowHeight

	gameLoop()
}

/* Game loop */
async function gameLoop() { // async for sleeping
	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	while (isGameOver === false) {
		await sleep(timeSpeed)
		render()
	}
}

function render() {
	/* clear canvas */
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawingCanvasBody()

	/* Check keyboard and move snake */
	if (moveDirection !== 'pause')
		move()

	/* Update variables */
	snakeHead = snake[0]

	/* Physics collisions with walls, snake in self, fruit */
	collision()


	/* generate fruit */
	// FIXME: fruit can generate in snake
	generateFruit()

	/* drawing fruit */
	drawingFruit()

	/* drawing snake */
	drawingSnake()

	/* aim mode */
	if (isAimMode === true)
		aimMode()


}


/* Drawing */
function drawingCanvasBody() {
	ctx.fillStyle = color_canvasBody
	ctx.fillRect(0, 0, gameWindowWidth, gameWindowHeight)
}

function drawingSnake() {
	ctx.fillStyle = color_snake
	for (let i = 0; i < snake.length; i++) {
		ctx.fillRect(snake[i][0], snake[i][1], cellSize, cellSize)
	}
	ctx.fillStyle = color_snakeHead
	ctx.fillRect(snakeHead[0], snakeHead[1], cellSize, cellSize)
}

function drawingFruit() {
	ctx.fillStyle = color_fruit
	ctx.fillRect(fruit[0], fruit[1], cellSize, cellSize)
}

function drawOneCell(cellCoordinates: Array<number>, color: string) {
	ctx.fillStyle = color
	ctx.fillRect(cellCoordinates[0], cellCoordinates[1], cellSize, cellSize)
}

/* Generating */
function generateSnake() {
	return [
		[Math.floor(Math.random() * gameWindowWidth / cellSize) * cellSize,
		Math.floor(Math.random() * gameWindowHeight / cellSize) * cellSize
		]
	]
}

function generateFruit() {
	if (isFruitTaken === false) {
		fruit = [Math.floor(Math.random() * gameWindowWidth / cellSize) * cellSize,
		Math.floor(Math.random() * gameWindowHeight / cellSize) * cellSize
		]
		isFruitTaken = true
		color_fruit = generateColor(150, 210, 210) // change fruit color
	}
}

/* Moving snake */
function move() {
	const temp_snake = snake.slice()

	// move snakeHead and checking blocking ways
	switch (moveDirection) {
		case 'up':
			if (lastDirection === 'down') {
				moveDirection = lastDirection
				moveDown()
				break
			}
			moveUp()
			break
		case 'down':
			if (lastDirection === 'up') {
				moveDirection = lastDirection
				moveUp()
				break
			}
			moveDown()
			break
		case 'left':
			if (lastDirection === 'right') {
				moveDirection = lastDirection
				moveRight()
				break
			}
			moveLeft()
			break
		case 'right':
			if (lastDirection === 'left') {
				moveDirection = lastDirection
				moveLeft()
				break
			}
			moveRight()
			break
	}

	/* move snake array over snake head */
	function moving() {
		for (let i = 1; i < snake.length; i++) {
			snake[i] = temp_snake[i - 1]
		}

		// increase snake if is it needed
		if (isIncrease) {
			snake.push(temp_snake[length])
			isIncrease = false
		}

		// update lastDirection
		if (!isMovingBackwardMode) lastDirection = moveDirection
	}

	/* move snakeHead */
	function moveUp() {
		snake[0] = [snakeHead[0], snakeHead[1] - cellSize]
		moving()
	}

	function moveDown() {
		snake[0] = [snakeHead[0], <number>snakeHead[1] + cellSize]
		moving()
	}

	function moveLeft() {
		snake[0] = [snakeHead[0] - cellSize, snakeHead[1]]
		moving()
	}

	function moveRight() {
		snake[0] = [<number>snakeHead[0] + cellSize, snakeHead[1]]
		moving()
	}
}


/* Check keyboard */
function keyDown(key: any) { // physical keys
	key = key || window.event

	moveDirection = (function () {
		switch (key.keyCode) {
			case 38: // arrow up
			case 87: // w
				return 'up'
			case 40: // arrow down
			case 83: // s
				return 'down'
			case 37: // arrow left
			case 65: // a
				return 'left'
			case 39: // arrow right
			case 68: // d
				return 'right'
			case 32: // space
				return 'pause'
			case 82: // r
				gameRestart()
				break
			case 27: // esc
				return 'exit'
			case 189: // -
				timeSpeed += 25
				break
			case 187: // +
				timeSpeed < 26 ? timeSpeed = 1 : timeSpeed -= 25
				break
		}
		return moveDirection
	}())
}

function gameRestart() {
	snake = generateSnake()
	moveDirection = 'pause'
	isFruitTaken = false

	color_snake = generateColor(255, 190, 220)
	color_snakeHead = generateColor(210, 180, 180)
	color_fruit = generateColor(150, 210, 210) // FIXME: it's working without this, but buggy

	lastDirection = ''

	snakeHead = snake[0]
}

/* Collision */
function collision() {
	// fruit
	if (snakeHead[0] === fruit[0] && snakeHead[1] === fruit[1]) {
		isFruitTaken = false
		isIncrease = true
	}

	// snake in self
	if (!isSnakeInSelfMode) {
		for (let i = 1; i < snake.length; i++) {
			if (snakeHead[0] === snake[i][0] && snakeHead[1] === snake[i][1]) {
				color_snake = color_snakeDead
				color_snakeHead = color_snakeDead
				console.log('eaten by itself')
				gameRestart()
				// isGameOver = true
			}
		}
	}

	// walls
	if (isPortalMode) { // portal mode - on
		if (snakeHead[0] < 0)
			snake[0][0] = gameWindowWidth - cellSize
		else if (snakeHead[1] < 0)
			snake[0][1] = gameWindowHeight - cellSize
		else if (snakeHead[0] >= gameWindowWidth)
			snake[0][0] = 0
		else if (snakeHead[1] >= gameWindowHeight)
			snake[0][1] = 0
	} else { // portal mode - off
		if (snakeHead[0] < 0 || snakeHead[1] < 0 || snakeHead[0] >= gameWindowWidth || snakeHead[1] >= gameWindowHeight) {
			color_snake = color_snakeDead
			color_snakeHead = color_snakeDead
			console.log('crash with walls')
			gameRestart()
			// isGameOver = true
		}
	}
}

/* modes switches */
function changePortalMode() {
	const htmlButton = <HTMLElement>document.getElementById('portal-mode')

	isPortalMode = (function () {
		switch (isPortalMode) {
			case true:
				htmlButton.innerHTML = `<p>portal on</p>`
				htmlButton.className = 'bt-on'
				return false
			case false:
				htmlButton.innerHTML = `<p>portal off</p>`
				htmlButton.className = 'bt-off'
				return true
		}
	}())
}

function changeAimMode() {
	const htmlButton = <HTMLElement>document.getElementById('aim-mode')

	isAimMode = (function () {
		switch (isAimMode) {
			case true:
				moveDirection = 'pause'

				htmlButton.innerHTML = `<p>aim mode on</p>`
				htmlButton.className = 'bt-on'
				return false
			case false:
				htmlButton.innerHTML = `<p>aim</p> off`
				htmlButton.className = 'bt-off'
				return true
		}
	}())
}

function changeSnakeInSelfMode() {
	const htmlButton = <HTMLElement>document.getElementById('snake-in-self-mode')

	isSnakeInSelfMode = (function () {
		switch (isSnakeInSelfMode) {
			case true:
				htmlButton.innerHTML = `<p>snake in self on</p>`
				htmlButton.className = 'bt-on'
				return false
			case false:
				htmlButton.innerHTML = `<p>snake in self off</p>`
				htmlButton.className = 'bt-off'
				return true
		}
	}())
}

function changeMovingBackwardMode() {
	const htmlButton = <HTMLElement>document.getElementById('moving-backward-mode')

	isMovingBackwardMode = (function () {
		switch (isMovingBackwardMode) {
			case true:
				lastDirection = moveDirection

				htmlButton.innerHTML = `<p>moving backward on</p>`
				htmlButton.className = 'bt-on'
				return false
			case false:
				lastDirection = ''

				htmlButton.innerHTML = `<p>moving backward off</p>`
				htmlButton.className = 'bt-off'
				return true
		}
	}())
}

/* modes */

// Aim v2.0 FIXME: Crash with walls when trying moving backward
function aimMode() {
	moveDirection = (function () {
		let temp_direction

		let isMoveUp,
			isMoveDown,
			isMoveLeft,
			isMoveRight

		// function check if snake moving in self-body
		const checkSelfBody = (direction: Array<number>): boolean => {
			for (let i = 1; i < snake.length; i++) {
				if (direction[0] === snake[i][0] && direction[1] === snake[i][1])
					return false
			}
			return true
		}

		// Up
		isMoveUp = (function () {
			temp_direction = [snakeHead[0], snakeHead[1] - cellSize] // find direction

			// she'll never go in to wall
			if (temp_direction[1] < 0) console.log('walls') // block move if is it walls

			// FIXME: Performance: Call it 1 time for all directions
			checkSelfBody(temp_direction)

			// default
			return true
		}())
		isMoveUp ? drawOneCell(temp_direction, color_aimTrue) : drawOneCell(temp_direction, color_aimFalse) // draw

		// Down
		isMoveDown = (function () {
			temp_direction = [snakeHead[0], <number>snakeHead[1] + cellSize]

			if (temp_direction[1] >= gameWindowHeight) return false

			checkSelfBody(temp_direction)

			return true
		}())
		isMoveDown ? drawOneCell(temp_direction, color_aimTrue) : drawOneCell(temp_direction, color_aimFalse)

		// Left
		isMoveLeft = (function () {
			temp_direction = [snakeHead[0] - cellSize, snakeHead[1]]

			if (temp_direction[0] < 0) return false

			checkSelfBody(temp_direction)

			return true
		}())
		isMoveLeft ? drawOneCell(temp_direction, color_aimTrue) : drawOneCell(temp_direction, color_aimFalse)

		// Right
		isMoveRight = (function () {
			temp_direction = [<number>snakeHead[0] + cellSize, snakeHead[1]]

			if (temp_direction[0] >= gameWindowWidth) return false

			checkSelfBody(temp_direction)

			return true
		}())
		isMoveRight ? drawOneCell(temp_direction, color_aimTrue) : drawOneCell(temp_direction, color_aimFalse)


		/* find fruit and moving in this direction */
		if (fruit[1] < snakeHead[1] && isMoveUp) {
			return 'up'
		}
		if (fruit[1] > snakeHead[1] && isMoveDown) {
			return 'down'
		}
		if (fruit[0] < snakeHead[0] && isMoveLeft) {
			return 'left'
		}
		if (fruit[0] > snakeHead[0] && isMoveRight) {
			return 'right'
		}

		return moveDirection
	}())
}