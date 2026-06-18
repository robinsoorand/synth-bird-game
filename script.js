const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get DOM elements for the game over screen
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const bestScoreEl = document.getElementById('bestScore');
const restartButton = document.getElementById('restartButton');
const cumulativeScoreDisplay = document.getElementById('cumulativeScoreDisplay');
const devModeToggle = document.getElementById('devModeToggle');
let devMode = false;

devModeToggle.addEventListener('change', (e) => {
    devMode = e.target.checked;
    setupBirdSelection();
    setupLevelSelection();
});

// --- Bird & Theme Configuration ---
let selectedBirdIndex = 0; // Default to the first bird
const birds = [
    {
        unlockScore: 0,
        main: '#ff00ff', wing: '#ff99ff', shadow: '#ff00ff',
        draw: (context, bird) => {
            context.fillStyle = bird.main; context.shadowColor = bird.shadow; context.shadowBlur = 10;
            context.beginPath(); context.ellipse(0, 0, birdWidth / 2, birdHeight / 2, 0, 0, Math.PI * 2); context.fill();
            context.fillStyle = bird.wing;
            context.beginPath(); context.arc(-5, 0, birdHeight / 3, 0, Math.PI * 2); context.fill();
            context.fillStyle = 'white';
            context.beginPath(); context.arc(birdWidth / 4, -birdHeight / 5, 2, 0, Math.PI * 2); context.fill();
        }
    },
    {
        unlockScore: 5,
        main: '#ff9a00', wing: '#ffeda0', shadow: '#ff9a00',
        draw: (context, bird) => {
            context.fillStyle = bird.main; context.shadowColor = bird.shadow; context.shadowBlur = 15;
            context.beginPath(); context.moveTo(birdWidth / 2, 0); context.lineTo(-birdWidth / 2, birdHeight / 2); context.lineTo(-birdWidth / 2, -birdHeight / 2); context.fill();
            context.fillStyle = bird.wing;
            context.beginPath(); context.moveTo(0, 0); context.lineTo(-birdWidth / 2, birdHeight / 1.5); context.lineTo(-birdWidth / 2, 0); context.fill();
            context.fillStyle = 'white'; context.beginPath(); context.arc(birdWidth / 6, 0, 2, 0, Math.PI * 2); context.fill();
        }
    },
    {
        unlockScore: 10,
        main: '#00ffff', wing: '#aaffff', shadow: '#00ffff',
        draw: (context, bird) => {
            context.fillStyle = bird.main; context.shadowColor = bird.shadow; context.shadowBlur = 12;
            context.fillRect(-birdWidth/2, -birdHeight/2, birdWidth, birdHeight);
            context.fillStyle = bird.wing;
            context.fillRect(-birdWidth/2 - 5, -birdHeight/4, birdWidth/2, birdHeight/2);
            context.fillStyle = 'white';
            context.fillRect(birdWidth/4, -birdHeight/4, 4, 4);
        }
    },
    {
        unlockScore: 15,
        main: '#00ff00', wing: '#88ff88', shadow: '#00ff00',
        draw: (context, bird) => {
             context.fillStyle = bird.main; context.shadowColor = bird.shadow; context.shadowBlur = 10;
             context.beginPath(); context.moveTo(-birdWidth/2, birdHeight/2); context.quadraticCurveTo(0, -birdHeight, birdWidth/2, birdHeight/2); context.fill();
             context.fillStyle = bird.wing;
             context.beginPath(); context.arc(-birdWidth/6, birdHeight/4, birdHeight/4, 0, Math.PI*2); context.fill();
             context.fillStyle = 'white'; context.beginPath(); context.arc(birdWidth/6, 0, 2, 0, Math.PI*2); context.fill();
        }
    },
    {
        unlockScore: 25,
        main: 'transparent',
        draw: (context, bird) => {
            const time = performance.now() / 200;
            const bodyGradient = context.createLinearGradient(0, -birdHeight/2, 0, birdHeight/2);
            bodyGradient.addColorStop(0, '#ff0055'); bodyGradient.addColorStop(0.5, '#cc00ff'); bodyGradient.addColorStop(1, '#00ddff');
            context.shadowColor = '#cc00ff'; context.shadowBlur = 15;
            context.fillStyle = bodyGradient;
            context.beginPath(); context.ellipse(0, 0, birdWidth / 2, birdHeight / 2 + 2, 0, 0, Math.PI * 2); context.fill();
            context.beginPath(); context.moveTo(birdWidth/4, -birdHeight/2); context.bezierCurveTo(birdWidth/2, -birdHeight, birdWidth/4, -birdHeight, birdWidth/4-5, -birdHeight/2-2); context.fill();
        }
    },
    {
        unlockScore: 50,
        main: 'white',
        draw: (context, bird) => {
            const hue = Math.floor(performance.now() / 10) % 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            const lightColor = `hsl(${hue}, 100%, 75%)`;
            context.shadowColor = color; context.shadowBlur = 25;
            context.fillStyle = 'white'; context.beginPath(); context.arc(0, 0, birdHeight/2.5, 0, Math.PI*2); context.fill();
            context.fillStyle = lightColor;
            for(let i=0; i<3; i++) {
                const angle = (performance.now() / 100) + (i * Math.PI * 2 / 3);
                const x = Math.cos(angle) * birdWidth/1.8;
                const y = Math.sin(angle) * birdWidth/1.8;
                context.beginPath(); context.arc(x,y, 4, 0, Math.PI*2); context.fill();
            }
            context.fillStyle = color; context.beginPath(); context.arc(0, 0, birdHeight/3, 0, Math.PI*2); context.fill();
        }
    }
];


