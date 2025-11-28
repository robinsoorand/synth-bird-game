const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get DOM elements for the game over screen
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const bestScoreEl = document.getElementById('bestScore');
const restartButton = document.getElementById('restartButton');

// --- Bird & Theme Configuration ---
let selectedBirdIndex = 0; // Default to the first bird
const birds = [
    { // Bird 0 - "Classic Neon"
        unlockScore: 0,
        theme: {
            bird: { main: '#ff00ff', wing: '#ff99ff', shadow: '#ff00ff' },
            pipe: { fill: '#0d0221', stroke: '#00ffff', shadow: '#00ffff' },
            canvas: { border: '#ff00ff', shadow: '#ff00ff' },
            score: '#ffff00',
            background: {
                gradient: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(22,0,48,1) 50%, rgba(131,58,180,1) 100%)',
                mountains: [
                    `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3e%3cpolygon fill='%231a0024' stroke='%23ff00ff' stroke-width='4' points='0,400 150,150 300,300 500,100 650,250 800,400'/%3e%3c/svg%3e")`,
                    `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3e%3cpolygon fill='%230d0221' stroke='%2300ffff' stroke-width='3' points='0,400 250,200 450,350 700,150 800,400'/%3e%3c/svg%3e")`
                ]
            }
        },
        draw: (context, bird) => {
            const theme = bird.theme.bird;
            context.fillStyle = theme.main; context.shadowColor = theme.shadow; context.shadowBlur = 10;
            context.beginPath(); context.ellipse(0, 0, birdWidth / 2, birdHeight / 2, 0, 0, Math.PI * 2); context.fill();
            context.fillStyle = theme.wing;
            context.beginPath(); context.arc(-5, 0, birdHeight / 3, 0, Math.PI * 2); context.fill();
            context.fillStyle = 'white';
            context.beginPath(); context.arc(birdWidth / 4, -birdHeight / 5, 2, 0, Math.PI * 2); context.fill();
        }
    },
    { // Bird 1 - "Sunset Finch"
        unlockScore: 5,
        theme: {
            bird: { main: '#ff9a00', wing: '#ffeda0', shadow: '#ff9a00' },
            pipe: { fill: '#2a0035', stroke: '#ff00ff', shadow: '#ff00ff' },
            canvas: { border: '#f0f', shadow: '#f0f' },
            score: '#ffffff',
            background: {
                gradient: 'linear-gradient(0deg, rgba(20,0,30,1) 0%, rgba(80,20,100,1) 100%)', mountains: []
            }
        },
        draw: (context, bird) => {
            const theme = bird.theme.bird;
            // Tail
            context.fillStyle = theme.main; context.shadowColor = theme.shadow; context.shadowBlur = 10;
            context.beginPath(); context.moveTo(-birdWidth/2, 0); context.lineTo(-birdWidth/2 - 10, -5); context.lineTo(-birdWidth/2 - 10, 5); context.fill();
            // Body
            context.beginPath(); context.ellipse(0, 0, birdWidth / 2, birdHeight / 2, 0, 0, Math.PI * 2); context.fill();
            // Wing
            context.fillStyle = theme.wing;
            context.beginPath(); context.ellipse(-5, 0, birdHeight / 2.5, birdHeight / 4, 0, 0, Math.PI * 2); context.fill();
            // Beak
            context.fillStyle = theme.main;
            context.beginPath(); context.moveTo(birdWidth / 2, 0); context.lineTo(birdWidth/2 + 10, -5); context.lineTo(birdWidth/2 + 10, 5); context.fill();
            // Eye
            context.fillStyle = '#00ffff';
            context.beginPath(); context.arc(birdWidth / 4, -birdHeight / 5, 2.5, 0, Math.PI * 2); context.fill();
        }
    },
    { // Bird 2 - "Grid Runner"
        unlockScore: 10,
        theme: {
            bird: { main: '#00ffff', wing: '#00ffff', shadow: '#00ffff' },
            pipe: { fill: '#111', stroke: '#00ff00', shadow: '#00ff00' },
            canvas: { border: '#00ff00', shadow: '#00ff00' },
            score: '#00ff00',
            background: {
                gradient: 'linear-gradient(0deg, #000 0%, #001 50%, #002 100%)', mountains: []
            }
        },
        draw: (context, bird) => {
            const theme = bird.theme.bird;
            context.strokeStyle = theme.main; context.shadowColor = theme.shadow; context.shadowBlur = 15;
            context.lineWidth = 3; context.fillStyle = 'rgba(0, 20, 30, 0.8)';
            // Body (rhombus)
            context.beginPath(); context.moveTo(birdWidth/2, 0); context.lineTo(0, -birdHeight/2); context.lineTo(-birdWidth/2, 0); context.lineTo(0, birdHeight/2); context.closePath(); context.stroke(); context.fill();
            // Wing (lines)
            context.beginPath(); context.moveTo(-10, -5); context.lineTo(5, 0); context.moveTo(-10, 5); context.lineTo(5, 0); context.stroke();
            // Eye (slit)
            context.beginPath(); context.moveTo(birdWidth / 4, -birdHeight/5); context.lineTo(birdWidth/4 + 5, -birdHeight/5 - 2); context.stroke();
        }
    },
    { // Bird 3 - "Neon Hawk"
        unlockScore: 15,
        theme: {
            bird: { main: '#ff0055', wing: '#ff4488', shadow: '#ff0055' },
            pipe: { fill: '#000', stroke: '#ff4488', shadow: '#ff4488' },
            canvas: { border: '#ff0055', shadow: '#ff0055' },
            score: '#fff',
            background: { gradient: 'linear-gradient(0deg, #111 0%, #301122 100%)', mountains: [] }
        },
        draw: (context, bird) => {
            const theme = bird.theme.bird;
            context.fillStyle = theme.main; context.shadowColor = theme.shadow; context.shadowBlur = 15;
            // Tail
            context.beginPath(); context.moveTo(-birdWidth/2, 0); context.lineTo(-birdWidth/2 - 15, -8); context.lineTo(-birdWidth/2 - 10, 0); context.lineTo(-birdWidth/2 - 15, 8); context.closePath(); context.fill();
            // Body (aggressive shape)
            context.beginPath(); context.moveTo(birdWidth/2 + 5, 0); context.lineTo(-5, -birdHeight/2); context.lineTo(-birdWidth/2, 0); context.lineTo(-5, birdHeight/2); context.closePath(); context.fill();
            // Wing (swept back)
            context.fillStyle = theme.wing; context.beginPath(); context.moveTo(-5, 0); context.lineTo(10, -birdHeight/4); context.lineTo(10, birdHeight/4); context.closePath(); context.fill();
             // Eye
            context.fillStyle = '#00ffff'; context.beginPath(); context.moveTo(birdWidth / 4, -birdHeight/5); context.lineTo(birdWidth/4 + 6, -birdHeight/5-2); context.lineTo(birdWidth/4+3, -birdHeight/5+2); context.closePath(); context.fill();
        }
    },
    { // Bird 4 - "Phoenix Fire"
        unlockScore: 25,
        theme: {
            bird: { main: 'yellow', wing: 'red', shadow: 'orange' }, // Will be replaced by gradient
            pipe: { fill: '#150500', stroke: '#ff5500', shadow: '#ff5500' },
            canvas: { border: '#ff5500', shadow: '#ff5500' },
            score: '#ffdd00',
            background: { gradient: 'linear-gradient(0deg, #330000 0%, #661100 100%)', mountains: [] }
        },
        draw: (context, bird) => {
            const theme = bird.theme.bird;
            context.shadowColor = theme.shadow; context.shadowBlur = 20;
            // Tail Flames
            let tailGradient = context.createLinearGradient(-birdWidth / 2, 0, -birdWidth/2-15, 0);
            tailGradient.addColorStop(0, "red"); tailGradient.addColorStop(1, "yellow");
            context.fillStyle = tailGradient;
            context.beginPath(); context.moveTo(-birdWidth/2, 0); context.bezierCurveTo(-birdWidth-5, -15, -birdWidth, 15, -birdWidth/2-5, 0); context.fill();
            // Body Gradient
            let bodyGradient = context.createRadialGradient(0, 0, 2, 0, 0, birdWidth/1.5);
            bodyGradient.addColorStop(0, "white"); bodyGradient.addColorStop(0.2, "yellow"); bodyGradient.addColorStop(0.8, "red"); bodyGradient.addColorStop(1, "orange");
            context.fillStyle = bodyGradient;
            context.beginPath(); context.ellipse(0, 0, birdWidth / 2, birdHeight / 2 + 2, 0, 0, Math.PI * 2); context.fill();
            // Head Crest
            context.beginPath(); context.moveTo(birdWidth/4, -birdHeight/2); context.bezierCurveTo(birdWidth/2, -birdHeight, birdWidth/4, -birdHeight, birdWidth/4-5, -birdHeight/2-2); context.fill();
        }
    },
    { // Bird 5 - "Chaos Orb"
        unlockScore: 50,
        theme: {
            bird: { main: 'white', wing: 'white', shadow: 'white' }, // Placeholder
            pipe: { fill: 'black', stroke: 'white', shadow: 'white' }, // Placeholder
            canvas: { border: 'white', shadow: 'white' }, // Placeholder
            score: 'white',
            background: { gradient: 'linear-gradient(0deg, #111 0%, #000 100%)', mountains: [] },
            chaos: true // Special flag
        },
        draw: (context, bird) => {
            const hue = Math.floor(performance.now() / 10) % 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            const lightColor = `hsl(${hue}, 100%, 75%)`;
            context.shadowColor = color; context.shadowBlur = 25;
            // Core
            context.fillStyle = 'white'; context.beginPath(); context.arc(0, 0, birdHeight/2.5, 0, Math.PI*2); context.fill();
            // Energy particles/wings
            context.fillStyle = lightColor;
            for(let i=0; i<3; i++) {
                const angle = (performance.now() / 100) + (i * Math.PI * 2 / 3);
                const x = Math.cos(angle) * birdWidth/1.8;
                const y = Math.sin(angle) * birdWidth/1.8;
                context.beginPath(); context.arc(x,y, 4, 0, Math.PI*2); context.fill();
            }
             // Core Glow
            context.fillStyle = color; context.beginPath(); context.arc(0, 0, birdHeight/3, 0, Math.PI*2); context.fill();
        }
    },
];
// --- End Configuration ---


