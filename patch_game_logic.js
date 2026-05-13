const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Replace references to currentTheme and gimmick logic in draw()
code = code.replace(
    /const currentTheme = currentBird\.theme;/,
    `const currentLevel = levels[selectedLevelIndex];
    const currentTheme = currentLevel.theme;
    const currentPhysics = currentLevel.physics;`
);

// We also need to fix draw() references to chaos bird handling
code = code.replace(
    /if \(currentTheme\.chaos\) \{[\s\S]*?\} else \{[\s\S]*?\ctx\.strokeStyle = currentTheme\.pipe\.stroke;[\s\S]*?\ctx\.shadowColor = currentTheme\.pipe\.shadow;[\s\S]*?\}/,
    `if (currentLevel.gimmick === 'epilepsy') {
        const hue = Math.floor(Math.random() * 360);
        const randomColor = \`hsl(\${hue}, 100%, 50%)\`;
        ctx.strokeStyle = randomColor;
        ctx.shadowColor = randomColor;
        ctx.fillStyle = \`hsl(\${(hue + 180) % 360}, 100%, 50%)\`; // Complementary fill
        canvas.style.borderColor = randomColor;
        canvas.style.boxShadow = \`0 0 20px \${randomColor}\`;
    } else {
        ctx.strokeStyle = currentTheme.pipe.stroke;
        ctx.shadowColor = currentTheme.pipe.shadow;
        ctx.fillStyle = currentTheme.pipe.fill;
    }`
);
code = code.replace(/ctx\.fillStyle = currentTheme\.pipe\.fill;/g, ''); // Clean up the old fill style that was outside the if/else block

// Fix update() logic to use current physics and gimmicks
code = code.replace(
    /velocity \+= gravity;\n\s*birdY \+= velocity;\n\s*pipeX -= \(2 \+ score \* 0\.1\);/,
    `const currentLevel = levels[selectedLevelIndex];
        const physics = currentLevel.physics;
        velocity += physics.gravity;
        birdY += velocity;
        pipeX -= (physics.baseSpeed + score * physics.speedScaling);`
);

// Handle specific gimmicks in update()
code = code.replace(
    /if \(pipeX \+ pipeWidth < 0\) \{/,
    `// Moving Pipes Gimmick
        if (currentLevel.gimmick === 'moving_pipes') {
            topPipeHeight += Math.sin(performance.now() / 500) * 2;
        }

        if (pipeX + pipeWidth < 0) {`
);

code = code.replace(
    /const bottomPipeY = topPipeHeight \+ pipeGap;/g,
    `const bottomPipeY = topPipeHeight + pipeGap;` // Ensure this exists
);

fs.writeFileSync('script.js', code);
