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

for (const suffix of allFiles) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // Make sure we have the exact mobile media queries in <style>
    const styleMatch = content.match(/<style(?:[^>]*)>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        let styleContent = styleMatch[1];

        // Remove old auto-fit declarations just in case they survived the first script
        styleContent = styleContent.replace(/grid-template-columns:\s*repeat\(auto-fit,\s*minmax\([^,]+,\s*1fr\)\);/g, '');
        // Replace known custom grid-4s and 6s
        styleContent = styleContent.replace(/\.grid-4\s*{[\s\S]*?}/, `.grid-4 {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: clamp(1rem, 2vw, 3.5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-3\s*{[\s\S]*?}/, `.grid-3 {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: clamp(1rem, 2vw, 3.5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-2\s*{[\s\S]*?}/, `.grid-2 {\n        display: grid;\n        grid-template-columns: repeat(2, 1fr);\n        gap: clamp(1.5rem, 3vw, 5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-ventajas\s*{[\s\S]*?}/, `.grid-ventajas {\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);\n        gap: clamp(0.6rem, 1vw, 1.8vw);\n        padding: clamp(1.5rem, 3vw, 5vw);\n        border-radius: var(--radius-lg);\n        text-align: left;\n    }`);

        // Check for media query if missing 
        if (!styleContent.includes('@media (max-width: 48rem)')) {
            styleContent += `\n    @media (max-width: 48rem) {\n        [class*="grid-"] {\n            grid-template-columns: repeat(2, 1fr) !important;\n        }\n    }\n    @media (max-width: 30rem) {\n        [class*="grid-"] {\n            grid-template-columns: 1fr !important;\n        }\n    }\n`;
        }

        // Apply
        content = content.replace(/<style(?:[^>]*)>([\s\S]*?)<\/style>/, `<style>\n${styleContent}</style>`);
        fs.writeFileSync(file, content, 'utf8');
    }
}

// Global CSS fix
const globalCSS = path.join(basePath, "src/styles/global.css");
if (fs.existsSync(globalCSS)) {
    let globalContent = fs.readFileSync(globalCSS, 'utf8');

    // Clean duplicates if added previously
    globalContent = globalContent.replace(/\.grid-2\s*{[\s\S]*/, '');

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
    globalContent += injection;
    fs.writeFileSync(globalCSS, globalContent, 'utf8');
}
console.log("✅ Final grids check completed");