let selectedLevelIndex = 0;
const levels = [
    { // Level 0: Monochrome Infinity
        unlockScore: 0,
        theme: {
            pipe: { fill: '#555', stroke: '#fff', shadow: '#fff' },
            canvas: { border: '#fff', shadow: '#fff' },
            score: '#fff',
            background: {
                gradient: 'linear-gradient(0deg, #111 0%, #333 100%)',
                mountains: []
            }
        },
        physics: { gravity: 0.5, jump: -8, baseSpeed: 2, speedScaling: 0.1 },
        gimmick: 'none'
    },
    { // Level 1: Moving Pipes
        unlockScore: 10,
        theme: {
            pipe: { fill: '#2a0035', stroke: '#ff00ff', shadow: '#ff00ff' },
            canvas: { border: '#f0f', shadow: '#f0f' },
            score: '#ffffff',
            background: { gradient: 'linear-gradient(0deg, rgba(20,0,30,1) 0%, rgba(80,20,100,1) 100%)', mountains: [] }
        },
        physics: { gravity: 0.5, jump: -8, baseSpeed: 2.5, speedScaling: 0.1 },
        gimmick: 'moving_pipes'
    },
    { // Level 2: Speed Rush
        unlockScore: 25,
        theme: {
            pipe: { fill: '#002200', stroke: '#00ff00', shadow: '#00ff00' },
            canvas: { border: '#0f0', shadow: '#0f0' },
            score: '#ffffff',
            background: {
                gradient: 'linear-gradient(0deg, rgba(0,20,0,1) 0%, rgba(0,80,0,1) 100%)',
                mountains: [`url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3e%3cpolygon fill='%23001a00' stroke='%2300ff00' stroke-width='4' points='0,400 150,150 300,300 500,100 650,250 800,400'/%3e%3c/svg%3e")`]
            }
        },
        physics: { gravity: 0.5, jump: -8, baseSpeed: 3, speedScaling: 0.3 }, // Fast scaling
        gimmick: 'none'
    },
    { // Level 3: Heavy Bird
        unlockScore: 50,
        theme: {
            pipe: { fill: '#330000', stroke: '#ff0000', shadow: '#ff0000' },
            canvas: { border: '#f00', shadow: '#f00' },
            score: '#ffffff',
            background: { gradient: 'linear-gradient(0deg, #300 0%, #600 100%)', mountains: [] }
        },
        physics: { gravity: 1.0, jump: -12, baseSpeed: 2.5, speedScaling: 0.1 }, // Heavy
        gimmick: 'none'
    },
    { // Level 4: Blackouts
        unlockScore: 150,
        theme: {
            pipe: { fill: '#000033', stroke: '#0000ff', shadow: '#0000ff' },
            canvas: { border: '#00f', shadow: '#00f' },
            score: '#ffffff',
            background: { gradient: 'linear-gradient(0deg, #001 0%, #003 100%)', mountains: [] }
        },
        physics: { gravity: 0.5, jump: -8, baseSpeed: 2.5, speedScaling: 0.1 },
        gimmick: 'blackouts'
    },
    { // Level 5: Epilepsy Mode
        unlockScore: 500,
        theme: {
            pipe: { fill: '#000', stroke: '#fff', shadow: '#fff' },
            canvas: { border: '#fff', shadow: '#fff' },
            score: '#fff',
            background: { gradient: 'linear-gradient(0deg, #000 0%, #111 100%)', mountains: [] }
        },
        physics: { gravity: 0.5, jump: -8, baseSpeed: 3, speedScaling: 0.15 },
        gimmick: 'epilepsy'
    }
];

function setupLevelSelection() {
    const levelOptions = document.querySelectorAll('.level-option');
    levelOptions.forEach((option, index) => {
        const level = levels[index];
        const isUnlocked = devMode || cumulativeScore >= level.unlockScore;

        option.classList.toggle('locked', !isUnlocked);
        option.classList.toggle('selected', index === selectedLevelIndex);

        if (isUnlocked) {
            option.onclick = () => {
                if(selectedLevelIndex === index) return;
                selectedLevelIndex = index;
                localStorage.setItem('flappyBirdSelectedLevel', selectedLevelIndex);
                document.querySelector('.level-option.selected')?.classList.remove('selected');
                option.classList.add('selected');
                applyTheme(level.theme);
            };
        } else {
            option.onclick = null;
        }
    });
}




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
let bestScore = parseInt(localStorage.getItem('flappyBirdBestScore'), 10) || 0;
if (isNaN(bestScore)) bestScore = 0;
let cumulativeScore = parseInt(localStorage.getItem('flappyBirdCumulativeScore'), 10) || 0;
if (isNaN(cumulativeScore)) cumulativeScore = 0;
bestScoreEl.textContent = bestScore;

