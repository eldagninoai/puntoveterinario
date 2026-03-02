import fs from 'fs';
import path from 'path';

const basePath = "e:/adlibswebsites/puntoveterinario";

// 1. BASELAYOUT
const baseLayoutPath = path.join(basePath, "src/layouts/BaseLayout.astro");
if (fs.existsSync(baseLayoutPath)) {
    let content = fs.readFileSync(baseLayoutPath, 'utf8');
    if (!content.includes('<slot name="head" />')) {
        content = content.replace(/<\/head>/, '    <slot name="head" />\n  </head>');
        fs.writeFileSync(baseLayoutPath, content, 'utf8');
    }
}

// 2. INDEX.ASTRO (Video preload="none" + slot preload link + eager loading on hero img if any)
const indexAstroPath = path.join(basePath, "src/pages/index.astro");
if (fs.existsSync(indexAstroPath)) {
    let content = fs.readFileSync(indexAstroPath, 'utf8');

    // add <slot name="head">...
    if (!content.includes('as="video"')) {
        const preLink = `>\n  <Fragment slot="head">\n    <link rel="preload" as="video" href="/videos/veterinaria-coyoacan.mp4" type="video/mp4" />\n  </Fragment>\n`;
        content = content.replace(/>\n\s*<!-- 1\. HERO -->/, preLink + `\n  <!-- 1. HERO -->`);
    }

    // add preload="none" to video
    if (content.includes('<video') && !content.includes('preload="none"')) {
        content = content.replace(/<video([\s\S]*?)playsinline([\s\S]*?)>/, '<video$1playsinline preload="none"$2>');
    }

    fs.writeFileSync(indexAstroPath, content, 'utf8');
}

// 3. NOSOTROS.ASTRO (Video preload="none")
const nosotrosPath = path.join(basePath, "src/pages/nosotros.astro");
if (fs.existsSync(nosotrosPath)) {
    let content = fs.readFileSync(nosotrosPath, 'utf8');
    if (content.includes('<video') && !content.includes('preload="none"')) {
        content = content.replace(/<video([\s\S]*?)playsinline([\s\S]*?)>/, '<video$1playsinline preload="none"$2>');
    }
    fs.writeFileSync(nosotrosPath, content, 'utf8');
}

// 4. BULK LAZY LOADING ON IMAGES
const pagesToLazy = [
    "src/pages/index.astro",
    "src/pages/nosotros.astro",
    "src/pages/ubicacion.astro",
    "src/pages/contacto.astro",
    "src/pages/blog.astro",
    "src/pages/servicios/consulta-veterinaria.astro",
    "src/pages/servicios/esterilizacion.astro",
    "src/pages/servicios/cirugia-veterinaria.astro",
    "src/pages/servicios/laboratorio-clinico.astro",
    "src/pages/servicios/alimento-mascotas.astro",
    "src/pages/servicios/estetica-canina.astro"
];

for (const suffix of pagesToLazy) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // We replace all <img ... > adding loading="lazy" decoding="async" IF it doesn't have loading= already
    // Except we do negative lookahead for loading=
    // Actually simpler: 
    // split by <img and check for "loading=".
    let parts = content.split('<img ');
    let newContent = parts[0];
    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        if (part.includes('loading=')) {
            newContent += '<img ' + part;
        } else {
            newContent += '<img loading="lazy" decoding="async" ' + part;
        }
    }

    // Force eager processing on the "hero__img" or "nosotros__img" if somehow they are not loading="eager"
    // The prompt says "Las imágenes del hero deben tener: loading="eager" fetchpriority="high" decoding="async"".
    // We already know those sections are at the top, typically the first image in specific pages.
    // In index, the video is hero. In nosotros, there is a hero svg.
    newContent = newContent.replace(/<img loading="lazy" decoding="async"([\s\S]*?class="nosotros__img"[\s\S]*?)>/, '<img loading="eager" fetchpriority="high" decoding="async"$1>');
    // Same just in case for hero__img (servicios, ubicacion, blog, etc typically have it)
    newContent = newContent.replace(/<img loading="lazy" decoding="async"([\s\S]*?class="hero__img"[\s\S]*?)>/g, '<img loading="eager" fetchpriority="high" decoding="async"$1>');

    fs.writeFileSync(file, newContent, 'utf8');
}

console.log("✅ Performance script injected successfully");
