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
    "src/pages/nosotros.astro"
];

for (const suffix of allFiles) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // Remove max-w-lg, max-w-md from HTML
    content = content.replace(/\bmax-w-lg\b/g, '');
    content = content.replace(/\bmax-w-md\b/g, '');
    content = content.replace(/\bmax-angosto\b/g, ''); // Was used in some heroes

    // Remove mx-auto from container
    content = content.replace(/class="([^"]*?)\bcontainer\b([^"]*?)\bmx-auto\b([^"]*?)"/g, 'class="$1container$2$3"');
    content = content.replace(/class="([^"]*?)\bmx-auto\b([^"]*?)\bcontainer\b([^"]*?)"/g, 'class="$1$2container$3"');

    // And other broad mx-auto removals (e.g. wrapper in nosotros) that limit it visually, except buttons
    // The instructions say: "mx-auto (solo en contenedores de sección, no en botones ni elementos inline)"
    // The user wants to *eliminate* mx-auto when it's on section containers.
    content = content.replace(/class="([^"]*?)\bmx-auto\b([^"]*?)"/g, (match, prefix, suffix) => {
        // Exclude if it's on an anchor or button or text-like 
        if (prefix.includes('mx-auto') || suffix.includes('mx-auto')) return match;
        if (match.includes('btn') || match.includes('subtitulo') || match.includes('p-')) {
            return match;
        }
        return `class="${prefix}${suffix}"`;
    });

    // Clean multiple spaces
    content = content.replace(/class="\s+/g, 'class="').replace(/\s{2,}"/g, '"').replace(/class="([^"]*?)\s{2,}([^"]*?)"/g, 'class="$1 $2"');

    // ONLY REplace inside <style>
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        let styleContent = styleMatch[1];

        // Remove ANY max-width inside style, except for .subtitulo
        styleContent = styleContent.replace(/([^{]+)\{([^}]+)\}/g, (match, selector, rules) => {
            if (selector.includes('.subtitulo')) return match;
            if (selector.includes('.video-wrapper')) return match; // Need to keep this for Part 3!

            const newRules = rules.replace(/max-width:\s*[^;]+;/g, '');
            return `${selector}{${newRules}}`;
        });

        // Add or replace .seccion
        if (styleContent.includes('.seccion {') || styleContent.includes('.seccion\n{') || styleContent.includes('.seccion{')) {
            styleContent = styleContent.replace(/\.seccion\s*{[^}]+}/, `.seccion {\n        padding-block: clamp(3rem, 6vw, 10vw);\n        width: 100%;\n    }`);
        } else {
            styleContent += `\n    .seccion {\n        padding-block: clamp(3rem, 6vw, 10vw);\n        width: 100%;\n    }\n`;
        }

        // Grids
        styleContent = styleContent.replace(/\.grid-4\s*{[\s\S]*?}/, `.grid-4 {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(min(100%, 22vw), 1fr));\n        gap: clamp(1rem, 2vw, 3.5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-3\s*{[\s\S]*?}/, `.grid-3 {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(min(100%, 28vw), 1fr));\n        gap: clamp(1rem, 2vw, 3.5vw);\n    }`);
        styleContent = styleContent.replace(/\.grid-2\s*{[\s\S]*?}/, `.grid-2 {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(min(100%, 40vw), 1fr));\n        gap: clamp(1.5rem, 3vw, 5vw);\n    }`);

        // Custom grids like ventajas
        // advantages has 6 items usually in estetica? 
        styleContent = styleContent.replace(/\.grid-ventajas\s*{[\s\S]*?}/, `.grid-ventajas {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(min(100%, 20vw), 1fr));\n        gap: clamp(0.6rem, 1vw, 1.8vw);\n        padding: clamp(1.5rem, 3vw, 5vw);\n        border-radius: var(--radius-lg);\n        text-align: left;\n    }`);

        content = content.replace(/<style>[\s\S]*?<\/style>/, `<style>${styleContent}</style>`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Fixed CSS & HTML structure for: ${path.basename(suffix)}`);
}