// Game variables
let birdX = 50;
let birdWidth = 34;
let birdHeight = 24;
let birdY = 150;
let velocity = 0;
const gravity = 0.5;
const jump = -8;
let score = 0;
let gameOver = false;
let gameStarted = false;

// Pipe variables
const pipeWidth = 52;
const pipeGap = 120;
const pipeHeadHeight = 20;
const pipeHeadOverhang = 5;
const pipeHeadWidth = pipeWidth + pipeHeadOverhang * 2;
let pipeX = canvas.width;
let topPipeHeight = Math.random() * (canvas.height - pipeGap);
let currentPipeColor = null; // For chaos mode

// Score tracking
let bestScore = localStorage.getItem('flappyBirdBestScore') || 0;
bestScoreEl.textContent = bestScore;

function applyTheme(theme) {
    const bg = theme.background;
    let bgImages = bg.mountains.join(', ') + (bg.mountains.length > 0 ? ', ' : '') + bg.gradient;
    document.body.style.backgroundImage = bgImages;

    canvas.style.borderColor = theme.canvas.border;
    canvas.style.boxShadow = `0 0 20px ${theme.canvas.shadow}`;
}

function drawPipe(x, y, height, isTop) {
    const headX = x - pipeHeadOverhang;
    const headY = isTop ? y - pipeHeadHeight : y;
    ctx.fillRect(x, isTop ? 0 : y, pipeWidth, height);
    ctx.strokeRect(x, isTop ? 0 : y, pipeWidth, height);
    ctx.fillRect(headX, headY, pipeHeadWidth, pipeHeadHeight);
    ctx.strokeRect(headX, headY, pipeHeadWidth, pipeHeadHeight);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const currentBird = birds[selectedBirdIndex];
    const currentTheme = currentBird.theme;

    // Draw Bird
    ctx.save();
    const birdCenterX = birdX + birdWidth / 2;
    const birdCenterY = birdY + birdHeight / 2;
    ctx.translate(birdCenterX, birdCenterY);
    const rotation = Math.min(Math.max(velocity / 10, -0.5), 1.0) * (Math.PI / 4);
    ctx.rotate(rotation);
    currentBird.draw(ctx, currentBird);
    ctx.restore();

    // Draw Pipes
    if (currentTheme.chaos) {
        if (currentPipeColor === null) {
             const hue = Math.floor(Math.random() * 360);
             currentPipeColor = `hsl(${hue}, 100%, 50%)`;
        }
        ctx.strokeStyle = currentPipeColor;
        ctx.shadowColor = currentPipeColor;
    } else {
        ctx.strokeStyle = currentTheme.pipe.stroke;
        ctx.shadowColor = currentTheme.pipe.shadow;
    }
    ctx.fillStyle = currentTheme.pipe.fill;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    const bottomPipeY = topPipeHeight + pipeGap;
    const bottomPipeHeight = canvas.height - bottomPipeY;
    drawPipe(pipeX, topPipeHeight, topPipeHeight, true);
    drawPipe(pipeX, bottomPipeY, bottomPipeHeight, false);
    
    // Draw Score
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.fillStyle = currentTheme.score;
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'left'; 
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, 10, 10);

    // Draw Start Screen Text
    if (!gameStarted && !gameOver) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = currentTheme.canvas.shadow;
        ctx.shadowBlur = 10;
        ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
}

