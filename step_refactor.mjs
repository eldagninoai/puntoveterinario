import fs from 'fs';
import path from 'path';

const basePath = "e:/adlibswebsites/puntoveterinario";
const allFiles = [
    "src/pages/servicios/consulta-veterinaria.astro",
    "src/pages/servicios/esterilizacion.astro",
    "src/pages/servicios/cirugia-veterinaria.astro",
    "src/pages/servicios/laboratorio-clinico.astro",
    "src/pages/servicios/alimento-mascotas.astro",
    "src/pages/servicios/estetica-canina.astro",
    "src/pages/ubicacion.astro",
    "src/pages/contacto.astro",
    "src/pages/blog.astro",
    "src/pages/nosotros.astro",
    "src/components/Footer.astro",
    "src/components/Header.astro"
];

const mobileMediaQs = `
    @media (max-width: 48rem) {
        [class*="grid-"] {
            grid-template-columns: repeat(2, 1fr) !important;
        }
    }
    @media (max-width: 30rem) {
        [class*="grid-"] {
            grid-template-columns: 1fr !important;
        }
    }
`;

for (const suffix of allFiles) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // Only process styles if the file has <style>
    const styleMatch = content.match(/<style(?:[^>]*)>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        let styleContent = styleMatch[1];

        // Find existing media queries added previous or replace
        // Try to remove previous mobile media queries if we injected them, so we don't duplicate
        styleContent = styleContent.replace(/@media \(max-width: 48rem\)\s*{\s*\[class\*\="grid-"\]\s*{[^}]*}\s*}/g, '');
        styleContent = styleContent.replace(/@media \(max-width: 30rem\)\s*{\s*\[class\*\="grid-"\]\s*{[^}]*}\s*}/g, '');

        // 6 items (often .grid-ventajas or .grid-4 depending on the context if we changed it, 
        // user says "Para grids de 6 items: grid-template-columns: repeat(4, 1fr);")
        styleContent = styleContent.replace(/\.grid-ventajas\s*{[\s\S]*?}/, `.grid-ventajas {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: clamp(0.6rem, 1vw, 1.8vw);\n        padding: clamp(1.5rem, 3vw, 5vw);\n        border-radius: var(--radius-lg);\n        text-align: left;\n    }`);

        styleContent = styleContent.replace(/\.grid-4\s*{[\s\S]*?}/, `.grid-4 {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: clamp(1rem, 2vw, 3.5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-3\s*{[\s\S]*?}/, `.grid-3 {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: clamp(1rem, 2vw, 3.5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-2\s*{[\s\S]*?}/, `.grid-2 {\n        display: grid;\n        grid-template-columns: repeat(2, 1fr);\n        gap: clamp(1.5rem, 3vw, 5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-resenas\s*{[\s\S]*?}/, `.grid-resenas {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: clamp(1.5rem, 3vw, 5vw);\n    }`);

        // Append the mobile media queries before </style>
        styleContent += mobileMediaQs;

        content = content.replace(/<style(?:[^>]*)>[\s\S]*?<\/style>/, `<style>\n${styleContent}</style>`);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ CSS Grids refactored in: ${path.basename(suffix)}`);
    } else {
        // Handle files without <style> if they need it? The user said "Y agregar este @media en el <style> de CADA archivo".
        // Header doesn't have grids structurally (it's flex usually), let's append <style> if missing just in case they have grid classes in HTML.
        if (content.match(/class="[^"]*grid-[^"]*"/)) {
            content += `\n<style>\n${mobileMediaQs}</style>\n`;
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Appended <style> to: ${path.basename(suffix)}`);
        }
    }
}

// global.css updates
const globalCSS = path.join(basePath, "src/styles/global.css");
if (fs.existsSync(globalCSS)) {
    let globalContent = fs.readFileSync(globalCSS, 'utf8');

    // Remove old `.grid-X` blocks
    globalContent = globalContent.replace(/\.grid-[234]\s*{[\s\S]*?}/g, '');

    // Remove old `@media` blocks referencing `.grid-X`
    globalContent = globalContent.replace(/@media\s*\([^)]+\)\s*{\s*\.grid-[^{]+{[^}]+}\s*}/g, '');

    // Inject the exact payload
    const injection = `
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1rem, 2vw, 3.5vw);
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1rem, 2vw, 3.5vw);
}
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(1rem, 2vw, 3.5vw);
}

@media (max-width: 48rem) {
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 30rem) {
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
}
`;
    // Find the end to append
    globalContent += injection;
    fs.writeFileSync(globalCSS, globalContent, 'utf8');
    console.log("✅ global.css updated");
}