function applyTheme(theme) {
    const bg = theme.background;
    let bgImages = bg.mountains.join(', ') + (bg.mountains.length > 0 ? ', ' : '') + bg.gradient;
    document.body.style.backgroundImage = bgImages;

    // Reset background properties if there are no mountains
    if (bg.mountains.length === 0) {
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = '100% 100%';
    } else {
        document.body.style.backgroundRepeat = 'repeat-x, repeat-x, no-repeat';
        document.body.style.backgroundPosition = 'bottom, bottom, center';
        document.body.style.backgroundSize = '100% 45%, 100% 50%, 100% 100%';
    }

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
    const currentLevel = levels[selectedLevelIndex];
    const currentTheme = currentLevel.theme;
    const currentPhysics = currentLevel.physics;

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
    if (currentLevel.gimmick === 'epilepsy') {
        const hue = Math.floor(Math.random() * 360);
        const randomColor = `hsl(${hue}, 100%, 50%)`;
        ctx.strokeStyle = randomColor;
        ctx.shadowColor = randomColor;
        ctx.fillStyle = `hsl(${(hue + 180) % 360}, 100%, 50%)`; // Complementary fill
        canvas.style.borderColor = randomColor;
        canvas.style.boxShadow = `0 0 20px ${randomColor}`;
    } else {
        ctx.strokeStyle = currentTheme.pipe.stroke;
        ctx.shadowColor = currentTheme.pipe.shadow;
        ctx.fillStyle = currentTheme.pipe.fill;
    }
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

    // Blackouts Gimmick
    if (currentLevel.gimmick === 'blackouts') {
        const time = performance.now();
        if (time % 3000 < 500) { // Black out for 500ms every 3 seconds
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

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
        const currentLevel = levels[selectedLevelIndex];
        const physics = currentLevel.physics;
        velocity += physics.gravity;
        birdY += velocity;
        pipeX -= (physics.baseSpeed + score * physics.speedScaling);

        // Moving Pipes Gimmick
        if (currentLevel.gimmick === 'moving_pipes') {
            topPipeHeight += Math.sin(performance.now() / 500) * 2;
        }

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
}

function setupBirdSelection() {
    const birdOptions = document.querySelectorAll('.bird-option');
    birdOptions.forEach((option, index) => {
        const bird = birds[index];
        const isUnlocked = devMode || bestScore >= bird.unlockScore;

        option.classList.toggle('locked', !isUnlocked);
        option.classList.toggle('selected', index === selectedBirdIndex);

        if (isUnlocked) {
            option.onclick = () => {
                if(selectedBirdIndex === index) return;
                selectedBirdIndex = index;
                localStorage.setItem('flappyBirdSelectedBird', selectedBirdIndex);
                document.querySelector('.bird-option.selected').classList.remove('selected');
                option.classList.add('selected');
            };
        } else {
            option.onclick = null;
        }

        const previewCanvas = option.querySelector('.bird-preview-canvas');
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.save();
        previewCtx.translate(previewCanvas.width / 2, previewCanvas.height / 2);
        
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

    cumulativeScore += score;
    localStorage.setItem('flappyBirdCumulativeScore', cumulativeScore);
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyBirdBestScore', bestScore);
        bestScoreEl.textContent = bestScore;
    }
    gameOverScreen.classList.remove('hidden');
    cumulativeScoreDisplay.textContent = cumulativeScore;
    setupBirdSelection();
    setupLevelSelection();
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
}

function handleInput() {
    if (!gameStarted) {
        gameStarted = true;
    }
    if (!gameOver) {
        const physics = levels[selectedLevelIndex].physics;
        velocity = physics.jump;
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function initializeGame() {
    const savedBirdIndex = localStorage.getItem('flappyBirdSelectedBird');
    if (savedBirdIndex !== null) {
        let potentialIndex = parseInt(savedBirdIndex, 10);
        if (devMode || bestScore >= birds[potentialIndex].unlockScore) {
             selectedBirdIndex = potentialIndex;
        }
    }

    const savedLevelIndex = localStorage.getItem('flappyBirdSelectedLevel');
    if (savedLevelIndex !== null) {
        let potentialIndex = parseInt(savedLevelIndex, 10);
        if (devMode || cumulativeScore >= levels[potentialIndex].unlockScore) {
             selectedLevelIndex = potentialIndex;
        }
    }

    applyTheme(levels[selectedLevelIndex].theme);
    gameLoop();
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (gameOver) {
            restartButton.click();
            return;
        }
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
