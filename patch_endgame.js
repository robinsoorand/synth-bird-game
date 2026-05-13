const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

code = code.replace(
    /gameOverScreen\.classList\.remove\('hidden'\);\n\s*setupBirdSelection\(\);/,
    `gameOverScreen.classList.remove('hidden');
    cumulativeScoreDisplay.textContent = cumulativeScore;
    setupBirdSelection();
    setupLevelSelection();`
);

fs.writeFileSync('script.js', code);
