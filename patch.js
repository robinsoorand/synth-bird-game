const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Fix bestScore loading
code = code.replace(
    /let bestScore = localStorage\.getItem\('flappyBirdBestScore'\) \|\| 0;/,
    `let bestScore = parseInt(localStorage.getItem('flappyBirdBestScore'), 10) || 0;
if (isNaN(bestScore)) bestScore = 0;
let cumulativeScore = parseInt(localStorage.getItem('flappyBirdCumulativeScore'), 10) || 0;
if (isNaN(cumulativeScore)) cumulativeScore = 0;`
);

// Fix endGame to handle cumulativeScore
code = code.replace(
    /function endGame\(\) \{[\s\S]*?finalScoreEl\.textContent = score;/,
    `function endGame() {
    gameOver = true;
    gameStarted = false;
    finalScoreEl.textContent = score;

    cumulativeScore += score;
    localStorage.setItem('flappyBirdCumulativeScore', cumulativeScore);`
);

fs.writeFileSync('script.js', code);
