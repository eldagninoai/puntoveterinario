import fs from 'fs';

const filePath = 'e:/adlibswebsites/puntoveterinario/src/pages/index.astro';
let content = fs.readFileSync(filePath, 'utf8');

// TIPOGRAFÍA
content = content.replace(/\.text-sm\s*{\s*font-size:\s*var\(--text-sm\);\s*}/, '.text-sm {\n    font-size: clamp(1rem, 2vw);\n  }');
content = content.replace(/\.text-md\s*{\s*font-size:\s*var\(--text-md\);\s*}/, '.text-md {\n    font-size: clamp(1.2rem, 2.8vw);\n  }');
content = content.replace(/\.text-lg\s*{\s*font-size:\s*var\(--text-lg\);\s*}/, '.text-lg {\n    font-size: clamp(1.5rem, 3.5vw);\n  }');
content = content.replace(/\.text-2xl\s*{\s*font-size:\s*var\(--text-2xl\);\s*}/, '.text-2xl {\n    font-size: clamp(2rem, 5vw);\n  }');
content = content.replace(/\.text-xl\s*{\s*font-size:\s*var\(--text-xl\);\s*}/, '.text-xl {\n    font-size: clamp(1.8rem, 4vw);\n  }'); // Although maybe not present

// ESPACIADO
content = content.replace(/\.gap-sm\s*{\s*gap:\s*var\(--space-sm\);\s*}/, '.gap-sm {\n    gap: clamp(0.5rem, 2vw);\n  }');
content = content.replace(/\.gap-md\s*{\s*gap:\s*var\(--space-md\);\s*}/, '.gap-md {\n    gap: clamp(1rem, 3vw);\n  }');
content = content.replace(/\.gap-lg\s*{\s*gap:\s*var\(--space-lg\);\s*}/, '.gap-lg {\n    gap: clamp(2rem, 5vw);\n  }');

content = content.replace(/\.mb-xl\s*{\s*margin-bottom:\s*var\(--space-xl\);\s*}/, '.mb-xl {\n    margin-bottom: clamp(2rem, 5vw);\n  }');
content = content.replace(/\.mb-lg\s*{\s*margin-bottom:\s*var\(--space-lg\);\s*}/, '.mb-lg {\n    margin-bottom: clamp(1.5rem, 4vw);\n  }');
content = content.replace(/\.mb-md\s*{\s*margin-bottom:\s*var\(--space-md\);\s*}/, '.mb-md {\n    margin-bottom: clamp(1rem, 3vw);\n  }');

content = content.replace(/\.py-xl\s*{\s*padding-block:\s*var\(--space-xl\);\s*}/, '.py-xl {\n    padding-block: clamp(3rem, 8vw);\n  }');
content = content.replace(/\.p-lg\s*{\s*padding:\s*var\(--space-lg\);\s*}/, '.p-lg {\n    padding: clamp(1.5rem, 4vw);\n  }');
content = content.replace(/\.px-lg\s*{\s*padding-inline:\s*var\(--space-lg\);\s*}/, '.px-lg {\n    padding-inline: clamp(1.5rem, 4vw);\n  }');

// HERO PLACEHOLDER
content = content.replace(/\.hero__placeholder \s*{\s*width: clamp\([^)]+\);\s*height: clamp\([^)]+\);/g, '.hero__placeholder {\n    width: clamp(15rem, 40vw);\n    height: clamp(15rem, 40vw);');
content = content.replace(/font-size: clamp\(6rem, 15vw, 10rem\);/g, 'font-size: clamp(6rem, 15vw);');

// EMOJIS
content = content.replace(/\.emoji-xl\s*{\s*font-size: clamp\([^)]+\);\s*}/g, '.emoji-xl {\n    font-size: clamp(2.5rem, 6vw);\n  }');

// BOTONES CTA (padding de botones)
content = content.replace(/padding:\s*var\(--space-sm\)\s*var\(--space-md\);/g, 'padding: clamp(0.6rem, 1.5vw) clamp(1.2rem, 3.5vw);\n    font-size: clamp(1rem, 2vw);'); // .cta__btn-wa and .btn-secondary

// GRID CARDS
content = content.replace(/grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 18rem\), 1fr\)\);/g, 'grid-template-columns: repeat(auto-fit, minmax(clamp(14rem, 25vw, 30vw), 1fr));'); // servicios
content = content.replace(/grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 15rem\), 1fr\)\);/g, 'grid-template-columns: repeat(auto-fit, minmax(clamp(12rem, 20vw, 25vw), 1fr));'); // por que
content = content.replace(/grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 16rem\), 1fr\)\);/g, 'grid-template-columns: repeat(auto-fit, minmax(clamp(14rem, 25vw, 30vw), 1fr));'); // resenas

// HERO INNER
content = content.replace(/grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 25rem\), 1fr\)\);/g, 'grid-template-columns: repeat(auto-fit, minmax(clamp(20rem, 35vw, 45vw), 1fr));');

content = content.replace(/\.hero__text h1\s*{\s*font-size: var\(--text-2xl\);/, '.hero__text h1 {\n    font-size: clamp(2rem, 5vw);');
content = content.replace(/\.hero__slogan\s*{\s*font-size: var\(--text-lg\);/, '.hero__slogan {\n    font-size: clamp(1.3rem, 3vw);');
content = content.replace(/\.hero__desc\s*{\s*font-size: var\(--text-md\);/, '.hero__desc {\n    font-size: clamp(1rem, 2.2vw);');

// Imagen original (en index.astro ya se agregó la imagen)
content = content.replace(/height: clamp\(18rem, 40vw, 32rem\);/g, 'height: clamp(18rem, 40vw);');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done CSS replacements in index.astro');
