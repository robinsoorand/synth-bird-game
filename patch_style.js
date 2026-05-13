const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

css += `
#gameOverScreen {
    max-width: 95%; /* Give it a bit more room */
    padding: 15px;
}

#birdSelection h2, #levelSelection h2 {
    font-size: 10px;
    margin-bottom: 5px;
}

.bird-grid, .level-grid {
    gap: 5px;
    padding: 0;
}
`;

fs.writeFileSync('style.css', css);
