import fs from 'fs';
import path from 'path';

const basePath = "e:/adlibswebsites/puntoveterinario";

const heroCentradoCSS = `
    /* ===== HERO CENTRADO ===== */
    .hero-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: clamp(1rem, 2vw, 3vw);
        width: 100%;
    }
    .titulo-principal {
        font-size: clamp(1.8rem, 3.2vw, 5.5vw);
        color: var(--color-primary-dark);
        line-height: 1.15;
        margin: 0;
    }
    .subtitulo {
        font-size: clamp(0.95rem, 1.4vw, 2.5vw);
        color: var(--color-text-soft);
        line-height: 1.6;
        margin: 0 auto;
        max-width: 75ch;
        text-align: center;
    }
    .botones {
        display: flex;
        flex-wrap: wrap;
        gap: clamp(0.8rem, 1.5vw, 2.5vw);
        justify-content: center;
    }
`;

// Part 1: Apply HTML structure to esterilizacion.astro and ubicacion.astro
const filesToStructure = [
    "src/pages/servicios/esterilizacion.astro",
    "src/pages/ubicacion.astro"
];

for (const suffix of filesToStructure) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // Fix section & container
    content = content.replace(/<section class="(?:seccion bg-white|hero bg-white pt-xl pb-lg)[^"]*">/, '<section class="seccion fondo-blanco">');
    content = content.replace(/<div class="(?:container centrado max-angosto|container text-center max-w-lg mx-auto)">/, '<div class="container hero-inner">');

    // Fix H1
    content = content.replace(/<h1 class="[^"]*">/, '<h1 class="titulo-principal">');

    // Fix Subtitle (the very next P tag after H1)
    content = content.replace(/(<h1 class="titulo-principal">[\s\S]*?<\/h1>\s*)<p class="[^"]*">/, '$1<p class="subtitulo">');

    // Fix botones wrapper if it exists as <div class="botones"> already or something else
    // If it's esterilizacion.astro it might already be <div class="botones">
    // If it's ubicacion.astro it is just an <a> tag without wrapper.
    if (suffix.includes('ubicacion.astro')) {
        content = content.replace(/(<a[\s\S]*?💬 Contactar por WhatsApp\s*<\/a>)/, '<div class="botones">\n            $1\n        </div>');
    }

    // Inject logic for Part 2 is handled below, but we need to remove the injected CSS if we already injected it in esterilizacion
    content = content.replace(/\/\* ===== HERO — ocupa todo el ancho ===== \*\/[\s\S]*?(?=\/\* ===== SECCIONES|$)/, '');

    fs.writeFileSync(file, content, 'utf8');
}


// Part 2: Adjust CSS in ALL 9 files
const allFiles = [
    "src/pages/servicios/consulta-veterinaria.astro",
    "src/pages/servicios/esterilizacion.astro",
    "src/pages/servicios/cirugia-veterinaria.astro",
    "src/pages/servicios/laboratorio-clinico.astro",
    "src/pages/servicios/alimento-mascotas.astro",
    "src/pages/servicios/estetica-canina.astro",
    "src/pages/ubicacion.astro",
    "src/pages/contacto.astro",
    "src/pages/blog.astro"
];

