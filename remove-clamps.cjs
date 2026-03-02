const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.astro') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Eradicate clamp(min, vw, max) and replace with max(min, vw)
            content = content.replace(/clamp\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, 'max($1, $2)');

            // Destroy any static max-width
            content = content.replace(/max-width:\s*\d+(\.\d+)?(px|rem|ch)[^;]*;?/g, '');

            // Remove any max-width constraints on paragraphs
            content = content.replace(/max-width:\s*70ch;?/g, '');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Processed VW Vector Scaling:', fullPath);
            }
        }
    }
}

processDir('src');
