const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

css += `
.bird-lock span {
    font-size: 8px;
    margin-top: 0px;
}
.level-lock span {
    font-size: 8px;
    margin-top: 0px;
}
.level-name {
    font-size: 10px;
}
#gameOverScreen h1 {
    font-size: 16px;
}
#gameOverScreen p {
    font-size: 12px;
}
`;

fs.writeFileSync('style.css', css);
