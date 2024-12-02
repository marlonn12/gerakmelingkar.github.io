const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const radius = 150;
let angle = 0;
let speed = 0.02;
let score = 0;
let level = 1;
let gameRunning = false;
let direction = 1; // 1: kiri-kanan, -1: kanan-kiri
let topScore = 0; // Top Score
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const coinRadius = 5;
const coins = [];
const bombs = [];
let intervalID;

document.getElementById("playButton").addEventListener("click", startGame);
document.getElementById("changeDirectionButton").addEventListener("click", () => {
    if (gameRunning) direction *= -1; // Balik arah
});
document.addEventListener("keydown", handleKeyPress);

function startGame() {
    gameRunning = true;
    score = 0;
    level = 1;
    bombs.length = 0;
    coins.length = 0;
    document.getElementById("levelText").innerText = `Level: ${level}`;
    document.getElementById("scoreText").innerText = `Score: ${score}`;
    generateCoins();
    intervalID = setInterval(updateGame, 1000 / 60); // 60 FPS
    document.getElementById("playButton").style.display = "none";
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update titik merah
    angle += direction * speed;
    if (angle >= Math.PI * 2) angle = 0;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Gambar lingkaran
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Gambar titik merah
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    // Gambar koin
    coins.forEach((coin, index) => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coinRadius, 0, Math.PI * 2);
        ctx.fillStyle = "gold";
        ctx.fill();

        // Periksa jika titik menyentuh koin
        const distance = Math.sqrt((coin.x - x) ** 2 + (coin.y - y) ** 2);
        if (distance < coinRadius + 5) {
            coins.splice(index, 1);
            score += 10;
            document.getElementById("scoreText").innerText = `Score: ${score}`;
            if (coins.length === 0) levelUp();
        }
    });

    // Gambar bom
    bombs.forEach((bomb, index) => {
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();

        // Periksa jika bom mengenai titik merah
        const distance = Math.sqrt((bomb.x - x) ** 2 + (bomb.y - y) ** 2);
        if (distance < 15) gameOver();

        bomb.y += bomb.speed;
        if (bomb.y > canvas.height) bombs.splice(index, 1);
    });
}

function generateCoins() {
    coins.length = 0;
    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        coins.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        });
    }
}

function levelUp() {
    level++;
    document.getElementById("levelText").innerText = `Level: ${level}`;
    generateCoins();
    spawnBombs();
}

function gameOver() {
    clearInterval(intervalID);
    gameRunning = false;

    if (score > topScore) {
        topScore = score;
        document.getElementById("topScoreText").innerText = `Top Score: ${topScore}`;
    }

    alert(`Game Over! Skor akhir: ${score}`);
    document.getElementById("playButton").style.display = "block";
}

function handleKeyPress(event) {
    if (event.code === "Space" && gameRunning) direction *= -1;
}

function spawnBombs() {
    for (let i = 0; i < level; i++) {
        bombs.push({
            x: Math.random() * canvas.width,
            y: -10,
            speed: Math.random() * 2 + 1,
        });
    }
}

setInterval(() => {
    if (gameRunning) spawnBombs(5);
}, 3000);
