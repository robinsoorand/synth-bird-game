const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

code = code.replace(
    /function setupBirdSelection\(\) \{[\s\S]*?function endGame\(\)/,
    `function setupBirdSelection() {
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

function endGame()`
);

fs.writeFileSync('script.js', code);