function checkOutOfBoundsCollision() {
    return (birdY + birdHeight) > canvas.height || birdY < 0;
}

function checkPipeCollision() {
    const birdRight = birdX + birdWidth;
    const pipeRight = pipeX + pipeWidth;
    return birdRight > pipeX && birdX < pipeRight && (birdY < topPipeHeight || (birdY + birdHeight) > (topPipeHeight + pipeGap));
}

function update() {
    if (gameOver) return;
    if (gameStarted) {
        velocity += gravity;
        birdY += velocity;
        pipeX -= (2 + score * 0.1);

        if (pipeX + pipeWidth < 0) {
            pipeX = canvas.width;
            topPipeHeight = Math.random() * (canvas.height / 2) + canvas.height / 4 - pipeGap / 2;
            score++;
            currentPipeColor = null; // New color for next pipe in chaos
        }

        if (checkOutOfBoundsCollision() || checkPipeCollision()) {
            endGame();
        }
    }
     // Keep chaos bird animating even on start screen
    if (birds[selectedBirdIndex].theme.chaos && !gameOver) {
       draw();
    }
}

function setupBirdSelection() {
    const birdOptions = document.querySelectorAll('.bird-option');
    birdOptions.forEach((option, index) => {
        const bird = birds[index];
        const isUnlocked = bestScore >= bird.unlockScore;

        option.classList.toggle('locked', !isUnlocked);
        option.classList.toggle('selected', index === selectedBirdIndex);

        if (isUnlocked) {
            option.onclick = () => {
                if(selectedBirdIndex === index) return;
                selectedBirdIndex = index;
                localStorage.setItem('flappyBirdSelectedBird', selectedBirdIndex);
                document.querySelector('.bird-option.selected').classList.remove('selected');
                option.classList.add('selected');
                applyTheme(bird.theme);
            };
        } else {
            option.onclick = null;
        }

        const previewCanvas = option.querySelector('.bird-preview-canvas');
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.save();
        previewCtx.translate(previewCanvas.width / 2, previewCanvas.height / 2);
        
        // Use temporary smaller dimensions for preview drawing
        const tempWidth = birdWidth, tempHeight = birdHeight;
        birdWidth = 25; birdHeight = 18;
        bird.draw(previewCtx, bird);
        birdWidth = tempWidth; birdHeight = tempHeight;

        previewCtx.restore();
    });
}

