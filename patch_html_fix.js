const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<div style="display: flex; gap: 10px;">/g, '<div style="display: flex; gap: 10px; margin-top: 15px;">');

fs.writeFileSync('index.html', html);