for (const suffix of allFiles) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // Remove existing hero CSS block to avoid duplicates (the left-aligned one)
    // We'll look for specific properties like "align-items: flex-start;"
    // Also estetica-canina might have different CSS slightly.

    // 1. Remove old left-aligned `.hero-inner` block completely
    content = content.replace(/\.hero-inner\s*{[\s\S]*?width:\s*100%;[\s\S]*?}/, '');
    content = content.replace(/\.titulo-principal\s*{[\s\S]*?margin:\s*0;[\s\S]*?}/g, '');
    content = content.replace(/\.subtitulo\s*{[\s\S]*?max-width:\s*75ch;[\s\S]*?}/g, '');
    content = content.replace(/\.botones\s*{[\s\S]*?gap:.*?}[\s\S]*?(?=\.)/, ''); // Try to catch botons if there's no ending properly
    content = content.replace(/\/\* ===== HERO.*?==== \*\//g, '');

    // Make sure we wipe old classes inside estetica-canina that matched
    content = content.replace(/\.botones\s*{[\s\S]*?}/g, '');

    // Wait, the regexes above might be too destructive. Let's just do a string replacement of the exact CSS chunks injected before.
    const oldCss1 = `
    /* ===== HERO — ocupa todo el ancho ===== */
    .hero-inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: clamp(1rem, 2vw, 3vw);
        width: 100%;
    }
    .titulo-principal {
        font-size: clamp(1.8rem, 3.2vw, 5.5vw);
        color: var(--color-primary-dark);
        line-height: 1.15;
        margin: 0;
    }
    .subtitulo {
        font-size: clamp(0.95rem, 1.4vw, 2.5vw);
        color: var(--color-text-soft);
        line-height: 1.6;
        margin: 0;
        max-width: 75ch;
    }
`;
    content = content.replace(oldCss1.trim(), '');
    content = content.replace("/* ===== HERO — ocupa todo el ancho ===== */", "");

    // For estetica canina which has:
    /*
      .hero-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(1rem, 2vw, 3vw);
          width: 100%;
      }
    */
    content = content.replace(/\.hero-inner {\s*display: flex;\s*flex-direction: column;\s*align-items: flex-start;\s*gap: [^;]+;\s*width: 100%;\s*}/, '');
    content = content.replace(/\.titulo-principal {\s*font-size: [^;]+;\s*color: var\(--color-primary-dark\);\s*line-height: 1\.15;\s*margin: 0;\s*}/, '');
    content = content.replace(/\.subtitulo {\s*font-size: [^;]+;\s*color: var\(--color-text-soft\);\s*line-height: 1\.6;\s*margin: 0;\s*max-width: 75ch;\s*}/, '');
    content = content.replace(/\.botones {\s*display: flex;\s*flex-wrap: wrap;\s*gap: [^;]+;\s*(?:justify-content: center;\s*)?}/, '');

    // Also remove redundant title-principal if it exists twice
    content = content.replace(/\.titulo-principal {\s*font-size: clamp[^;]+;\s*color: var\(--color-primary-dark\);\s*line-height: 1.2;\s*margin-bottom: clamp[^;]+;\s*}/g, '');

    // Find the exact place to inject the new CSS block
    if (!content.includes('.hero-inner {')) {
        content = content.replace(/<style>/, '<style>\n' + heroCentradoCSS);
    } else {
        // If we missed something and it's still there, force replace its content:
        content = content.replace(/\.hero-inner {\s*[^}]+}/, '.hero-inner {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        text-align: center;\n        gap: clamp(1rem, 2vw, 3vw);\n        width: 100%;\n    }');
        content = content.replace(/\.subtitulo {\s*[^}]+}/, '.subtitulo {\n        font-size: clamp(0.95rem, 1.4vw, 2.5vw);\n        color: var(--color-text-soft);\n        line-height: 1.6;\n        margin: 0 auto;\n        max-width: 75ch;\n        text-align: center;\n    }');

        // add botones center
        if (!content.includes('.botones {')) {
            content = content.replace(/<\/style>/, `    .botones {
        display: flex;
        flex-wrap: wrap;
        gap: clamp(0.8rem, 1.5vw, 2.5vw);
        justify-content: center;
    }\n</style>`);
        } else {
            content = content.replace(/\.botones {\s*[^}]+}/, '.botones {\n        display: flex;\n        flex-wrap: wrap;\n        gap: clamp(0.8rem, 1.5vw, 2.5vw);\n        justify-content: center;\n    }');
        }
    }

    // Lastly, contact.astro and blog.astro probably didn't have the HTML structure yet?
    // Let's ensure the HTML logic for contacto and blog is also set.
    if (suffix.includes('contacto.astro') || suffix.includes('blog.astro')) {
        // Reemplazar la section y el container classes:
        content = content.replace(/<section class="[^"]*hero[^"]*">/, '<section class="seccion fondo-blanco">');
        content = content.replace(/<div class="container[^"]*">/, '<div class="container hero-inner">');

        // Reemplazar H1
        content = content.replace(/<h1 class="[^"]*">/, '<h1 class="titulo-principal">');

        // Reemplazar P
        content = content.replace(/(<h1 class="titulo-principal">[\s\S]*?<\/h1>\s*)<p class="[^"]*">/, '$1<p class="subtitulo">');

        // We don't have botones usually in blog or contacto hero, but if we do, wrap them? Not strictly needed for UI if no buttons
    }

    // Ensure 'seccion fondo-blanco' on others
    content = content.replace(/<section class="hero-nosotros bg-white py-xl">/g, '<section class="seccion fondo-blanco">');
    content = content.replace(/<section class="hero bg-white py-xl">/g, '<section class="seccion fondo-blanco">');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${path.basename(suffix)}`);
}
