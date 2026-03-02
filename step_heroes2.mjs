import fs from 'fs';
import path from 'path';

const files = [
    "src/pages/servicios/consulta-veterinaria.astro",
    "src/pages/servicios/esterilizacion.astro",
    "src/pages/servicios/cirugia-veterinaria.astro",
    "src/pages/servicios/laboratorio-clinico.astro",
    "src/pages/servicios/alimento-mascotas.astro"
];

const basePath = "e:/adlibswebsites/puntoveterinario";

for (const suffix of files) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // Quitar text-center del hero si quedó
    content = content.replace(/<section class="hero-nosotros ([^"]*)text-center([^"]*)">/g, '<section class="hero-nosotros $1$2">');
    // Ajuste general porque el script previo hizo replace 
    // <section class="hero-nosotros bg-white py-xl"> ... <div class="container hero-inner"> lo cual ya esta bien,
    // pero me aseguro que no haya text-center residual.
    content = content.replace(/class="hero-nosotros bg-white py-xl text-center"/g, 'class="hero-nosotros bg-white py-xl"');

    // Remove max-w-lg residual in the container just in case
    content = content.replace(/<div class="container text-center max-w-lg mx-auto hero-inner">/g, '<div class="container hero-inner">');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${path.basename(suffix)}`);
}
