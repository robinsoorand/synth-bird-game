const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Get new UI elements
code = code.replace(
    /const restartButton = document\.getElementById\('restartButton'\);/,
    `const restartButton = document.getElementById('restartButton');
const cumulativeScoreDisplay = document.getElementById('cumulativeScoreDisplay');
const devModeToggle = document.getElementById('devModeToggle');
let devMode = false;

devModeToggle.addEventListener('change', (e) => {
    devMode = e.target.checked;
    setupBirdSelection();
    setupLevelSelection();
});`
);

// We need to keep only visual/drawing elements in the birds array, removing "theme" stuff that is now for levels.
// Let's refactor the birds array to simplify it.
code = code.replace(
    /const birds = \[[\s\S]*?\];\n\/\/ --- End Configuration ---/,
    `const birds = [
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
            const color = \`hsl(\${hue}, 100%, 50%)\`;
            const lightColor = \`hsl(\${hue}, 100%, 75%)\`;
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
];`
);

fs.writeFileSync('script.js', code);
