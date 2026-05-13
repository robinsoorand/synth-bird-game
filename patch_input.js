const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Fix handleInput to use dynamic jump physics
code = code.replace(
    /velocity = jump;/,
    `const physics = levels[selectedLevelIndex].physics;
        velocity = physics.jump;`
);

// We need to clean up old chaos bird drawing code in gameLoop
code = code.replace(
    /function gameLoop\(\) \{\n\s*update\(\);\n\s*\/\/ Only draw if not chaos bird \(which draws on its own timer in update\)\n\s*if \(\!birds\[selectedBirdIndex\]\.theme\.chaos\) \{\n\s*draw\(\);\n\s*\}\n\s*if \(\!gameOver\) \{\n\s*requestAnimationFrame\(gameLoop\);\n\s*\}\n\}/m,
    `function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}`
);

// We need to fix the update function to not redraw in start screen for chaos bird (old logic)
code = code.replace(
    /\/\/ Keep chaos bird animating even on start screen[\s\S]*?if \(birds\[selectedBirdIndex\]\.theme\.chaos && \!gameOver\) \{[\s\S]*?draw\(\);[\s\S]*?\}/m,
    ``
);

fs.writeFileSync('script.js', code);
