const cvs = document.getElementById('gameCanvas')
const ctx = cvs.getContext('2d')

const sprite = new Image()
sprite.src = '/penguin.png'

let score = 0

let position = {
    x: 80,
    y: 300,
    yv: 0
}

document.addEventListener('keydown', direction)

let jump = false

function direction(event) {
    if (event.keyCode === 32) {
        jump = true
    }
}

const wallWidth = 20
const gapHeight = 120

function gameOver() {
    document.getElementById('scoreCount').innerHTML = 'Game Over'
    clearInterval(game)
}

function updateScore() {
    score++
    document.getElementById('scoreCount').innerHTML = score
}

function newWall() {
    const randomInt = Math.floor(Math.random() * (cvs.height - gapHeight))
    return {
        y: randomInt,
        x: cvs.width,
        isPassed: false,
        update() {
            this.x -= 2
        },
        passed() {
            this.isPassed = true
            updateScore()
        }
    }
}

function collision() {
    if (position.y + 30> 600) {
        gameOver()
    }
    if (!walls[0].isPassed) {
        if (walls[0].x < 80) {
            walls[0].passed()
        }
        if (!walls[0].isPassed) {
            // top left corner
            if ((position.x >= walls[0].x && position.x <= walls[0].x + wallWidth) &&
                (position.y <= walls[0].y || position.y >= walls[0].y + gapHeight)
            ) {
                gameOver()
            }
            // bottom left  
            if ((position.x >= walls[0].x && position.x <= walls[0].x + wallWidth) &&
                (position.y + 30 <= walls[0].y || position.y + 30 >= walls[0].y + gapHeight)
            ) {
                gameOver()
            }
            // top right
            if ((position.x + 30 >= walls[0].x && position.x + 30 <= walls[0].x + wallWidth) &&
                (position.y <= walls[0].y || position.y >= walls[0].y + gapHeight)
            ) {
                gameOver()
            }
            // bottom right
            if ((position.x + 30 >= walls[0].x && position.x + 30 <= walls[0].x + wallWidth) &&
                (position.y + 30 <= walls[0].y || position.y + 30 >= walls[0].y + gapHeight)
            ) {
                gameOver()
            }
        }
    } else if (walls[0].x + wallWidth === 0) {
        walls.shift()
    }
}

let walls = []
walls = [newWall()]

// Physics
const deltaTime = 16.67
const gravity = .001
const jumpHeight = .4

function update() {
    collision()

    ctx.clearRect(0, 0, cvs.width, cvs.height)

    if (800 - walls[walls.length - 1].x >= 200) {
        walls.push(newWall())
    }

    ctx.drawImage(sprite, position.x, position.y, 30, 30)
    for (let i = 0; i < walls.length; i++) {
        ctx.fillStyle = 'lightgreen'
        ctx.fillRect(walls[i].x, 0, wallWidth, walls[i].y)
        ctx.fillRect(walls[i].x, walls[i].y + gapHeight, wallWidth, 600 - (walls[i].y + gapHeight))
        walls[i].update()
    }



    if (jump) {
        position.yv = jumpHeight
        jump = false
    }
    position.y -= position.yv * deltaTime
    position.yv -= gravity * deltaTime
}

let game = setInterval(update, deltaTime)