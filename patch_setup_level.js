const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// I need to add setupLevelSelection because the previous regex failed to insert it
// First, find the birds array end and insert the levelsCode if missing
if (!code.includes('const levels = [')) {
    const levelsCode = `
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
                mountains: [\`url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3e%3cpolygon fill='%23001a00' stroke='%2300ff00' stroke-width='4' points='0,400 150,150 300,300 500,100 650,250 800,400'/%3e%3c/svg%3e")\`]
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
`;
    code = code.replace(/];/m, `];\n\n${levelsCode}\n`);
    fs.writeFileSync('script.js', code);
}
