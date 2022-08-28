const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const GRID_SIZE = 25

const GRID_WIDTH = GAME_WIDTH / GRID_SIZE
const GRID_HEIGHT = GAME_HEIGHT / GRID_SIZE

const THEME = {
    background: "#2A0944",
    gameArea: "#3FA796",
    snake: "#FEC260",
    apple: "#A10035",
}

const INPUTS = {
    LEFT: [37, 65],
    UP: [38, 87],
    RIGHT: [39, 68],
    DOWN: [40, 83],

    RESTART: [27]
}

const canvas = document.getElementById("snake")
canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT

/**@type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')


document.body.style.backgroundColor = THEME.background


class Game {
    init() {
        this.snake = {
            x: 0, y: 0,
            dx: 0, dy: 0,
            tails: [],
            length: 3
        }

        this.apple = {
            x: 10, y: 10,
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
            const {LEFT,UP, RIGHT, DOWN, RESTART} = INPUTS
            const {dx, dy} = this.snake
            if(LEFT.includes(e.keyCode) && dx != 1) {
                this.snake.dx = -1
                this.snake.dy = 0
            }
            if(UP.includes(e.keyCode) && dy != 1) {
                this.snake.dx = 0
                this.snake.dy = -1
            }
            if(RIGHT.includes(e.keyCode) && dx != -1) {
                this.snake.dx = 1
                this.snake.dy = 0
            }
            if(DOWN.includes(e.keyCode) && dy != -1) {
                this.snake.dx = 0
                this.snake.dy = 1
            }
        })
    }

    update() {
        const {dx, dy} = this.snake
        if(dx != 0 || dy != 0) {
            this.snake.x += dx;
            this.snake.y += dy;

            if(this.snake.x == this.apple.x && this.snake.y == this.apple.y) {
                this.snake.length++;
                this.apple.randomPoint()
            }

            if(this.snake.tails.some(t => t.x == this.snake.x && t.y == this.snake.y)) {
                clearInterval(this.gameInterval)
                this.init()
            }

            if(this.snake.x >= GRID_WIDTH) this.snake.x = 0
            if(this.snake.x < 0) this.snake.x = GRID_WIDTH - 1
            if(this.snake.y >= GRID_HEIGHT) this.snake.y = 0
            if(this.snake.y < 0) this.snake.y = GRID_HEIGHT - 1

            this.snake.tails.push({
                x: this.snake.x,
                y: this.snake.y,
            })

            if(this.snake.tails.length > this.snake.length) {
                this.snake.tails.shift()
            }
        }


    }

    draw() {
        // clear game area
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
        ctx.strokeStyle = "#000"
        
        //draw game area
        ctx.fillStyle = THEME.gameArea
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    
        
        //draw snake
        const {x: sx, y: sy, tails} = this.snake
        ctx.fillStyle = THEME.snake
        ctx.fillRect(sx * GRID_SIZE, sy* GRID_SIZE, GRID_SIZE, GRID_SIZE)
        ctx.strokeRect(sx * GRID_SIZE, sy* GRID_SIZE, GRID_SIZE, GRID_SIZE)
        
        tails.forEach((v, i) => {
            ctx.fillRect(v.x * GRID_SIZE, v.y* GRID_SIZE, GRID_SIZE, GRID_SIZE)
            ctx.strokeRect(v.x * GRID_SIZE, v.y* GRID_SIZE, GRID_SIZE, GRID_SIZE)
        })
        
        const {x: ax, y: ay} = this.apple
        ctx.fillStyle = THEME.apple
        ctx.fillRect(ax * GRID_SIZE, ay* GRID_SIZE, GRID_SIZE, GRID_SIZE)
        ctx.strokeRect(ax * GRID_SIZE, ay* GRID_SIZE, GRID_SIZE, GRID_SIZE)
        
    }
}

const game = new Game()

game.init()