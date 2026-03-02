import fs from 'fs';
import path from 'path';

const basePath = "e:/adlibswebsites/puntoveterinario/src/pages";

const replacements = [
    // blog.astro
    {
        file: "blog.astro",
        regex: /<p class="subtitulo">[\s\S]*?<\/p>/,
        replace: '<p class="subtitulo">\n    Artículos y consejos veterinarios redactados por nuestros médicos desde San Pablo Tepetlapa, pensados para el bienestar de tu perro o gato.\n</p>'
    },
    // estetica-canina.astro
    {
        file: "servicios/estetica-canina.astro",
        regex: /<p class="subtitulo">[\s\S]*?<\/p>/g,
        replace: '<p class="subtitulo">\n    Baños refrescantes, cortes profesionales y cuidados de spa adaptados de forma segura a las necesidades de tu perro.\n</p>'
    },
    {
        file: "servicios/esterilizacion.astro",
        regex: /title:\s*"Valoración pre-quirúrgica",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "Valoración pre-quirúrgica",\n        desc: "Examen físico integral previo para asegurar que tu mascota esté en óptimas condiciones corporales."'
    },
    {
        file: "servicios/esterilizacion.astro",
        regex: /title:\s*"Cirugía por médico especializado",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "Cirugía por médico especializado",\n        desc: "Técnicas modernas en quirófano equipado para garantizar mínimas molestias y riesgos."'
    },
    {
        file: "servicios/esterilizacion.astro",
        regex: /title:\s*"Cerca de ti en Coyoacán",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "Cerca de ti en Coyoacán",\n        desc: "Ubicados en San Pablo Tepetlapa, facilitando significativamente los traslados y citas post-operatorias."'
    },
    {
        file: "servicios/esterilizacion.astro",
        regex: /<p class="subtitulo">[\s\S]*?<\/p>/g,
        replace: '<p class="subtitulo">\n    Ofrecemos esterilización privada para perros y gatos en Coyoacán. Priorizamos la seguridad clínica con anestesia constante y seguimiento.\n</p>'
    },
    {
        file: "servicios/esterilizacion.astro",
        regex: /<p class="[^"]*parrafo-intro[^"]*">[\s\S]*?<\/p>/g,
        replace: '<p class="texto-suave parrafo-intro">\n    En Punto Veterinario blindamos la integridad de tu mascota evitando largas filas y atención masiva de las campañas.\n</p>'
    },
    {
        file: "servicios/consulta-veterinaria.astro",
        regex: /<p class="subtitulo">[\s\S]*?<\/p>/g,
        replace: '<p class="subtitulo">\n    Brindamos consulta médica veterinaria de calidad buscando la máxima vitalidad de tu perro o gato. Garantizamos diagnósticos certeros y trato amable.\n</p>'
    },
    {
        file: "servicios/consulta-veterinaria.astro",
        regex: /title:\s*"Exploración física completa",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "Exploración física completa",\n        desc: "Revisión física integral de pies a cabeza para detectar cualquier anomalía oculta a tiempo."'
    },
    {
        file: "servicios/consulta-veterinaria.astro",
        regex: /title:\s*"Seguimiento post-consulta",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "Seguimiento post-consulta",\n        desc: "Monitoreo constante de la rápida evolución al tratamiento recetado tras abandonar el consultorio."'
    },
    {
        file: "servicios/consulta-veterinaria.astro",
        regex: /title:\s*"Trato personalizado y con amor",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "Trato personalizado y con amor",\n        desc: "Atención humana, empática y verdaderamente compasiva; para que tu mascota se sienta protegida."'
    },
    {
        file: "servicios/consulta-veterinaria.astro",
        regex: /title:\s*"En San Pablo Tepetlapa, CP 04620",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "En San Pablo Tepetlapa, CP 04620",\n        desc: "Accesos principales prácticos en Av. División del Norte sin estrés por distancias abrumadoras."'
    },
    {
        file: "servicios/consulta-veterinaria.astro",
        regex: /title:\s*"Médicos especializados y actualizados",\s*desc:\s*"[^"]+"/g,
        replace: 'title: "Médicos especializados y actualizados",\n        desc: "Conocimientos calibrados al límite de la excelencia académica mediante formación médica continua."'
    },
    {
        file: "servicios/alimento-mascotas.astro",
        regex: /<p class="subtitulo">[\s\S]*?<\/p>/g,
        replace: '<p class="subtitulo">\n    Dietas especializadas y alimentos premium cuidadosamente seleccionados por médicos veterinarios para cuidar la nutrición de tu mascota.\n</p>'
    },
    {
        file: "servicios/laboratorio-clinico.astro",
        regex: /<p class="subtitulo">[\s\S]*?<\/p>/g,
        replace: '<p class="subtitulo">\n    Estudios clínicos rigurosos, desde perfiles hemáticos completos hasta pruebas de enfermedades infecciosas, asegurando diagnósticos precisos mediante ciencia.\n</p>'
    },
    {
        file: "servicios/cirugia-veterinaria.astro",
        regex: /<p class="subtitulo">[\s\S]*?<\/p>/g,
        replace: '<p class="subtitulo">\n    Intervenciones quirúrgicas de vanguardia bajo estrictos protocolos anestésicos para brindar total seguridad clínica a ti y a tu mascota.\n</p>'
    }
];

for (let r of replacements) {
    let fullPath = path.join(basePath, r.file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(r.regex, r.replace);
        fs.writeFileSync(fullPath, content);
    }
}

// Second pass for relatedCards everywhere to fix "..."
const allFiles = [
    "servicios/consulta-veterinaria.astro",
    "servicios/esterilizacion.astro",
    "servicios/cirugia-veterinaria.astro",
    "servicios/laboratorio-clinico.astro",
    "servicios/alimento-mascotas.astro",
    "servicios/estetica-canina.astro",
];

for (let file of allFiles) {
    let full = path.join(basePath, file);
    if (fs.existsSync(full)) {
        let content = fs.readFileSync(full, 'utf8');
        content = content.replace(/title:\s*"Esterilización",\s*emoji:\s*"✂️",\s*href:\s*"\/servicios\/esterilizacion",\s*desc:\s*"[^"]+"/g, `title: "Esterilización",\n        emoji: "✂️",\n        href: "/servicios/esterilizacion",\n        desc: "Procedimiento quirúrgico seguro y privado con anestesia guiada."`);
        content = content.replace(/title:\s*"Consulta Médica",\s*emoji:\s*"🩺",\s*href:\s*"\/servicios\/consulta-veterinaria",\s*desc:\s*"[^"]+"/g, `title: "Consulta Médica",\n        emoji: "🩺",\n        href: "/servicios/consulta-veterinaria",\n        desc: "Diagnóstico preciso, responsable y medicina preventiva para tu mascota."`);

        // Remove trailing "..." if there are any lingering somewhere else
        content = content.replace(/desc:\s*"([^"]+)\.\.\."/g, `desc: "$1."`);
        content = content.replace(/text:\s*"([^"]+)\.\.\."/g, `text: "$1."`);

        // Let's also ensure the FAQ texts have dots instead of ...
        fs.writeFileSync(full, content);
        console.log("✅ Fixed texts " + file);
    }
}
