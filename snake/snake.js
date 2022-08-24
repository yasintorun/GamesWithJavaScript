const GAME = {
    WIDTH: 800,
    HEIGHT: 600,
    GRID_SIZE: 25,
}

const GRID_WIDTH = GAME.WIDTH / GAME.GRID_SIZE;
const GRID_HEIGHT = GAME.HEIGHT / GAME.GRID_SIZE;

const THEME = {
    background: "#2A0944",
    gameArea: "#3FA796",
    snake: "#FEC260",
    apple: "#A10035"
}

const INPUTS = {
    LEFT: [37, 65],
    UP: [38, 87],
    RIGHT: [39, 68],
    DOWN: [40, 83],

    PAUSE: [27]
}

//DOM
document.body.style.backgroundColor = THEME.background

const canvas = document.getElementById("snake")
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

canvas.width = GAME.WIDTH
canvas.height = GAME.HEIGHT

class Game {
    constructor() {
        this.gameInterval = null;
    }

    init() {
        this.snake = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            tails: [],
            length: 3,
        }

        this.apple = {
            x: 10,
            y: 10,
            randomPoint: () => {
                do {
                    this.apple.x = Math.floor(Math.random() * GRID_WIDTH)
                    this.apple.y = Math.floor(Math.random() * GRID_HEIGHT)
                }while(this.snake.tails.some(t => t.x == this.apple.x && t.y == this.apple.y))
            }
        }
        this.apple.randomPoint()

        this.handleInput()
        this.gameInterval = setInterval(() => this.loop(), 1000 / 15)
    }

    loop() {
        this.update()
        this.draw()
    }

    handleInput() {
        document.addEventListener("keydown", (e) => {
            const { dx, dy } = this.snake
            if (INPUTS.LEFT.includes(e.keyCode) && dx != 1) {
                this.snake.dx = -1
                this.snake.dy = 0
            }
            else if (INPUTS.UP.includes(e.keyCode) && dy != 1) {
                this.snake.dy = -1;
                this.snake.dx = 0;
            }
            else if (INPUTS.RIGHT.includes(e.keyCode) && dx != -1) {
                this.snake.dx = 1;
                this.snake.dy = 0;
            }
            else if (INPUTS.DOWN.includes(e.keyCode) && dy != -1) {
                this.snake.dy = 1;
                this.snake.dx = 0;
            }
            else if (INPUTS.PAUSE.includes(e.keyCode) && dy != 1) {
                this.snake.dx = 0;
                this.snake.dy = 0;
            };
        })
    }

    reset() {
        clearInterval(this.gameInterval)
        this.init()
    }

    update() {
        //upate snake
        const { dx, dy } = this.snake
        if (dx != 0 || dy != 0) {
            const newX = this.snake.x + dx;
            const newY = this.snake.y + dy;

            this.snake.x = (newX < 0 ? GRID_WIDTH - 1 : (newX >= GRID_WIDTH ? 0 : newX))
            this.snake.y = (newY < 0 ? GRID_HEIGHT - 1 : (newY >= GRID_HEIGHT ? 0 : newY))
            
            if(this.snake.tails.some(t => t.x == this.snake.x && t.y == this.snake.y)) {
                this.reset()
            }

            this.snake.tails.push({
                x: this.snake.x,
                y: this.snake.y
            })
            if (this.snake.tails.length > this.snake.length) {
                this.snake.tails.shift()
            }
        }

        //end update snake

        //controls
        if(this.snake.x == this.apple.x && this.snake.y == this.apple.y) {
            this.snake.length++;
            this.apple.randomPoint()
        }
    }

    draw() {
        ctx.clearRect(0, 0, GAME.WIDTH, GAME.HEIGHT)

        //draw game area
        ctx.fillStyle = THEME.gameArea
        ctx.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT)
        //

        //draw snake
        ctx.fillStyle = THEME.snake
        ctx.strokeStyle = "#000000"

        const { x:sx, y:sy, tails } = this.snake
        const { GRID_SIZE } = GAME
        ctx.fillRect(sx * GRID_SIZE, sy * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        ctx.strokeRect(sx * GRID_SIZE, sy * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        tails.forEach((v, i) => {
            ctx.fillRect(v.x * GRID_SIZE, v.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
            ctx.strokeRect(v.x * GRID_SIZE, v.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        })
        //

        //draw apple

        ctx.fillStyle = THEME.apple
        const {x:ax, y:ay} = this.apple
        ctx.fillRect(ax*GRID_SIZE, ay*GRID_SIZE, GRID_SIZE, GRID_SIZE)
        ctx.strokeRect(ax * GRID_SIZE, ay * GRID_SIZE, GRID_SIZE, GRID_SIZE)
    }

}

const game = new Game()

game.init()