function endGame() {
    gameOver = true;
    gameStarted = false;
    finalScoreEl.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyBirdBestScore', bestScore);
        bestScoreEl.textContent = bestScore;
    }
    gameOverScreen.classList.remove('hidden');
    setupBirdSelection();
}

function restartGame() {
    birdY = 150;
    velocity = 0;
    score = 0;
    pipeX = canvas.width;
    topPipeHeight = Math.random() * (canvas.height / 2) + canvas.height / 4 - pipeGap / 2;
    gameOver = false;
    gameStarted = false;
    gameOverScreen.classList.add('hidden');
    currentPipeColor = null;
    gameLoop();
}

function handleInput() {
    if (!gameStarted) {
        gameStarted = true;
    }
    if (!gameOver) {
        velocity = jump;
    }
}

function gameLoop() {
    update();
    // Only draw if not chaos bird (which draws on its own timer in update)
    if (!birds[selectedBirdIndex].theme.chaos) {
        draw();
    }
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    const savedBirdIndex = localStorage.getItem('flappyBirdSelectedBird');
    if (savedBirdIndex !== null) {
        let potentialIndex = parseInt(savedBirdIndex, 10);
        if (bestScore >= birds[potentialIndex].unlockScore) {
             selectedBirdIndex = potentialIndex;
        }
    }
    applyTheme(birds[selectedBirdIndex].theme);
    gameLoop();
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (gameOver) return; // Prevent input if game over screen is up
        handleInput();
    }
});

document.addEventListener('mousedown', () => {
    if (gameOver) return;
    handleInput();
});

restartButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent restart from triggering game input
    restartGame();
});

initializeGame();
