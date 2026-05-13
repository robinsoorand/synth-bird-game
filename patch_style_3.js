const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

css += `
.bird-preview-canvas {
    width: 30px;
    height: 30px;
}
`;

fs.writeFileSync('style.css', css);
