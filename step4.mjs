import fs from 'fs';
import path from 'path';

const basePath = "e:/adlibswebsites/puntoveterinario";
const oldFile = path.join(basePath, "src/pages/servicios/estetica-canina-felina.astro");
const newFile = path.join(basePath, "src/pages/servicios/estetica-canina.astro");

if (!fs.existsSync(oldFile)) {
    console.log("Old file not found, maybe already renamed?");
} else {
    let content = fs.readFileSync(oldFile, 'utf8');

    // 1. Schema
    content = content.replace(
        /name:\s*"Estética Canina y Felina en Coyoacán"/g,
        'name: "Estética Canina en Coyoacán"'
    );
    content = content.replace(
        /url:\s*"https:\/\/puntoveterinario\.com\/servicios\/estetica-canina-felina"/g,
        'url: "https://puntoveterinario.com/servicios/estetica-canina"'
    );
    content = content.replace(
        /description:\s*"Servicio de estética canina y felina en Coyoacán CDMX[^"]+"/g,
        'description:\n        "Estética canina profesional en Coyoacán. Baño, corte y cuidado para tu perro. Av. División del Norte 3595, San Pablo Tepetlapa, CP 04620."'
    );

    // 2. BaseLayout
    content = content.replace(
        /title="Estética Canina y Felina Coyoacán \| Punto Veterinario"/g,
        'title="Estética Canina Coyoacán | Baño y Corte para Perros"'
    );
    content = content.replace(
        /description="Estética canina y felina profesional en Coyoacán[^"]+"/g,
        'description="Estética canina profesional en Coyoacán. Baño, corte y cuidado para tu perro. Av. División del Norte 3595, San Pablo Tepetlapa, CP 04620."'
    );

    // 3. H1
    content = content.replace(
        /Estética Canina y Felina en Coyoacán, CDMX \| Punto Veterinario/g,
        'Estética Canina en Coyoacán, CDMX | Punto Veterinario'
    );

    // 4. FAQ: Remove the cat question entirely
    // Find the object containing "¿Hacen estética para gatos en Coyoacán?"
    content = content.replace(/\{\s*"@type":\s*"Question",\s*name:\s*"¿Hacen estética para gatos en Coyoacán\?"[\s\S]*?\},/g, "");

    // 5. General text replacements
    content = content.replace(/estética canina y felina/gi, "estética canina");
    content = content.replace(/Estética canina y felina/g, "Estética canina");
    content = content.replace(/perros y gatos/gi, "perros");
    content = content.replace(/perro o gato/gi, "perro");
    content = content.replace(/perruno o felino/gi, "perruno");
    content = content.replace(/canina y felina/gi, "canina");
    content = content.replace(/ y gatos/gi, "");
    content = content.replace(/ o gatos/gi, "");
    content = content.replace(/ o gato/gi, "");
    content = content.replace(/ o felina/gi, "");
    content = content.replace(/ y felina/gi, "");

    // Specific sentences from the text:
    // "tanto a distinguidos perros como a los impecables y sublimes mininos de cualquier hogar"
    content = content.replace(
        /tanto a distinguidos perros como a los impecables y sublimes mininos de cualquier hogar/g,
        "a distinguidos perros de cualquier hogar"
    );

    // "estética felina. Nuestro dedicado personal..." in case any other reference exists
    content = content.replace(/o sofisticada vertiente felina /g, "");
    content = content.replace(/y gatuno/g, "");

    fs.writeFileSync(newFile, content, 'utf8');
    fs.unlinkSync(oldFile);
    console.log("✅ Renamed and updated estetica-canina.astro");
}

// Update Header.astro
const headerPath = path.join(basePath, "src/components/Header.astro");
if (fs.existsSync(headerPath)) {
    let header = fs.readFileSync(headerPath, 'utf8');
    header = header.replace(/\/servicios\/estetica-canina-felina/g, "/servicios/estetica-canina");
    header = header.replace(/label:\s*"Estética Canina y Felina"/g, 'label: "Estética Canina"');
    header = header.replace(/label:\s*"Estética"/g, 'label: "Estética Canina"');
    fs.writeFileSync(headerPath, header, 'utf8');
    console.log("✅ Updated Header.astro");
}

// Update Footer.astro
const footerPath = path.join(basePath, "src/components/Footer.astro");
if (fs.existsSync(footerPath)) {
    let footer = fs.readFileSync(footerPath, 'utf8');
    footer = footer.replace(/\/servicios\/estetica-canina-felina/g, "/servicios/estetica-canina");
    footer = footer.replace(/"Estética Canina y Felina"/g, '"Estética Canina"');
    fs.writeFileSync(footerPath, footer, 'utf8');
    console.log("✅ Updated Footer.astro");
}

// Update index.astro
const indexPath = path.join(basePath, "src/pages/index.astro");
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(/\/servicios\/estetica-canina-felina/g, "/servicios/estetica-canina");
    indexContent = indexContent.replace(/"Estética Canina y Felina"/g, '"Estética Canina"');
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log("✅ Updated index.astro");
}

// Update all other services files
const serviciosDir = path.join(basePath, "src/pages/servicios");
const files = fs.readdirSync(serviciosDir);
for (const file of files) {
    if (file.endsWith(".astro")) {
        const filePath = path.join(serviciosDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes("/servicios/estetica-canina-felina")) {
            content = content.replace(/\/servicios\/estetica-canina-felina/g, "/servicios/estetica-canina");
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated links in ${file}`);
        }
    }
}

// Update Netlify redirects
const netlifyPath = path.join(basePath, "netlify.toml");
const redirectBlock = `
[[redirects]]
from = "/servicios/estetica-canina-felina"
to = "/servicios/estetica-canina"
status = 301
`;

if (fs.existsSync(netlifyPath)) {
    let toml = fs.readFileSync(netlifyPath, 'utf8');
    if (!toml.includes("/servicios/estetica-canina-felina")) {
        fs.appendFileSync(netlifyPath, "\n" + redirectBlock);
        console.log("✅ Appended to netlify.toml");
    }
} else {
    fs.writeFileSync(netlifyPath, redirectBlock.trim() + "\n", 'utf8');
    console.log("✅ Created netlify.toml");
}
