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

function synthesizeShort(text) {
    let lower = text.toLowerCase();

    // FAQ / Context matching
    if (lower.includes('costo') || lower.includes('precio') || lower.includes('cuánto cuesta'))
        return "El costo se evalúa individualmente en consulta según las necesidades específicas de tu mascota.";
    if (lower.includes('cita') || lower.includes('espera'))
        return "Recomendamos agendar cita previa para evitar tiempos de espera y garantizar la atención ideal.";
    if (lower.includes('perros y gatos') || lower.includes('especies'))
        return "Sí, somos un equipo médico especializado exclusivamente en medicina interna y preventiva para perros y gatos.";
    if (lower.includes('cercana') || lower.includes('dónde'))
        return "Estamos ubicados estratégicamente en Av. División del Norte 3595, San Pablo Tepetlapa, CP 04620, Coyoacán.";
    if (lower.includes('campañas') || lower.includes('gratuita'))
        return "Nuestra atención privada garantiza seguridad, cero filas, anestesia monitoreada y seguimiento post-operatorio.";
    if (lower.includes('ayuno') || lower.includes('preparación'))
        return "Tu mascota debe presentarse con 8 a 12 horas de ayuno sólido para su total seguridad.";

    // Cards / Desc matching
    if (lower.includes('exploración') || lower.includes('temperatura'))
        return "Revisión física integral para evaluar el estado general de salud y detectar anomalías tempranas.";
    if (lower.includes('historial') || lower.includes('registro'))
        return "Mantenemos un expediente clínico detallado para un seguimiento médico certero.";
    if (lower.includes('diagnóstico') || lower.includes('tratamiento'))
        return "Elaboramos planes terapéuticos efectivos basados en revisiones estrictas y pruebas de laboratorio.";
    if (lower.includes('seguimiento') || lower.includes('post-operatorio'))
        return "Monitoreo constante y comunicación abierta durante toda la recuperación médica en casa.";
    if (lower.includes('trato personalizado') || lower.includes('amor'))
        return "Atendemos a cada paciente con la paciencia, cariño y compasión que merece en nuestra clínica.";
    if (lower.includes('san pablo tepetlapa') || lower.includes('ubicación'))
        return "Excelente ubicación al sur de la CDMX en Av. División del Norte 3595, CP 04620, Coyoacán.";
    if (lower.includes('médicos especializados') || lower.includes('actualización'))
        return "Veterinarios en constante formación y actualización académica para ofrecer la mejor medicina moderna.";
    if (lower.includes('quirófano') || lower.includes('cirugía'))
        return "Procedimientos quirúrgicos seguros en instalaciones equipadas con anestesia monitoreada.";
    if (lower.includes('análisis') || lower.includes('laboratorio'))
        return "Pruebas de sangre y laboratorio procesadas rápidamente para obtener diagnósticos biológicos exactos.";
    if (lower.includes('baño') || lower.includes('estética'))
        return "Servicio profesional de estética, baño y cortes especializados respetando la tranquilidad de tu mascota.";

    // Alertas
    if (lower.includes('falta de apetito')) return "Rechazo de alimento prolongado o decaimiento severo.";
    if (lower.includes('vómitos') || lower.includes('diarrea')) return "Episodios repetitivos de vómito o diarrea aguda.";
    if (lower.includes('letargo') || lower.includes('debilidad')) return "Debilidad repentina, apatía extrema o letargo severo constante.";
    if (lower.includes('jadeo') || lower.includes('esfuerzo')) return "Dificultad evidente para respirar, quejidos o jadeo anormalizado.";
    if (lower.includes('heridas') || lower.includes('cortes')) return "Laceraciones, sangrados activos o sospechas tras accidentes.";

    // Fallback logic -> first sentence up to 22 words max.
    let cleaned = text.trim().replace(/\s+/g, ' ');
    // Remove strong formatting if it ruins words
    let htmlStripped = cleaned.replace(/<[^>]+>/g, '');
    let sentence = htmlStripped.split(/\. /)[0];
    let words = sentence.split(' ');
    if (words.length > 20) {
        return words.slice(0, 20).join(' ') + '...';
    }
    return sentence + (sentence.endsWith('.') ? '' : '.');
}

for (const suffix of allFiles) {
    const file = path.join(basePath, suffix);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace `desc: "LONG TEXT"` strings
    // Needs to ignore cases where desc is already very small (e.g. < 40 chars)
    content = content.replace(/desc:\s*(`|"|')([\s\S]*?)\1/g, (match, quote, p1) => {
        if (p1.length < 80) return match; // Already short
        return `desc: ${quote}${synthesizeShort(p1)}${quote}`;
    });

    // 2. Replace `text: "LONG TEXT"` strings (FAQ and Alerta)
    content = content.replace(/text:\s*(`|"|')([\s\S]*?)\1/g, (match, quote, p1) => {
        if (p1.length < 80) return match;
        return `text: ${quote}${synthesizeShort(p1)}${quote}`;
    });

    // 3. Replace <p class="...TEXT..."> HTML contents that are too long
    content = content.replace(/<p class="([^"]*)">([\s\S]*?)<\/p>/g, (match, cls, inner) => {
        let textOnly = inner.replace(/<[^>]+>/g, '').trim();
        // Skip empty or short
        if (textOnly.length < 90) return match;
        // Skip map links or specific stuff
        if (inner.includes('<a') || inner.includes('📍')) {
            if (inner.length > 200) {
                // Try to selectively shorten
            } else {
                return match;
            }
        }

        let newContent = synthesizeShort(inner);

        // Retain specific HTML if "punto veterinario" is mentioned heavily to not lose keywords
        if (inner.includes('División del Norte')) {
            newContent = `Somos <strong>Punto Veterinario</strong>, clínica en <strong>San Pablo Tepetlapa</strong> (CP 04620), <strong>Coyoacán</strong>. Brindamos atención médica de calidad en <strong>Av. División del Norte 3595</strong>.`;
        }

        return `<p class="${cls}">\n    ${newContent}\n</p>`;
    });

    // 4. Specifically target nested strings in `<div class="faq-item">` or similar if they used <p> without classes
    content = content.replace(/<p>([\s\S]*?)<\/p>/g, (match, inner) => {
        let textOnly = inner.replace(/<[^>]+>/g, '').trim();
        if (textOnly.length < 90) return match;
        if (inner.includes('<a')) return match;

        return `<p>\n    ${synthesizeShort(inner)}\n</p>`;
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Text synthesized in: ${path.basename(suffix)}`);
}
