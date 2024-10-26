const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

canvas.width = 800;
canvas.height = 600;

const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 45;
const PLAYER_VEL = 4;
const STAR_WIDTH = 8;
const STAR_HEIGHT = 16;
const STAR_VEL = 2.5;

let player = {
    x: canvas.width / 2 - PLAYER_WIDTH / 2,
    y: canvas.height - PLAYER_HEIGHT - 10,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT
};

let stars = [];
let elapsedTime = 0;
let starAddIncrement = 1500;
let starCount = 0;
let hit = false;
let startTime = Date.now();
let highScore = localStorage.getItem('highScore') || 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentTime = hit ? elapsedTime : Math.round((Date.now() - startTime) / 1000);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Time: ${currentTime}s`, 10, 20);

    ctx.fillText(`High Score: ${highScore}s`, 10, 50);

    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    for (const star of stars) {
        ctx.fillStyle = "white";
        ctx.fillRect(star.x, star.y, STAR_WIDTH, STAR_HEIGHT);
    }

    if (hit) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        const text = "You Lost!";
        const textWidth = ctx.measureText(text).width;
        const textX = canvas.width / 2 - textWidth / 2;
        const textY = canvas.height / 2 - 100;
        ctx.fillText(text, textX, textY);

        restartButton.style.display = 'block';
        restartButton.style.top = `${textY + 50}px`;
    }
}

function update() {
    if (hit) return;

    starCount += 16;
    elapsedTime = Math.round((Date.now() - startTime) / 1000);

    if (starCount > starAddIncrement) {
        for (let i = 0; i < 2; i++) {
            const starX = Math.random() * (canvas.width - STAR_WIDTH);
            stars.push({ x: starX, y: -STAR_HEIGHT });
        }
        starAddIncrement = Math.max(200, starAddIncrement - 50);
        starCount = 0;
    }
    stars.forEach((star, index) => {
        star.y += STAR_VEL;
        if (star.y > canvas.height) {
            stars.splice(index, 1);
        } else if (
            star.y + STAR_HEIGHT >= player.y &&
            star.x < player.x + player.width &&
            star.x + STAR_WIDTH > player.x
        ) {
            hit = true;
            if (elapsedTime > highScore) {
                highScore = elapsedTime;
                localStorage.setItem('highScore', highScore);
            }
        }
    });
}

function resetGame() {
    player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
    player.y = canvas.height - PLAYER_HEIGHT - 10;
    stars = [];
    elapsedTime = 0;
    starAddIncrement = 1500;
    starCount = 0;
    hit = false;
    startTime = Date.now();
    restartButton.style.display = 'none';
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if(hit) return;
    if (e.key === 'ArrowLeft' && player.x - PLAYER_VEL >= 0) {
        player.x -= PLAYER_VEL;
    } else if (e.key === 'ArrowRight' && player.x + PLAYER_VEL + player.width <= canvas.width) {
        player.x += PLAYER_VEL;
    }
});

restartButton.addEventListener('click', resetGame);

gameLoop();