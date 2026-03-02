import fs from 'fs';
import path from 'path';

const basePath = "e:/adlibswebsites/puntoveterinario";
const file = path.join(basePath, "src/pages/nosotros.astro");

if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // H1 replacement
    content = content.replace(
        /<h1>Conoce a Punto Veterinario \| Coyoacán, CDMX<\/h1>/,
        '<h1>Conoce a Punto Veterinario | Veterinaria en Coyoacán, CDMX</h1>'
    );

    // Initial Paragraph replacement
    const oldP = `<p>
                    Somos una clínica veterinaria en San Pablo Tepetlapa,
                    Coyoacán, especializada en atención médica profesional y
                    llena de amor. Nuestro dedicado equipo de Punto Veterinario 
                    trata a cada paciente que cruza las puertas de la
                    Av. División del Norte 3595 como si fuera propio.
                </p>`;
    const newP = `<p>
                    Somos <strong>Punto Veterinario</strong>, una clínica veterinaria en <strong>San Pablo Tepetlapa</strong> (CP 04620),
                    <strong>Coyoacán</strong>. Dedicada a brindar atención médica profesional y
                    llena de amor. Nuestro dedicado equipo de <strong>Punto Veterinario</strong> 
                    trata a cada paciente que cruza las puertas de la
                    <strong>Av. División del Norte 3595</strong> como si fuera propio. Cuidando profundamente 
                    de cada uno en <strong>Coyoacán</strong> y zonas aledañas del <strong>CP 04620</strong>.
                </p>`;
    // Because spacing might be off, let's just regex swap the internal text
    content = content.replace(/Somos una clínica veterinaria en San Pablo Tepetlapa,[\s\S]*?Av\. División del Norte 3595 como si fuera propio./, `Somos <strong>Punto Veterinario</strong>, una clínica veterinaria en <strong>San Pablo Tepetlapa</strong> (CP 04620),
                    <strong>Coyoacán</strong>. Dedicada a brindar atención médica profesional y
                    llena de amor. Nuestro dedicado equipo de <strong>Punto Veterinario</strong> 
                    trata a cada paciente que cruza las puertas de la
                    <strong>Av. División del Norte 3595</strong> como si fuera propio. Cuidando profundamente 
                    de cada uno en <strong>Coyoacán</strong> y zonas aledañas del <strong>CP 04620</strong>.`);

    // Video tag replacement - to make it multi-source exactly
    content = content.replace(/<video[^>]*?aria-label="Video de la clínica veterinaria Punto Veterinario en Coyoacán, San Pablo Tepetlapa CP 04620 — atención médica para perros"[^>]*?>[\s\S]*?<\/video>/, `<video
                    autoplay
                    muted
                    loop
                    playsinline
                    class="video-hero"
                    aria-label="Video de la clínica veterinaria Punto Veterinario en Coyoacán, San Pablo Tepetlapa CP 04620 — atención médica para perros"
                    title="Punto Veterinario — Clínica Veterinaria en Coyoacán, CDMX"
                >
                    <source src="/videos/veterinaria-coyoacan.mp4" type="video/mp4" />
                    <source src="/videos/veterinaria-coyoacan.mov" type="video/quicktime" />
                </video>`);

    // Ensure video tag is correctly mapped - it was previously
    /*
    <video
                    autoplay
                    muted
                    loop
                    playsinline
                    class="video-hero"
                    aria-label="Video de Punto Veterinario en Coyoacán"
                    title="Punto Veterinario — Clínica Veterinaria en Coyoacán, CDMX"
                >
                    <source src="/videos/veterinaria-coyoacan.mp4" type="video/mp4" />
                    <source src="/videos/veterinaria-coyoacan.mov" type="video/quicktime" />
                </video>
    */
    content = content.replace(/<video[\s\S]*?<\/video>/, `<video
                    autoplay
                    muted
                    loop
                    playsinline
                    class="video-hero"
                    aria-label="Video de la clínica veterinaria Punto Veterinario en Coyoacán, San Pablo Tepetlapa CP 04620 — atención médica para perros"
                    title="Punto Veterinario — Clínica Veterinaria en Coyoacán, CDMX"
                >
                    <source src="/videos/veterinaria-coyoacan.mp4" type="video/mp4" />
                    <source src="/videos/veterinaria-coyoacan.mov" type="video/quicktime" />
                </video>`);

    fs.writeFileSync(file, content, 'utf8');
    console.log("✅ Fixed nosotros texts");
}
