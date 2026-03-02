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

const heroCss = `
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

for (const suffix of files) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // 1. Modificar HTML del Hero
    // Vamos a buscar el bloque del hero y reemplazar las clases:
    // <section class="hero bg-white py-xl"> ... </section>
    // o <div class="container text-center max-w-lg mx-auto">

    // Reemplazar la section y el container classes:
    content = content.replace(/<section class="[^"]*hero[^"]*">/g, '<section class="seccion fondo-blanco">');
    content = content.replace(/<div class="container[^"]*">/, '<div class="container hero-inner">');

    // Reemplazar H1
    // Ej: <h1 class="text-2xl text-primary-dark mb-md lh-1"> ... </h1>
    content = content.replace(/<h1 class="[^"]*">([^<]+)<\/h1>/g, '<h1 class="titulo-principal">$1</h1>');

    // Reemplazar el parrafo subtitulo
    // Ej: <p class="text-lg text-soft mb-lg lh-relaxed"> ... </p>
    content = content.replace(/<p class="text-lg text-soft[^"]*">([\s\S]*?)<\/p>/, '<p class="subtitulo">$1</p>');

    // Reemplazar la seccion de botones del hero
    // <div class="flex flex-wrap justify-center gap-md"> -> <div class="botones">
    content = content.replace(/<div class="flex flex-wrap justify-center gap-md">/, '<div class="botones">');

    // Acomodar las clases de los botones si es necesario, 
    // Ej: <a class="btn-primary text-md px-lg py-sm fw-bold border-radius transition-transform inline-block"> -> <a class="btn-primario">
    // Dado que el css es diferente, vamos a confiar en que .botones los acomodará pero necesitamos 
    // los estilos del btn si es que no están en style de estas pags.
    // Es mejor simplemente reemplazar solo el container para alinear a izq, pero ya modificamos H1 y p con titulo-principal/subtitulo
    // Asi que los botones pueden quedarse con sus clases inline-block, simplemente dejamos el <div class="flex flex-wrap gap-md"> quitando el justify-center

    // OJO! Hice un replace de <div class="flex flex-wrap justify-center" por "botones"...
    // pero "botones" en estetica-canina tiene CSS especifico. Si no se copió el CSS, se romperá.
    // Vamos mejor a hacer REPLACE ONLY del container y dejar las clases de astros.
    content = originalContent; // Reset

    // A) Hero wrapper and container
    // Buscamos: <section class="hero ...">
    content = content.replace(/<section class="hero[^"]*">/, '<section class="hero-nosotros bg-white py-xl">');

    // Buscamos el div container dentro de ese primer section (buscando el primer container text-center max-w-lg mx-auto)
    // Reemplazaremos SOLO su class
    content = content.replace(/<div class="container text-center max-w-lg mx-auto">/, '<div class="container hero-inner">');
    content = content.replace(/<div class="container text-center max-w-md mx-auto">/, '<div class="container hero-inner">');
    content = content.replace(/<div class="container text-center mx-auto[^"]*">/, '<div class="container hero-inner">');

    // B) H1 -> clase titulo-principal (reemplazar la clase del PRIMER h1)
    content = content.replace(/<h1 class="[^"]*">/, '<h1 class="titulo-principal">');

    // C) P -> clase subtitulo (reemplazar la clase del PRIMER p o el que contenga texto fuerte)
    // El parrafo es el texto intro. Sigue inmediatamente despues de <h1 class="titulo-principal"> texto </h1>
    content = content.replace(/(<h1 class="titulo-principal">[\s\S]*?<\/h1>\s*)<p class="[^"]*">/, '$1<p class="subtitulo">');

    // D) Botones -> quitar el flex y justify-center si los hay en el grid de botones justo debajo.
    // Ej: <div class="flex flex-wrap justify-center gap-md">
    content = content.replace(/<div class="flex flex-wrap justify-center gap-md">/, '<div class="flex flex-wrap gap-md">');

    // E) Inyectar CSS en el <style>
    // Vamos a buscar el <style> y pegarle al inicio el nuevo bloque
    content = content.replace(/<style>/, '<style>\n' + heroCss);

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${path.basename(suffix)}`);
}
