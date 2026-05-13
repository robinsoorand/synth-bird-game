const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// The regex replacement failed due to multiline issues. Let's fix draw() more precisely.

code = code.replace(
    /if \(currentTheme\.chaos\) \{[\s\S]*?ctx\.shadowBlur = 15;/m,
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
    }
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;`
);

// We need to implement blackout gimmick in draw()
code = code.replace(
    /ctx\.fillText\('Score: ' \+ score, 10, 10\);/,
    `ctx.fillText('Score: ' + score, 10, 10);

    // Blackouts Gimmick
    if (currentLevel.gimmick === 'blackouts') {
        const time = performance.now();
        if (time % 3000 < 500) { // Black out for 500ms every 3 seconds
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }`
);


fs.writeFileSync('script.js', code);
