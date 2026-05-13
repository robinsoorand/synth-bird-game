const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// I need to use the exact string present in the file to replace
code = code.replace(
    /function initializeGame\(\) \{[\s\S]*?\}\n\ndocument\.addEventListener\('keydown'/m,
    `function initializeGame() {
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

document.addEventListener('keydown'`
);

fs.writeFileSync('script.js', code);
