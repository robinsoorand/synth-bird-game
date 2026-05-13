const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// We need to fix the grayscale that is incorrectly applied to the body or the UI.
// The user wanted Level 0 to be monochrome, and the others to be colored.
// Let's remove the body grayscale entirely and do it in JS if needed, or check where it is.
css = css.replace(/filter: grayscale\(100%\);/g, '');

// Re-add grayscale only for locked options
css += `
.bird-option.locked, .level-option.locked {
    filter: grayscale(80%);
}
`;

fs.writeFileSync('style.css', css);
