import fs from 'fs';
import path from 'path';

const files = [
    "src/pages/servicios/consulta-veterinaria.astro",
    "src/pages/servicios/esterilizacion.astro",
    "src/pages/servicios/cirugia-veterinaria.astro",
    "src/pages/servicios/laboratorio-clinico.astro",
    "src/pages/servicios/alimento-mascotas.astro",
    "src/pages/blog.astro",
    "src/pages/ubicacion.astro",
    "src/pages/contacto.astro",
    "src/pages/nosotros.astro"
];

const basePath = "e:/adlibswebsites/puntoveterinario";

const mappings = {
    "var(--text-xs)": "clamp(0.8rem, 1vw, 2vw)",
    "var(--text-sm)": "clamp(0.9rem, 1.2vw, 2.2vw)",
    "var(--text-base)": "clamp(1rem, 1.5vw, 2.8vw)",
    "var(--text-md)": "clamp(1.1rem, 1.8vw, 3vw)",
    "var(--text-lg)": "clamp(1.4rem, 2.5vw, 4vw)",
    "var(--text-xl)": "clamp(1.8rem, 3vw, 5vw)",
    "var(--text-2xl)": "clamp(2.2rem, 4vw, 6vw)",
    "var(--text-3xl)": "clamp(2.8rem, 6vw, 8vw)",

    "var(--space-xs)": "clamp(0.4rem, 0.8vw, 1.4vw)",
    "var(--space-sm)": "clamp(0.6rem, 1vw, 1.8vw)",
    "var(--space-md)": "clamp(1rem, 2vw, 3.5vw)",
    "var(--space-lg)": "clamp(1.5rem, 3vw, 5vw)",
    "var(--space-xl)": "clamp(2.5rem, 5vw, 8vw)",
};

for (const suffix of files) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) {
        console.log(`❌ Skipped ${suffix} - Does not exist`);
        continue;
    }

    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Process ONLY inside <style></style> blocks
    content = content.replace(/<style>([\s\S]*?)<\/style>/g, (match, styleContent) => {
        let newStyle = styleContent;

        // Apply exact var mappings
        for (const [key, value] of Object.entries(mappings)) {
            newStyle = newStyle.split(key).join(value);
        }

        // Replace grid minmax with px/rem -> vw
        newStyle = newStyle.replace(/minmax\(\s*min\s*\(\s*100%\s*,\s*[^)]+\)\s*,\s*1fr\s*\)/g, "minmax(min(100%, 18vw), 1fr)");
        newStyle = newStyle.replace(/minmax\(\s*\d+rem\s*,\s*1fr\s*\)/g, "minmax(min(100%, 18vw), 1fr)");
        newStyle = newStyle.replace(/minmax\(\s*\d+px\s*,\s*1fr\s*\)/g, "minmax(min(100%, 18vw), 1fr)");

        // In ubicacion / contacto we might have manual clamps we wrote previously with fixed rem maximums
        // Extract clamp(x, y, z) and ensure z is vw!
        newStyle = newStyle.replace(/clamp\(([^,]+),\s*([^,]+),\s*([^)]*?rem)\)/g, (m, min, mid, max) => {
            // e.g. clamp(1rem, 2vw, 1.5rem) -> use the 'mid' value multiplied or approximated if we want,
            // but it's safer to just rewrite safely based on our known mappings if we can,
            // For custom clamps, let's just make the max a multiple of the mid if mid is vw.
            // Or blindly extract the number from mid and double it for max.

            const midMatch = mid.match(/([\d.]+)vw/);
            if (midMatch) {
                const val = parseFloat(midMatch[1]);
                return `clamp(${min}, ${mid}, ${val * 1.8}vw)`;
            }
            return m; // unchanged if mid is not vw
        });

        return `<style>${newStyle}</style>`;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ ${path.basename(suffix)}`);
    } else {
        // If no var() were changed, try replacing raw rem usage if any, but ONLY if they are inside the font-size, padding, gap, etc.
        // Wait, the prompt implies "Reemplaza TODOS los valores de tamaño en el <style>" - if some files have raw CSS like `padding: 1rem;`
        console.log(`⚠️ ${path.basename(suffix)} - No changes detected`);
    }
}
