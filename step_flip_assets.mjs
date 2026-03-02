import fs from 'fs';
import path from 'path';

const basePath = "e:/adlibswebsites/puntoveterinario";

// ============================================
// 1. INDEX.ASTRO
// ============================================

const indexAstroPath = path.join(basePath, "src/pages/index.astro");
if (fs.existsSync(indexAstroPath)) {
    let content = fs.readFileSync(indexAstroPath, 'utf8');

    // Replace the figure with the video wrapper
    const videoMarkup = `
            <div class="hero__video">
                <div class="video-wrapper">
                    <video
                        autoplay
                        muted
                        loop
                        playsinline
                        class="hero__video-el"
                        id="video-hero"
                        aria-label="Video de la clínica veterinaria Punto Veterinario en Coyoacán, San Pablo Tepetlapa CP 04620"
                        title="Punto Veterinario — Veterinaria en Coyoacán CDMX"
                    >
                        <source src="/videos/veterinaria-coyoacan.mp4" type="video/mp4" />
                        <source src="/videos/veterinaria-coyoacan.mov" type="video/quicktime" />
                    </video>
                    <button class="btn-sonido" id="btn-sonido-hero" aria-label="Activar sonido del video">
                        🔇
                    </button>
                </div>
            </div>`;

    // There was a figure hero__figure
    content = content.replace(/<figure class="hero__figure">[\s\S]*?<\/figure>/, videoMarkup.trim());

    // Also, inject script.
    const scriptInjection = `
<script is:inline>
    const videoHero = document.getElementById('video-hero');
    const btnHero = document.getElementById('btn-sonido-hero');
    btnHero?.addEventListener('click', () => {
        if (videoHero.muted) {
            videoHero.muted = false;
            btnHero.textContent = '🔊';
            btnHero.setAttribute('aria-label', 'Silenciar video');
        } else {
            videoHero.muted = true;
            btnHero.textContent = '🔇';
            btnHero.setAttribute('aria-label', 'Activar sonido del video');
        }
    });
</script>

<style>`;
    content = content.replace(/<style>/, scriptInjection);

    // Inject CSS
    const cssInjection = `
    /* ===== HERO VIDEO ===== */
    .video-wrapper {
        position: relative;
        width: 100%;
    }
    .hero__video-el {
        width: 100%;
        height: clamp(16rem, 35vw, 55vw);
        object-fit: cover;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        display: block;
    }
    .btn-sonido {
        position: absolute;
        bottom: clamp(0.5rem, 1vw, 1.5vw);
        right: clamp(0.5rem, 1vw, 1.5vw);
        background: rgba(0,0,0,0.55);
        color: #fff;
        border: none;
        border-radius: 50%;
        width: clamp(2rem, 3vw, 4rem);
        height: clamp(2rem, 3vw, 4rem);
        font-size: clamp(0.9rem, 1.5vw, 2vw);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.2s;
        backdrop-filter: blur(4px);
    }
    .btn-sonido:hover {
        background: rgba(0,0,0,0.75);
        transform: scale(1.1);
    }
`;
    content = content.replace(/<style>/, `<style>\n${cssInjection}`);

    // Remove old `.hero__figure` css if present
    content = content.replace(/\.hero__figure\s*{[\s\S]*?}/g, '');
    content = content.replace(/\.hero__img\s*{[\s\S]*?}/g, '');

    fs.writeFileSync(indexAstroPath, content, 'utf8');
}


// ============================================
// 2. NOSOTROS.ASTRO
// ============================================

const nosotrosPath = path.join(basePath, "src/pages/nosotros.astro");
if (fs.existsSync(nosotrosPath)) {
    let content = fs.readFileSync(nosotrosPath, 'utf8');

    // Replace <div class="video-wrapper"> block with the new figure snippet
    const figureMarkup = `
            <figure class="nosotros__figure">
                <img
                    src="/images/veterinaria-coyoacan-punto-veterinario.svg"
                    alt="Veterinaria Punto Veterinario en Coyoacán, San Pablo Tepetlapa — atención médica para perros"
                    title="Punto Veterinario — Clínica Veterinaria en Coyoacán, CDMX"
                    class="nosotros__img"
                    width="800"
                    height="600"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                />
                <figcaption class="visually-hidden">
                    Clínica veterinaria Punto Veterinario en 
                    Av. División del Norte 3595, San Pablo Tepetlapa, 
                    CP 04620, Coyoacán, CDMX
                </figcaption>
            </figure>`;

    content = content.replace(/<div class="video-wrapper">[\s\S]*?<\/div>/, figureMarkup.trim());

    // Remove old script block for btn-sonido
    content = content.replace(/<script is:inline>[\s\S]*?<\/script>/, '');

    // Replace the injected CSS for video-wrapper with CSS for nosotros__figure
    const svgCss = `
    .nosotros__figure { margin: 0; width: 100%; }
    .nosotros__img {
        width: 100%;
        height: clamp(16rem, 35vw, 55vw);
        object-fit: contain;
        border-radius: var(--radius-lg);
    }
    .visually-hidden {
        position: absolute;
        width: 1px; height: 1px;
        padding: 0; margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        border: 0;
    }`;

    // Re-structure style tag slightly to replace the video wrapper CSS
    content = content.replace(/\/\*\s*=====\s*VIDEO WRAPPER[^\*]*\*\/\s*\.video-wrapper[\s\S]*?@media[^}]+}/, svgCss);

    fs.writeFileSync(nosotrosPath, content, 'utf8');
}


// ============================================
// 3. UBICACION.ASTRO
// ============================================

const ubicacionPath = path.join(basePath, "src/pages/ubicacion.astro");
if (fs.existsSync(ubicacionPath)) {
    let content = fs.readFileSync(ubicacionPath, 'utf8');

    // Find and replace the .mapa-container CSS rules
    const newMapaCss = `
    .mapa-container {
        width: 100%;
        height: clamp(22rem, 45vw, 70vw);
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 0.1rem solid var(--color-border);
        box-shadow: var(--shadow);
    }
    .mapa-container iframe {
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
    }`;

    // We will rip out the old .mapa-container and .mapa-container iframe entirely and insert the new ones
    content = content.replace(/\.mapa-container\s*{[\s\S]*?}/, '');
    content = content.replace(/\.mapa-container iframe\s*{[\s\S]*?}/, '');

    // Inject right after <style>
    content = content.replace(/<style>/, `<style>\n${newMapaCss}`);

    fs.writeFileSync(ubicacionPath, content, 'utf8');
}

console.log("✅ Assets flipped successfully");
